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
        var service1;
        beforeEach(function () {
            service1 = {
                name: 'service1', 
                data: {
                    booleanValue: true,
                    strValue: 'John', 
                    arrayValue: [1,2,3],
                    objValue: {}
                },
                otherData: {
                    stuff: 'info'
                },
                init: function() {
                    statesService.register(this, this.name, ['data', {'otherData': {}}]);
                    statesService.recoverState(this.name);
                },
                save: function() {
                    statesService.saveState(this.name);
                },
                reset: function() {
                    statesService.resetState(this.name);
                }
            };
        });

        it('should create an entry for each service registered, with the correct format', function() {
            // register service1
            service1.init();
           console.log(statesService.mapping); 
            
          //expect(condition).toEqual();
        });
          
        it('should throw an error if the same register key is used by one than more service', function() {
            var name = "same name";
            var s1 = {name: name, data: [1,2,3]};
            var s2 = {name: name, data: [4,5,6]};

            // 1s service registers
            statesService.register(s1, s1.name, ['data']);
            
            // 2nd service registers
            expect( function(){ statesService.register(s2, s2.name, ['data'])}).toThrow(new Error('keyName \"' + name + '\" already in use.'));
        });
    });
});