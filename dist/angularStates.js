'use strict';

/**
 * @ngdoc overview
 * @name angularStatesApp
 * @description
 * # angularStatesApp
 *
 * Module of the Angular States.
 */
angular
  .module('angularStates', [
    'ngCookies'
  ]);

/**
 * @ngdoc service
 * @name StatesService
 * @description 
 *   Angular JS Service for managing service states (saving / restoring / invalidating)
 */

'use strict';

angular.module('angularStates')
.factory('StatesService', ['$window', '$rootElement', function ($window, $rootElement) {
    // TODO: Some stuff to implement in the future:
    // - adapters so that it supports cookies/indexDB for example

    var service = {
        namespace: $rootElement.attr('ng-app') ? $rootElement.attr('ng-app') + '.' : '',
        mapping: {},

        /**
         * Registers a service instance on the persistence service
         * @memberof StatesService
         * @param {Object} serviceInstance registered service instance - for updating its state afterwards
         * @param {String} keyName key used for mapping items the each service
         * @param {Array}  fields service properties that should be saved. Note: the elements of this array
         * can be strings (name of the field) or objects. In case of object, they must use the following schema
         * {
         *    name: 'property name', // String
         *    value: defaultValue,   // any type
         *    expire: 1231           // Integer (time of expiration in milliseconds for the current field)
         * }
         * @throws {Error} will throw if the current keyName is already in use  
         **/
        register: function(serviceInstance, keyName, fields) {
            if (service.mapping[keyName] !== undefined) {
                throw new Error('keyName "' + keyName + '" already in use.'); 
            }
            service.mapping[keyName] = {
                instance: serviceInstance,
                data: {},
                expire: {}
            };

            fields.map(function(field) {
                var typeOfArgument = typeof field;
                switch (typeOfArgument) {
                    case 'object' : handleObject(keyName, field); break;
                    case 'string' : handleString(keyName, field); break;
                    default: break;
                }
            });
        },

        /**
         * Save the service state, based on the values mapped for the keyName provided
         * @memberof StatesService
         * @param {String} keyName key used for mapping items to the service
         **/
        saveState: function(keyName) {
            var serviceInstance = service.mapping[keyName].instance;
            var currentVal;
            var now = new Date(), then;
            // Save each object for that keyName
            var data = service.mapping[keyName].data;
            Object.keys(data).forEach(function(key) {
                currentVal = serviceInstance[key];
                key = service.namespace + key;
                // if the value is defined, save it to LS, otherwise 
                // remove it from LS
                if (typeof currentVal !== 'undefined') {
                    // Encapsulate value in wrapper object so that we can use json stringify/parse
                    // with confidence
                    var wrapperObj = {
                        value: currentVal
                    };
                    // check if current property has expiration date
                    if (service.mapping[keyName].expire[key]) {
                        then = new Date(now.getTime() + service.mapping[keyName].expire[key]);
                        wrapperObj.expire = then;
                    }
                    wrapperObj = JSON.stringify(wrapperObj); 
                    $window.localStorage.setItem(key, wrapperObj);
                } else {
                    $window.localStorage.removeItem(key); 
                }
            });
        },

        /**
         * Recovers the service state
         * @memberof StatesService
         * @param {String} keyName key used for mapping items to the service
         **/
        recoverState: function(keyName) {
            var serviceInstance = service.mapping[keyName].instance;
            var recoveredVal;
            var data = service.mapping[keyName].data;
            var now = new Date();
            var fullKey;
            Object.keys(data).forEach(function(key) {
                fullKey = service.namespace + key;
                // if value is defined in the persitence layer, save it to the
                // service instance, otherwise save the default value present
                // in the data property of the registry
                recoveredVal  = $window.localStorage.getItem(fullKey);
                if (recoveredVal) {
                    // unwrap value
                    recoveredVal = JSON.parse(recoveredVal);
                    if (!recoveredVal.expire || new Date(recoveredVal.expire) > now) {
                        recoverValue(serviceInstance[key], recoveredVal.value , keyName, key);
                    } else {
                        recoverValue(serviceInstance[key], service.mapping[keyName].data[key], keyName, key);
                    }
                } else {
                    recoverValue(serviceInstance[key], service.mapping[keyName].data[key], keyName, key);
                }
            }); 
        },

        /**
         * Resets the service state and clears the storage of that service
         * @memberof StatesService
         * @param {String} keyName key used for mapping items to the service
         **/
        resetState: function(keyName) {
            service.recoverState(keyName);
            service.clearStorage(keyName);
        },

        /**
         * Clears the service state on the persistence layer
         * @memberof StatesService
         * @param {String} keyName key used for mapping items to the service
         **/
        clearStorage: function(keyName) {
            var data = service.mapping[keyName].data;
            var fullKey;
           Object.keys(data).forEach(function(key) {
                fullKey = service.namespace + key;
                // remove the value from the persistence layer and set to the default one
                $window.localStorage.removeItem(fullKey);
           }); 
        }
    };

    /**
     * Recovers a value back to the service instance
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
        if (typeof serviceObjectValue === 'object' && recoveredVal && recoveredVal !== serviceObjectValue) {
            angular.copy(recoveredVal, serviceObjectValue);
        } else {
            service.mapping[keyName].instance[key] = recoveredVal;
        }
    }

    /**
     * Save the object passed to the register method, saving it to the data property on the
     * service mapping
     * @param {String}     keyName name registered by service
     * @param {Object}     obj        object passed to the register method, specifying default value and
     * @param {String}     obj.name   name of the field
     * @param {*}          obj.value  default value of the field
     * @param {Numbeer}    obj.expire expiration time for the current data
     **/
    function handleObject(keyName, obj) {
        if (obj.value) {
            service.mapping[keyName].data[obj.name] = obj.value;
        } else {
            handleString(keyName, obj.name);
        }
        if (obj.expire) {
            service.mapping[keyName].expire[obj.name] = obj.expire;
        }
    }

    /**
     * Save the string passed to the register method, saving it to the data property on the
     * service mapping
     * Note: This function is needed because even if it does not add new info to the default
     * data set, it adds a new key, which is more semantic and facilitates work afterwards.
     * @param {String} keyName name registered by service
     * @param {String} fieldName property name
     * expiration time
     **/
    function handleString(keyName, fieldName) {
        service.mapping[keyName].data[fieldName] = undefined;   
    }

    return service;
}]);


