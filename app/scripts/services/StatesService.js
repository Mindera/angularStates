'use strict';

angular.module('angularStates')
.factory('StatesService', ['$window', '$rootElement', function ($window, $rootElement) {
    // TODO: Some stuff to implement in the future:
    // - expiration time for each object saved
    // - adapters so that it uses cookies/indexDB for example
    // - reset state method

    var service = {
        namespace: $rootElement.attr('ng-app') ? $rootElement.attr('ng-app') + '.' : '',
        mapping: {},

        /**
         * Registers a service instance on the persistence service
         * @param {Object} serviceInstance registered service instance - for updating its state afterwards
         * @param {String} keyName key used for mapping items the each service
         * @param {Array}  fields service properties that should be saved. Note: the elements of this array
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
                data: {}
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

        /**
         * Save the service state, based on the values mapped for the keyName provided
         * @param {String} keyName key used for mapping items to the service
         **/
        saveState: function(keyName) {
            var serviceInstance = service.mapping[keyName].instance;
            var currentVal;
            var currentValStr;
            // Save each object for that keyname
            var data = service.mapping[keyName].data;
            Object.keys(data).forEach(function(key) {
                currentVal = serviceInstance[key];
                key = service.namespace + key;
                // if the value is defined, save it to LS, otherwise 
                // remove it from LS
                if (typeof currentVal !== 'undefined') {
                    currentValStr = JSON.stringify(currentVal);
                    $window.localStorage.setItem(key, currentValStr);
                } else {
                    $window.localStorage.removeItem(key); 
                }
            });
        },

        /**
         * Recovers the service state
         * @param {String} keyName key used for mapping items to the service
         **/
        recoverState: function(keyName) {
            var serviceInstance = service.mapping[keyName].instance;
            var recoveredVal;
            var recoveredValStr;
            var data = service.mapping[keyName].data;
            var fullKey;
            Object.keys(data).forEach(function(key) {
                fullKey = service.namespace + key;
                // if value is defined in the persitence layer, save it to the
                // service instance, otherwise save the default value present
                // in the data property of the registry
                recoveredValStr = $window.localStorage.getItem(fullKey);
                if (recoveredValStr) {
                    recoveredVal = JSON.parse(recoveredValStr);
                    recoverValue(serviceInstance[key], recoveredVal, keyName, key);
                } else {
                    recoverValue(serviceInstance[key], service.mapping[keyName].data[key], keyName, key);
                }
            }); 
        },

        /**
         * Resets the service state
         * @param {String} keyName key used for mapping itms to the service
         **/
        resetState: function(keyName) {
            var serviceInstance = service.mapping[keyName].instance;
            var data = service.mapping[keyName].data;
            var fullKey;
           Object.keys(data).forEach(function(key) {
                fullKey = service.namespace + key;
                // remove the value from the persistence layer and set to the default one
                $window.localStorage.removeItem(fullKey);
                serviceInstance[key] = service.mapping[keyName].data[key];
           }); 
        }
    };

    /**
     * Recovers a value back to the serve instance
     * @param {Object} serviceObjectValue object from service instance (to be updated)
     * @param {Object|String|Number} recoveredVal value recovered from persistence layer
     * @param {String} keyName name registered by service (used in mapping)
     * @param {String} key     field name
     **/
    function recoverValue(serviceObjectValue, recoveredVal, keyName, key) {
        // if the recoveredVal is the same as the destination object 
        // when the default value for recovering is the services's self initial property
        // value, don't copy or assign, just return
        if (serviceObjectValue === recoveredVal) {
            return;
        }
        if (typeof serviceObjectValue === 'object') {
            angular.copy(recoveredVal, serviceObjectValue);
        } else {
            service.mapping[keyName].instance[key] = recoveredVal;
        }
    }

    /**
     * Save the object passed to the register method, saving it to the data property on the
     * service mapping
     * @param {String} keyName name registered by service
     * @param {Object} obj     object passed to the register method, specifying default value and
     * expiration time
     **/
    function handleObject(keyName, obj) {
        Object.keys(obj).forEach(function(key) {
            service.mapping[keyName].data[key] = obj[key];   
        });
    }

    /**
     * Save the string passed to the register method, saving it to the data property on the
     * service mapping
     * @param {String} keyName name registered by service
     * @param {String} fieldName property name
     * expiration time
     **/
    function handleString(keyName, fieldName) {
        service.mapping[keyName].data[fieldName] = undefined;   
    }

    return service;
}]);


