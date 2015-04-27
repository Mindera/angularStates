'use strict'; describe('Service: StatesService', function () {

    // load the controller's module
    beforeEach(module('angularStates'));

    var windowMock;
    var statesService;

    beforeEach(inject(['StatesService', '$window', function(_statesService_, $window) {
        statesService = _statesService_;
        windowMock = $window;
    }]));

    describe('register function', function() {
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
                    statesService.register(this, this.name, ['data', {name: 'otherData', value: {}}]);
                },
                load: function() {
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
            service1.load();
            // assert stuff
            expect(Object.keys(statesService.mapping).length === 1);
            expect(statesService.mapping[service1.name] === service1);
        });

        it('should populate the default values for each service field', function() {
            // register service1
            service1.init();
            service1.load();

            // assert stuff
            // the default data for service1 registration should be 2 (number of fields registered)
            expect(Object.keys(statesService.mapping[service1.name].data).length).toEqual(2);

            // default value for service1.otherData should be the provided ({})
            expect(statesService.mapping[service1.name].data.otherData).toEqual({});

            // default value for service1.data should be default (undefined) as it wasn't provided by the service
            expect(statesService.mapping[service1.name].data.data).toEqual(undefined);
        });

        it('should throw an error if the same register key is used by one than more service', function() {
            var name = 'same name';
            var s1 = {name: name, data: [1,2,3]};
            var s2 = {name: name, data: [4,5,6]};

            // 1s service registers
            statesService.register(s1, s1.name, ['data']);

            // 2nd service registers
            expect( function(){ statesService.register(s2, s2.name, ['data']);}).toThrow(new Error('keyName \"' + name + '\" already in use.'));
        });
    });

    describe('recoverState function', function () {
        var service1;
        var otherDataDefaultValue = {
            stuff: 'default value'
        };
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
                staticData: true,
                init: function() {
                    statesService.register(this, this.name, ['data', {name: 'otherData', value: otherDataDefaultValue}]);
                },
                load: function() {
                    statesService.recoverState(this.name);
                },
                save: function() {
                    statesService.saveState(this.name);
                },
                reset: function() {
                    statesService.resetState(this.name);
                },
                update: function() {
                    this.data.booleanValue = !this.data.booleanValue;
                    this.data.arrayValue.push(4);
                }
            };
            // clean local storage
            windowMock.localStorage.clear();
        });

        it('should override unsaved changes made in the service', function () {
            // register and init service
            service1.init();

            // save state
            service1.save();

            // make changes
            service1.update();

            // check changes were applied
            expect(service1.data.booleanValue).toEqual(false);
            expect(service1.data.arrayValue.length).toEqual(4);

            // recover old state
            service1.load();

            // check state
            expect(service1.data.booleanValue).toEqual(true);
        });

        it('should recover default values (for unexisting fields) correctly', function() {
            // 'data' property should be retrieved as empty since no default value was provied   
            // and 'otherData' should be retrieved as the default object provided

            // init service and recover state
            service1.init();
            service1.load();
            
            // assertions
            expect(service1.data).not.toBeDefined();
            expect(service1.otherData).toEqual(otherDataDefaultValue);
        });

        it('should not affect the service properties that are not registered in the states service.', function() {
            // register and init service
            service1.init();
            service1.update();
            
            // save state
            service1.load();

           // check that staticData is not affected
            expect(service1.staticData).toEqual(true);
        });

        it('should not use angular.copy fn when the recovered value is the same of the destiny', function() {
            service1.init = function() {
                statesService.register(this, this.name, ['data', {name: 'otherData', value: service1.otherData}]);
            };

            service1.init();
            spyOn(angular, 'copy');
            var initialCount = angular.copy.calls.count();
            service1.load();
            expect(angular.copy.calls.count()).toEqual(initialCount);
        });

    });

    describe('clearStorage and resetState function', function () {
        var service1;
        var otherDataDefaultValue = {
            stuff: 'default value'
        };
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
                staticData: true,
                init: function() {
                    statesService.register(this, this.name, ['data', {name: 'otherData', value: otherDataDefaultValue}]);
                },
                load: function() {
                    statesService.recoverState(this.name);
                },
                save: function() {
                    statesService.saveState(this.name);
                },
                clear: function() {
                    statesService.clearStorage(this.name);
                },
                reset: function() {
                    statesService.resetState(this.name);
                }
            };
            // clean local storage
            windowMock.localStorage.clear();
        });

        it('clearStorage function should clear the clear the storage items associated to the registered service', function() {
            service1.init();
            service1.save();
            expect(Object.keys(windowMock.localStorage).length).toEqual(2); 
            service1.clear();
            expect(Object.keys(windowMock.localStorage).length).toEqual(0); 
        });

        it('resetState function should set the service properties to the default ones and clear the clear the storage items associated to that service', function() {
            service1.init();
            service1.save();
            spyOn(statesService, 'recoverState');
            spyOn(statesService, 'clearStorage');
            service1.reset();
            expect(statesService.recoverState).toHaveBeenCalled();
            expect(statesService.clearStorage).toHaveBeenCalled();

        });
    });

});