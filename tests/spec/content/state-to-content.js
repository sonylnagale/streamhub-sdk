define([
	'jasmine',
	'streamhub-sdk/content/state-to-content'],
function (jasmine, StateToContent) {
	describe('streamhub-sdk/streams/transforms/state-to-content', function () {
		it('is a constructor', function () {
			expect(StateToContent).toEqual(jasmine.any(Function));
			expect(StateToContent.prototype).toEqual(jasmine.any(Object));
		});
		describe('StateToContent.transform(state, opts)', function () {
			var transform = StateToContent.transform;
			it('is a static method', function () {
				expect(transform).toEqual(jasmine.any(Function));
			});
		});
		describe('instance', function () {
			var stateToContent;
			beforeEach(function () {
				stateToContent = new StateToContent();
			});
			it('is instanceof StateToContent', function () {
				expect(stateToContent instanceof StateToContent).toBe(true);
			});
		});
	});
});