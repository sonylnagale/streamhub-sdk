define([
    'streamhub-sdk/jquery',
    'jasmine',
    'streamhub-sdk/storage',
    'streamhub-sdk/content',
    'jasmine-jquery'],
function ($, jasmine, Storage, Content) {
    'use strict';

    describe('Storage', function () {
        var contentA,
            contentB;
        beforeEach(function () {
            Storage.cache = {};
            contentA = new Content("Body A");
            contentB = new Content("Body B");
        });
        
        describe(".set", function () {
            beforeEach(function () {
                
            });
            
            it("adds new contents and emits 'add'", function () {
                spyOn(Storage, "emit");
                
                Storage.set(contentA.id, contentA);
                
                expect(Storage.cache[contentA.id]).toEqual(contentA);
                expect(Storage.emit).toHaveBeenCalledWith('add');
            });

            it("updates existing contents and emits 'change'", function () {
                spyOn(Storage, "emit");
                
                Storage.set(contentA.id, contentA);
                Storage.set(contentA.id, contentB);
                
                //TODO (joao) Come up with a better validation
                //Storage isn't actually supposed to replace the old Content
                //with the new Content; it's supposed to set the properties
                //of the new Content on the old Content object.
                expect(Storage.cache[contentA.id].body).toEqual(contentB.body);
                expect(Storage.emit).toHaveBeenCalledWith('change');
            });
            
            it("returns content", function () {
                var val = Storage.set('key', contentA);
                
                expect(val).toEqual(contentA);
            });
            
            it("executes callback when provided", function () {
                var spy = jasmine.createSpy('callback');
                
                Storage.set('key', contentA, spy);
                
                expect(spy).toHaveBeenCalledWith(contentA);
            });
        });
        
        describe(".get", function () {
            var key;
            beforeEach(function () {
                key = contentA.id;
                Storage.cache = {key: contentA};
            });
            
            it("returns content", function () {
                var val = Storage.get(key);
                
                expect(val).toEqual(contentA);
            });
            
            it("returns undefined when there is no data for that key", function () {
                var val = Storage.get('fake key');
                
                expect(val).not.toBeDefined();
            });
            
            it("executes callback when provided", function () {
                var spy = jasmine.createSpy('callback');
                Storage.get('key', spy);
                
                expect(spy).toHaveBeenCalledWith(contentA);
            });
        });
    });
});
