define([
	'jasmine',
	'streamhub-sdk/streams/more'],
function (jasmine, More) {
	describe('streamhub-sdk/streams/more', function () {
		it('is a function', function () {
			expect(More).toEqual(jasmine.any(Function));
		});
		describe('when constructed', function () {
			var more;
			beforeEach(function () {
				more = new More();
			});
			it('goal defaults to 0', function () {
				expect(more.getGoal()).toBe(0);
				more.write(1);
				expect(more.read()).toBe(null);
			});
			describe('.setGoal(newGoal)', function () {

			});
		});
		describe('when constructed with an opts.goal', function () {
			var more,
				goal;
			beforeEach(function () {
				goal = 5;
				more = new More({
					goal: goal
				});
			});
			it('.getGoal() returns goal', function () {
				expect(more.getGoal()).toBe(goal);
			});
			it('will read out the first items upto goal, but no more', function () {
				var writeGoal = goal + 5,
					readGoal = goal;
				// Write goal times, and then some
				while (writeGoal--) {
					more.write(writeGoal);
				}
				// Read goal times, each time should return something
				while (readGoal--) {
					expect(more.read()).not.toBe(null);
				}
				// Then it should return null
				expect(more.read()).toBe(null);
			});
		});
	});
});