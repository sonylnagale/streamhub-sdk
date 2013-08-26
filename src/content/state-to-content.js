define([
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/types/livefyre-twitter-content',
    'streamhub-sdk/content/types/livefyre-facebook-content',
    'streamhub-sdk/content/types/livefyre-oembed'
], function (LivefyreContent, LivefyreTwitterContent, LivefyreFacebookContent,
LivefyreOembed) {

	/**
	 * An Object that transforms state objects from Livefyre APIs
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


    /**
     * Creates the correct content type given the supplied "state".
     * @param state {Object} The livefyre content "state" as received by the
     *     client.
     * @return {LivefyreContent} A new, correctly typed, content object. 
     */
	StateToContent.transform = function (state, author) {
        var sourceName = StateToContent.enums.source[state.source];
		state.author = author;
        if (state.type === 3) {
            return new LivefyreOembed(state);
        } else if (sourceName === 'twitter') {
            return new LivefyreTwitterContent(state);
        } else if (sourceName === 'facebook') {
            return new LivefyreFacebookContent(state);
        } else if (['livefyre','feed'].indexOf(sourceName) !== -1) {
            return new LivefyreContent(state);
        }
	}


    StateToContent.enums = {};


    StateToContent.enums.source = [
        "livefyre", 
        "twitter",
        "twitter",
        "facebook",
        "livefyre",
        "livefyre",
        "facebook",
        "twitter",
        "livefyre",
        "unknown",
        "unknown",
        "unknown",
        "unknown",
        "feed",
        "facebook"
    ];


	return StateToContent;
});