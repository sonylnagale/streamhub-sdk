define(['streamhub-sdk/streams/livefyre-stream'], function (LivefyreStream) {

	/**
	 * A Transform stream that transforms state objects from Livefyre APIs
	 * into streamhub-sdk Content instances
	 */
	function StateToContent (opts) {
		opts = opts || {};
		this._authors = opts.authors || {};
	}

	StateToContent.prototype.transform = function (state) {
		return StateToContent.transform(state);
	};


	StateToContent.transform = LivefyreStream.createContent;


	return StateToContent;
});