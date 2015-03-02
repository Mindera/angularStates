'use strict';

angular.module('angularStates')
.factory('StatesService', ['$window', '$rootElement', function ($window, $rootElement) {
    // TODO: Some stuff to implement in the future:
    // - expiration time for each object saved
    // - adapters so that it uses cookies/indexDB for example

    var service = {
        namespace: $rootElement.attr('ng-app') ? $rootElement.attr('ng-app') + '.' : '',
        mapping: {},

        /**
         * Registers a service instance on the persistence service
         * @param {Object} serviceInstance registered service instance - for updating its state afterwards
         * @param {String} keyName key used for mapping items to the each service
         * @param {Array}  fields service properties that should be saved. Note: the elemnts of this array
         * can be strings (name of the field) or objects (containing default value to use in case of absence
         * in the persistence layer, and expiration time)
         * @throws {Error} will throw if the current keyName is already in use  
         **/
        register: function(serviceInstance, keyName, fields) {
            if (service.mapping[keyName] !== undefined) {
                throw new Error('keyName "' + keyName + '" already in use.'); 
            }
            service.mapping[keyName] = {
                instance: serviceInstance,
                objects: {}
            };

            fields.map(function(field) {
                var type = typeof field;
                switch (type) {
                    case 'object' : handleObject(keyName, field); break;
                    case 'string' : handleString(keyName, field); break;
                    default: break;
                }
            });
        },

        saveState: function(keyName) {
            var serviceInstance = service.mapping[keyName].instance;
            var currentVal;
            var currentValStr;
            // Save each object for that keyname
            var objects = service.mapping[keyName].objects;
            Object.keys(objects).forEach(function(key) {
                currentVal = serviceInstance[key];
                key = service.namespace + key;
                // if the value is defined, save it to LS, otherwise 
                // remove it from LS
                if (currentVal) {
                    currentValStr = JSON.stringify(currentVal);
                    $window.localStorage.setItem(key, currentValStr);
                } else {
                    $window.localStorage.removeItem(key); 
                }
            });
        },

        recoverState: function(keyName) {
            var serviceInstance = service.mapping[keyName].instance;
            var recoveredVal;
            var recoveredValStr;
            var objects = service.mapping[keyName].objects;
            var fullKey;
            Object.keys(objects).forEach(function(key) {
                fullKey = service.namespace + key;
                // if value is defined in the LS, save it to the
                // service instance, otherwise save the default value present
                // in the objects property of the registry
                recoveredValStr = $window.localStorage.getItem(fullKey);
                if (recoveredValStr) {
                    recoveredVal = JSON.parse(recoveredValStr);
                    serviceInstance[key] = recoveredVal;
                } else {
                    serviceInstance[key] = service.mapping[keyName].objects[key];
                }
            }); 
        }
    };

    function handleObject(keyName, obj) {
        Object.keys(obj).forEach(function(key) {
            service.mapping[keyName].objects[key] = obj[key];   
        });
    }

    function handleString(keyName, field) {
        service.mapping[keyName].objects[field] = undefined;   
    }

    return service;
}]);


