# angularStates
Angular JS Service for managing service states (saving / restoring / invalidating)

## Installation

Just do a ``bower install angularstates``.

## Why?

This service is meant to be used as a 'top layer' on the AngularJS app, for saving, restoring, invalidating services/factories states. 
As mentioned in several AngularJS *good practices* lists and [posts](http://toddmotto.com/rethinking-angular-js-controllers/), using the controller's $scope can lead to a lot of disadvantages (difficult to reuse and test, doesn't separate Model/Controller concers, thight coupling, etc).

However, when keeping the model on services/factories it's sometimes necessary to maintain the state persistent across utilizations, which leads to further validation and (possibily) expiration over time. This service aims to facilitate that task and to make each service state logic easier to apply.

Note: Each service/factory values to be persisted should be made public so that the service can work correctly.

## Usage

Include the 'angularStates' module as a dependency on your app, and include the 'StatesService' when it's needed.

    angular.module('yourApp', ['angularStates', '..'])

### Main Functions
    
* [register(serviceInstance, keyName, fields)](#register)
* [saveState(keyName)](#saveState)
* [recoverState(keyName)](#recoverState)
* [resetState(keyName)](#resetState)
* [handleString(keyName, fieldName)](#handleString)
 
<a name="register"></a>
#register(serviceInstance, keyName, fields)
Registers a service instance on the persistence service

**Params**

- serviceInstance `Object` - registered service instance - for updating its state afterwards  
- keyName `String` - key used for mapping items the each service  
- fields `Array` - service properties that should be saved. Note: the elements of this array
can be strings (name of the field) or objects (containing default value to use in case of absence
in the persistence layer, and expiration time)  

**Type**: `Error`  
<a name="saveState"></a>
#saveState(keyName)
Save the service state, based on the values mapped for the keyName provided

**Params**

- keyName `String` - key used for mapping items to the service  

<a name="recoverState"></a>
#recoverState(keyName)
Recovers the service state

**Params**

- keyName `String` - key used for mapping items to the service  

<a name="resetState"></a>
#resetState(keyName)
Resets the service state

**Params**

- keyName `String` - key used for mapping itms to the service  

<a name="handleString"></a>
#handleString(keyName, fieldName)
Save the string passed to the register method, saving it to the data property on the
service mapping

**Params**

- keyName `String` - name registered by service  
- fieldName `String` - property name
expiration time  

