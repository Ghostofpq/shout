angular.module('starter.services', ['firebase'])

.factory('Chat', function ($rootScope) {
    var content = []; //  to keep track of what is received
   
    var fluxCenter;
    var fluxNorth;
    var fluxSouth;
    var fluxEast;
    var fluxWest;

    var lastTs = Date.now() - 60 * 1000 * 2;

    var position = {
        'coords.latitude': 45.745125,
        'coords.longitude': 4.861638
    };
    var settings = {
        'textColor': "black",
        'backgroundColor': "white",
        'name': "anon"
    };
    // Might use a resource here that returns a JSON array
    var center = function () {
        return (Math.round(position["coords.latitude"] * 1000)) + "x" + (Math.round(position["coords.longitude"] * 1000));
    }
    var north = function () {
        return ((Math.round(position["coords.latitude"] * 1000) + 1)) + "x" + (Math.round(position["coords.longitude"] * 1000));
    }
    var south = function () {
        return ((Math.round(position["coords.latitude"] * 1000) - 1)) + "x" + (Math.round(position["coords.longitude"] * 1000));
    }
    var east = function () {
        return (Math.round(position["coords.latitude"] * 1000)) + "x" + ((Math.round(position["coords.latitude"] * 1000) - 1));
    }
    var west = function () {
        return (Math.round(position["coords.latitude"] * 1000)) + "x" + ((Math.round(position["coords.latitude"] * 1000) + 1));
    }

    var receive = function (payload) {
        if (lastTs < payload.ts && content[payload.n + payload.ts] == null) {
            console.log("received : " + payload.m);
            content[payload.n + payload.ts] = payload;
            lastTs = payload.ts;
            $rootScope.$broadcast("newMessage",payload);
        }
    }

    var refreshFluxes = function () {
        fluxCenter = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + center());
        fluxNorth = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + north());
        fluxSouth = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + south());
        fluxEast = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + east());
        fluxWest = new Firebase("https://vivid-heat-5271.firebaseio.com/shout/" + west());
        fluxCenter.on('child_added', function (snapshot) {
            console.log('child_added'+snapshot.val());
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
    refreshFluxes();

    var shout = function (message) {
        var payload = {
            'ts': Date.now(),
            'n': settings.name,
            'tc': settings.textColor,
            'bc': settings.backgroundColor,
            'p': position["coords.latitude"] + "x" + position["coords.latitude"],
            'm': message
        }
        fluxCenter.push(payload);
        fluxNorth.push(payload);
        fluxSouth.push(payload);
        fluxEast.push(payload);
        fluxWest.push(payload);
    }

    return {
        
        forcePosition: function (newPosition) {
            position = newPosition;
            refreshFluxes();
        },
        getPosition: function () {
            return position;
        },
        refreshPosition: function () {
            refreshFluxes();
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
        }
    };
});
