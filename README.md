# angularStates
Angular JS Service for managing service states (saving / restoring / invalidating)

## Installation

Just do ``bower install angular-states``.

## Why?

This service is meant to be used as a 'top layer' on the AngularJS app, for saving, restoring, invalidating services/factories states. 
As mentioned in several AngularJS *good practices* lists and [posts](http://toddmotto.com/rethinking-angular-js-controllers/), using the controller's $scope can lead to a lot of disadvantages (difficult to reuse and test, doesn't separate Model/Controller concers, thight coupling, etc).

However, when keeping the model on services/factories it's sometimes necessary to maintain the state persistent across utilizations, which leads to further validation and (possibily) expiration over time. This service aims to facilitate that task and to make each service state logic easier to apply.

**Note**: Each service/factory values to be persisted should be made public so that the service can work correctly.

## Usage

Include the 'angularStates' module as a dependency on your app, and include the 'StatesService' when it's needed.

    angular.module('yourApp', ['angularStates', '..'])

### Documentation
## Members
<dl>
<dt><a href="#angularStatesApp">angularStatesApp</a></dt>
<dd><h1 id="angularstatesapp">angularStatesApp</h1>
<p>Module of the Angular States.</p>
</dd>
<dt><a href="#StatesService">StatesService</a></dt>
<dd><p>Angular JS Service for managing service states (saving / restoring / invalidating)</p>
</dd>
</dl>
<a name="angularStatesApp"></a>
## angularStatesApp
# angularStatesApp

Module of the Angular States.

**Kind**: global variable  
**Ngdoc**: overview  
<a name="StatesService"></a>
## StatesService
Angular JS Service for managing service states (saving / restoring / invalidating)

**Kind**: global variable  
**Ngdoc**: service  

* [StatesService](#StatesService)
  * [.register(serviceInstance, keyName, fields)](#StatesService.register)
  * [.saveState(keyName)](#StatesService.saveState)
  * [.recoverState(keyName)](#StatesService.recoverState)
  * [.resetState(keyName)](#StatesService.resetState)
  * [.clearStorage(keyName)](#StatesService.clearStorage)

<a name="StatesService.register"></a>
### StatesService.register(serviceInstance, keyName, fields)
Registers a service instance on the persistence service

**Kind**: static method of <code>[StatesService](#StatesService)</code>  
**Throws**:

- <code>Error</code> will throw if the current keyName is already in use


| Param | Type | Description |
| --- | --- | --- |
| serviceInstance | <code>Object</code> | registered service instance - for updating its state afterwards |
| keyName | <code>String</code> | key used for mapping items the each service |
| fields | <code>Array</code> | service properties that should be saved. Note: the elements of this array can be strings (name of the field) or objects. In case of object, they must use the following schema {    name: 'property name', // String    value: defaultValue,   // any type    expire: 1231           // Integer (time of expiration in milliseconds for the current field) } |

<a name="StatesService.saveState"></a>
### StatesService.saveState(keyName)
Save the service state, based on the values mapped for the keyName provided

**Kind**: static method of <code>[StatesService](#StatesService)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keyName | <code>String</code> | key used for mapping items to the service |

<a name="StatesService.recoverState"></a>
### StatesService.recoverState(keyName)
Recovers the service state

**Kind**: static method of <code>[StatesService](#StatesService)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keyName | <code>String</code> | key used for mapping items to the service |

<a name="StatesService.resetState"></a>
### StatesService.resetState(keyName)
Resets the service state and clears the storage of that service

**Kind**: static method of <code>[StatesService](#StatesService)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keyName | <code>String</code> | key used for mapping items to the service |

<a name="StatesService.clearStorage"></a>
### StatesService.clearStorage(keyName)
Clears the service state on the persistence layer

**Kind**: static method of <code>[StatesService](#StatesService)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keyName | <code>String</code> | key used for mapping items to the service |

