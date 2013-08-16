define([
    'streamhub-sdk/jquery',
    'jasmine',
    'streamhub-sdk/event-emitter',
    'jasmine-jquery'],
function ($, jasmine, EventEmitter) {
    describe('A base EventEmitter', function () {
        var emitter, callback;
        
        beforeEach(function() {
            emitter = new EventEmitter();
            callback = jasmine.createSpy();
        });

        it ("should add a listener when .on() is called", function () {
            emitter.on("blah", callback);
            expect(emitter._listeners.blah.length).toBe(1);
            expect(emitter._listeners.blah[0]).toBe(callback);
        });

        it ("should call listener when .emit() is called", function () {
            emitter.on("blah", callback);
            emitter.emit("blah");
            expect(callback).toHaveBeenCalled();
            expect(callback.callCount).toBe(1);
        });

        it ("should remove listener when .removeListener() is called", function () {
            emitter.on("blah", callback);
            emitter.removeListener("blah", callback);
            expect(emitter._listeners.blah.length).toBe(0);
        });
    }); 
});
