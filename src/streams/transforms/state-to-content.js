define([
	'inherits',
	'stream/transform',
	'streamhub-sdk/streams/livefyre-stream'],
function (inherits, Transform, LivefyreStream) {

	/**
	 * A Transform stream that transforms state objects from Livefyre APIs
	 * into streamhub-sdk Content instances
	 */
	function StateToContent (opts) {
		opts = opts || {};
		this._authors = opts.authors;
		Transform.call(this, opts);
	}

	inherits(StateToContent, Transform);


	StateToContent.prototype._transform = function (state, done) {
		var content = LivefyreStream.createContent(state);
		this.push(content);
		done();
	};


	return StateToContent;
});