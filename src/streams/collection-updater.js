define([
	'inherits',
	'stream/readable',
    'streamhub-sdk/clients/livefyre-bootstrap-client',
    'streamhub-sdk/clients/livefyre-stream-client',
    'streamhub-sdk/content/state-to-content',
	'streamhub-sdk/debug'],
function (inherits, Readable, BootstrapClient, StreamClient, StateToContent,
debug) {

	var log = debug('streamhub-sdk/streams/collection-updater');


	function CollectionUpdater (opts) {
		opts = opts || {};

        this._network = opts.network;
        this._siteId = opts.siteId;
        this._articleId = opts.articleId;
        this._environment = opts.environment;

        this._streamClient = opts.streamClient || StreamClient;
        this._bootstrapClient = opts.bootstrapClient || BootstrapClient;
        this._isInitingFromBootstrap = false;
        this._finishedInitFromBootstrap = false;
        this._contentIdsInHeadDocument = [];

		Readable.call(this, opts);
	}

	inherits(CollectionUpdater, Readable);


	/**
     * @private
     * Called by Readable base class. Do not call directly
     * Get content from bootstrap and .push() onto the read buffer
     */
    CollectionUpdater.prototype._read = function () {
        var self = this,
            bootstrapClientOpts,
            stateToPush;
        log('_read', 'Buffer length is ' + this._readableState.buffer.length);

        // The first time this is called, we first need to get Bootstrap init
        // to know what the latest page of data
        if ( ! this._finishedInitFromBootstrap) {
            log('requesting bootstrap init');
            return this._getLatestEvent(function (err, latestEvent) {
                self._latestEvent = latestEvent;
                self._stream();
            });
        }
        
        self._stream();
    };


    CollectionUpdater.prototype._stream = function () {
    	var self = this,
    		streamClient = this._streamClient,
    		latestEvent = this._latestEvent,
    		streamClientOpts = this._getCollectionOptions();

    	// Request stream from the last Event ID we know about
    	streamClientOpts.commentId = latestEvent;
    	streamClient.getContent(streamClientOpts, function (err, data) {
    		if (err && err !== "Timeout") {
    			self.emit('error', err);
    			return;
    		}
    		var contents = self._contentsFromStreamData(data);
    		// Update _latestEvent so we only get new data
    		self._latestEvent = data.maxEventId;
    		// Push Content from this stream response
    		// _read() will be called again to get more Content
    		self.push.apply(self, contents);
    	});
    };


    CollectionUpdater.prototype._contentsFromStreamData = function (streamData) {
		var states = streamData.states,
			stateToContent = new StateToContent(streamData),
			state,
			content,
			contents = [];
		for (var contentId in states) {
			if (states.hasOwnProperty(contentId)) {
				state = states[contentId];
	            content = stateToContent.transform(state);
				if ( ! content) {
					continue;
				}
				contents.push(content);
			}
		}
		return contents;
    };


    /**
     * @private
     * Request the Bootstrap init endpoint for the Collection to learn
     * what the latest event is. This gets called the first time Stream
     * base calls _read().
     * @param errback {function} A callback to be passed (err|null, the number
     *     of pages of content in the collection, the headDocument containing
     *     the latest data)
     */
    CollectionUpdater.prototype._getLatestEvent = function (errback) {
        var self = this,
            collectionOpts;

        if (this._isInitingFromBootstrap) {
            log("_getBootstrapInit was called, but I'm already requesting " +
                "init and haven't gotten a response. This probably shouldn't " +
                "happen.");
            return;
        }
        this._isInitingFromBootstrap = true;

        // Use this._bootstrapClient to request init (init is default when
        // no opts.page is specified)
        collectionOpts = this._getCollectionOptions();
        this._bootstrapClient.getContent(collectionOpts, function (err, data) {
            if (err) {
                log("Error requesting Bootstrap init", err, data);
                self.emit('error', err);
            }

            var headDocument = data.headDocument,
                collectionSettings = data.collectionSettings,
                latestEvent = collectionSettings.event;

            self._isInitingFromBootstrap = false;
            self._finishedInitFromBootstrap = true;

            errback.call(self, err, latestEvent);
        });
    };


    /**
     * @private
     * Get options to pass to this._bootstrapClient methods to specify
     * which Collection we care about
     */
    CollectionUpdater.prototype._getCollectionOptions = function () {
        return {
            environment: this._environment,
            network: this._network,
            siteId: this._siteId,
            articleId: this._articleId
        };
    };


	return CollectionUpdater;
});