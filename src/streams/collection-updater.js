define([
	'inherits',
	'stream/readable',
    'streamhub-sdk/clients/livefyre-bootstrap-client',
	'streamhub-sdk/debug'],
function (inherits, Readable, BootstrapClient, debug) {

	var log = debug('streamhub-sdk/streams/collection-updater');


	function CollectionUpdater (opts) {
		opts = opts || {};

        this._network = opts.network;
        this._siteId = opts.siteId;
        this._articleId = opts.articleId;
        this._environment = opts.environment;

        this._bootstrapClient = opts.bootstrapClient || BootstrapClient;
        this._isInitingFromBootstrap = false;
        this._finishedInitFromBootstrap = false;
        this._contentIdsInHeadDocument = [];

		Readable.call(this, opts);
	}

	inherits(CollectionUpdater, Readable);


	return CollectionUpdater;
});