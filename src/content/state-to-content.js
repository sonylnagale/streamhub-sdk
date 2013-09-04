define([
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/types/livefyre-twitter-content',
    'streamhub-sdk/content/types/livefyre-facebook-content',
    'streamhub-sdk/content/types/oembed',
    'streamhub-sdk/content/types/livefyre-oembed',
    'streamhub-sdk/storage'
], function (LivefyreContent, LivefyreTwitterContent, LivefyreFacebookContent,
Oembed, LivefyreOembed, Storage) {

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
        var isPublic = (typeof state.vis === 'undefined') || (state.vis === 1),
            isReply = state.content.parentId,
            isContent = (state.type === 0),
            childStates = state.childContent || [],
            childContent,
            content,
            childContent;

        // TODO: Non-vis states may still have childContent!
        if ( ! isPublic) {
        	return;
        }

        content = StateToContent._createContent(state, author);

        // Store content with IDs in case we later get
        // replies or attachments targeting it
        if (content && content.id) {
            Storage.set(content.id, content);
        }

        // Get child states (replies and attachments)
        childStates = state.childContent || [];
        // Transform child states (replies and attachments)
        // This will put them in Storage
        for (var i=0, numChildren=childStates.length; i < numChildren; i++) {
            childContent = this.transform(childStates[i]);
        }

        // At this point, all content and children (recursively)
        // Are stored by ID

        // Attach attachments to their target, or store for later
        
        // Add replies to their parent, or store for later

        // TODO: Allow for returning of replies
        if (isReply) {
            return;
        }

        return content;
	}


    StateToContent._createContent = function (state, author) {
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
    };


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