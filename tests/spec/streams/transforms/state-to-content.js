define([
	'jasmine',
	'streamhub-sdk/streams/transforms/state-to-content',
	'stream/transform'],
function (jasmine, StateToContent, Transform) {
	describe('streamhub-sdk/streams/transforms/state-to-content', function () {
		it('is a function', function () {
			expect(StateToContent).toEqual(jasmine.any(Function));
		});
		describe('instance', function () {
			var stateToContent;
			beforeEach(function () {
				stateToContent = new StateToContent();
			});
			it('is instanceof StateToContent', function () {
				expect(stateToContent instanceof StateToContent).toBe(true);
			});
			it('is a Transform', function () {
				expect(stateToContent instanceof Transform).toBe(true);
			});
		});
	});
});