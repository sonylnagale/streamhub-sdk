define([], function () {
	/**
	 * An Object that represents a hosted StreamHub Collection
	 */
	function Collection (opts) {
		this.network = opts.network;
		this.siteId = opts.siteId;
		this.articleId = opts.articleId;
		this.environment = opts.environment;
	}

	return Collection;
});