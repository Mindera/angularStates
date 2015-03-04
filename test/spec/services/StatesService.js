'use strict';

describe('Service: StatesService', function () {

    // load the controller's module
    beforeEach(module('angularStates'));

    var windowMock,
    statesService,
    scope;

    beforeEach(inject(['StatesService', '$window', function(_statesService_, $window) {
        statesService = _statesService_;
        windowMock = $window;
    }]));

    describe('Register Function', function() {
        it('should throw an error if the same key is used by one than more service', function() {
            var name = "same name";
            var s1 = {name: name, data: [1,2,3]};
            var s2 = {name: name, data: [4,5,6]};

            // 1s service registers
            service.register(s1.name, ['data']);
            
            // 2nd service registers
            expect( function(){ service.register(s2.name, ['data']).toThrow(new Error("keyName " + name + " already in use."));
            
            expect(true).toBe(true);
        });
    });
});