angular.module('starter.services', ['firebase'])

.factory('Chat', function ($rootScope) {
    var fluxCenter;
    var fluxNorth;
    var fluxSouth;
    var fluxEast;
    var fluxWest;

    var position;
    var lastTs = Date.now() - 60 * 1000 * 2;

    var settings = {
        'textColor': "black",
        'backgroundColor': "white",
        'name': "anon"
    };
    // Might use a resource here that returns a JSON array
    var center = function (pos) {
        return (Math.round(pos.coords.latitude * 100)) + "x" + (Math.round(pos.coords.longitude * 100));
    }
    var north = function (pos) {
        return ((Math.round(pos.coords.latitude * 100) + 1)) + "x" + (Math.round(pos.coords.longitude * 100));
    }
    var south = function (pos) {
        return ((Math.round(pos.coords.latitude * 100) - 1)) + "x" + (Math.round(pos.coords.longitude * 100));
    }
    var east = function (pos) {
        return (Math.round(pos.coords.latitude * 100)) + "x" + ((Math.round(pos.coords.longitude * 100) - 1));
    }
    var west = function (pos) {
        return (Math.round(pos.coords.latitude * 100)) + "x" + ((Math.round(pos.coords.longitude * 100) + 1));
    }

    var receive = function (payload) {
        if (lastTs < payload.ts + 1000) {
            console.log("received : " + payload.m);
            lastTs = payload.ts;
            $rootScope.$broadcast("newMessage", payload);
        }
    }

    var refreshFluxes = function () {
        console.log("Opening fluxes for " + center(position));

        fluxCenter = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + center(position));
        fluxNorth = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + north(position));
        fluxSouth = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + south(position));
        fluxEast = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + east(position));
        fluxWest = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + west(position));

        fluxCenter.on('child_added', function (snapshot) {
            receive(snapshot.val());
        });
        fluxNorth.on('child_added', function (snapshot) {
            receive(snapshot.val());
        });
        fluxSouth.on('child_added', function (snapshot) {
            receive(snapshot.val());
        });
        fluxEast.on('child_added', function (snapshot) {
            receive(snapshot.val());
        });
        fluxCenter.on('child_added', function (snapshot) {
            receive(snapshot.val());
        });
    }

    var shout = function (payload) {
        fluxCenter.push(payload);
        fluxNorth.push(payload);
        fluxSouth.push(payload);
        fluxEast.push(payload);
        fluxWest.push(payload);
    }

    return {
        getPosition: function () {
            return position;
        },
        refreshPosition: function (newPosition) {
            if (position == null || (center(position) != center(newPosition))) {
                position = newPosition;
                refreshFluxes();
            }
            return this.getPosition();
        },
        publish: function (message) {
            shout(message);
        },
        getSettings: function () {
            return settings;
        },
        setSettings: function (newSettings) {
            settings = newSettings;
        },
        convertMessageToPayload: function (message) {
            return {
                'ts': Date.now(),
                'n': settings.name,
                'tc': settings.textColor,
                'bc': settings.backgroundColor,
                'p': center(position),
                'm': message,
                'ext':true
            };
        }
    };
});