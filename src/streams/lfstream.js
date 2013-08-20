define([
	'stream/readable',
	'inherits',
	'streamhub-sdk/clients/livefyre-bootstrap-client',
	'streamhub-sdk/clients/livefyre-stream-client'],
function (Readable, inherits, LivefyreBootstrapClient, LivefyreStreamClient) {
	
	function LivefyreStream (opts) {
		this._opts = opts = opts || {};
		this._bootstrapClient = opts.bootstrapClient || LivefyreBootstrapClient;
		this._finishedInitFromBootstrap = false;
		this._streamClient = opts.streamClient || LivefyreStreamClient;

		opts.objectMode = this.objectMode = true;
		Readable.call(this, opts);

		if ( ! opts.deferInit) {
			this._initFromBootstrap();
		}
	}

	inherits(LivefyreStream, Readable);


	LivefyreStream.prototype._read = function (size) {

	};

	/**
	 * Request Livefyre's Bootstrap init API for the Collection to
	 * - fetch initial 50 or so data
	 * - learn about older pages of data
	 * - learn the latest eventId to start streaming at
	 * 
	 * This will eventually set the following properties:
	 * - collectionId
	 * - _streamEventId
	 * - _nextBootstrapPage
	 */
	LivefyreStream.prototype._initFromBootstrap = function () {
		var self = this;
		this._bootstrapClient.getContent(this._opts, function (err, data) {
			if (err) {
				self.emit('error', new Error('Error requesting Bootstrap init'));
			}
			var headDocument = data.headDocument,
				collectionSettings = data.collectionSettings,
				siteSettings = data.siteSettings,
				networkSettings = data.networkSettings,
				headContent = headDocument && headDocument.content;

			self._finishedInitFromBootstrap = true;

			// Add the content from the headDocument to the read queue
			for (var i=0, numHeadContent=headContent.length; i < numHeadContent; i++) {
				self.push(headContent[i]);
			}
		});
	};

	return LivefyreStream;
});