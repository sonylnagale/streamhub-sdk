define([
	'inherits',
	'stream/readable',
	'stream/util',
	'streamhub-sdk/streams/archive-state-stream',
	'streamhub-sdk/streams/transforms/state-to-content'],
function (inherits, Readable, util, ArchiveStateStream, StateToContent) {
	function CollectionArchive (opts) {
		Readable.call(this);
		var self = this;
		this._states = opts.stateStream || new ArchiveStateStream(opts);
		this._contentTransform = new StateToContent();
		this._states.on('error', function () {
			console.log('statestream error');
		})
		this._contentTransform.on('error', function () {
			console.log('contentTransform error');
		})
		this._contentTransform.on('end', function () {
			self.push(null);
		});
		this._contentTransform.on('readable', function () {
			console.log("contentTransform readable");
			self.read(0);
		});
		this._states.pipe(this._contentTransform);
	}

	inherits(CollectionArchive, Readable);


	CollectionArchive.prototype._read = function () {
		var content = this._contentTransform.read();
		if (content === null) {
			console.log("pushing empty string");
			return this.push('');
		}
		this.push(content);
	};


	return CollectionArchive;
});