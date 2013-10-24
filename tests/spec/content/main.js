define([
    'streamhub-sdk/jquery',
    'jasmine',
    'streamhub-sdk/content',
    'jasmine-jquery'],
function ($, jasmine, Content) {
    'use strict';

    describe('Content', function () {
        it("can be constructed with just a string", function () {
            var body = 'what';
            var content = new Content(body);
            expect(content.body).toBe(body);
        });
        
        it("can be constructed with opts and opts.body", function () {
            var body = 'what';
            var content = new Content({
                body: body
            });
            expect(content.body).toBe(body);
        });
        
        it("has an id", function () {
            var content = new Content('body');
            expect(content.id).toBeDefined();
        });
        
        describe(".set", function () {
            var oldBody,
                newBody,
                content;
            beforeEach(function () {
                oldBody = "Body text";
                newBody = "New body text";
                content = new Content(oldBody);
                spyOn(content, "emit");
            });
            
            it("only emits 'change' when something is changed", function () {
                content.set({body: newBody});//Change
                content.set({body: newBody});//Not changed
                
                expect(content.emit.calls.length).toEqual(2);//emits once per change as well as once per property changed.
                expect(content.emit).toHaveBeenCalledWith('change', {body: newBody}, {body: oldBody});
                expect(content.emit).not.toHaveBeenCalledWith('change', {body: newBody}, {body: newBody});
            });
            
            it("emits 'change:setting' for each setting change", function () {
                content.set({body: newBody, visibility: 2});
                
                expect(content.emit).toHaveBeenCalledWith('change:body', newBody, oldBody);
                expect(content.emit).toHaveBeenCalledWith('change:visibility', 2, 1);
            });
            
            it("emits 'removed' event when its visibility is set to 0", function () {
                content.set({visibility: 2});
                
                expect(content.emeit).toHaveBeenCalledWith('removed');
            });
        });
    });
});
