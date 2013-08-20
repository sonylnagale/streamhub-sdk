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
		var authorId = state.content && state.content.authorId;
		return StateToContent.transform(state, this._authors[authorId]);
	};


	StateToContent.transform = function (state, author) {
		state.author = author;
		return LivefyreStream.createContent(state);
	}


	return StateToContent;
});