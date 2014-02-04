define([
    'streamhub-sdk/content/views/content-view',
    'inherits',
    'streamhub-sdk/jquery'],
function (ContentView, inherits, $) {
    'use strict';

    /**
     * A view for rendering facebook content into an element.
     * @param opts {Object} The set of options to configure this view with (See ContentView).
     * @exports streamhub-sdk/content/views/facebook-content-view
     * @constructor
     */
    var FacebookContentView = function FacebookContentView (opts) {
        ContentView.call(this, opts);
    };
    inherits(FacebookContentView, ContentView);
    
    FacebookContentView.prototype.elClass += ' content-facebook ';

    /**
     * Gets the template rendering context. By default, returns "this.content".
     * @return {Content} The content object this view was instantiated with.
     */
    FacebookContentView.prototype.getTemplateContext = function () {
        var context = ContentView.prototype.getTemplateContext.call(this);
        if (context.attachments.length) {
            context.permalink = context.attachments[0].url;
        }
        
        context.authorUrl = context.author.profileUrl;
        context.authorDisplayName = context.author.displayName;

        context.contentSourceName = 'facbeook';
        context.contentSourceTooltipUrl = context.permalink;
        context.contentSourceTooltipText = 'View on Facebook';

        context.createdAtUrl = context.permalink;

        return context;
    };
    
    return FacebookContentView;
});
