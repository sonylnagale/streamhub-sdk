define([
	'inherits',
	'streamhub-sdk-tests/mocks/clients/livefyre-bootstrap-client',
	'streamhub-sdk-tests/mocks/clients/livefyre-write-client',
	'streamhub-sdk/collection'],
function (inherits, MockLivefyreBootstrapClient, MockLivefyreWriteClient,
Collection) {

	var MockCollection = function (opts) {
		opts = opts || {};
        opts.bootstrapClient = MockLivefyreBootstrapClient;
		Collection.call(this, opts);
	};
	inherits(MockCollection, Collection);


	MockCollection.prototype.createWriter = function () {
		return Collection.prototype.createWriter({
			writeClient: MockLivefyreWriteClient
		});
	};


	return MockCollection;
});