'use strict';

angular.module('angularStates')
.factory('otherService', ['StatesService', function (StatesService) {
    var service = {

        stuff: {
            cenas: 12,
            array: [1,2,3,4],
            nome: "User"
        },
        outraInfo: {
            ok: true
        },

        name: 'otherService',

        init: function() {
            StatesService.register(this, service.name, [{
                'stuff': service.stuff
            }, 'outraInfo']);
        },

        update: function() {
            service.stuff.cenas = service.stuff.cenas + 1;
            console.log('updated cenas:', service.stuff.cenas);
            if (service.outraInfo) {
                service.outraInfo.ok = !service.outraInfo.ok;
            } else {
                service.outraInfo = {
                    ok: true
                };
            }
            console.log('updated outra info ok:', service.outraInfo);
        },

        save: function() {
            StatesService.saveState(service.name); 
        }
    };

    service.init();
    StatesService.recoverState(service.name);

    return service;
}]);

