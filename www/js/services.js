angular.module('starter.services', ['firebase'])

.factory('Chats', function () {
    var position = {
        'coords.latitude': 45.745125,
        'coords.longitude': 4.861638
    };
    var name = "anon";
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
        return ((Math.round(position["coords.latitude"] * 1000) + 1)) + "x" + ((Math.round(position["coords.latitude"] * 1000) - 1));
    }
    var west = function () {
        return ((Math.round(position["coords.latitude"] * 1000) - 1)) + "x" + ((Math.round(position["coords.latitude"] * 1000) + 1));
    }

    var fluxCenter;
    var fluxNorth;
    var fluxSouth;
    var fluxEast;
    var fluxWest;

    var refreshFluxes = function () {
        fluxCenter = new Firebase("https://vivid-heat-5271.firebaseio.com/" + center());
        fluxNorth = new Firebase("https://vivid-heat-5271.firebaseio.com/" + north());
        fluxSouth = new Firebase("https://vivid-heat-5271.firebaseio.com/" + south());
        fluxEast = new Firebase("https://vivid-heat-5271.firebaseio.com/items" + east());
        fluxWest = new Firebase("https://vivid-heat-5271.firebaseio.com/items" + west());
    }
    refreshFluxes();

    var publish = function (message) {
        var payload = {
            'ts': Date.now(),
            'orig.name': name,
            'orig.pos': position,
            'message': message
        }
        fluxCenter.$add(payload);
        fluxNorth.$add(payload);
        fluxSouth.$add(payload);
        fluxEast.$add(payload);
        fluxWest.$add(payload);
    }

    var chat = [];
    fluxCenter.on('child_added', function (payload) {
        chat.push(payload.orig.name + payload.ts, payload);
    })
    fluxNorth.on('child_added', function (payload) {
        chat.push(payload.orig.name + payload.ts, payload);
    })
    fluxSouth.on('child_added', function (payload) {
        chat.push(payload.orig.name + payload.ts, payload);
    })
    fluxEast.on('child_added', function (payload) {
        chat.push(payload.orig.name + payload.ts, payload);
    })
    fluxCenter.on('child_added', function (payload) {
        chat.push(payload.orig.name + payload.ts, payload);
    })

    return {
        all: function () {
            return chat;
        },
        remove: function (chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function (chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        },
        forcePosition: function (newPosition) {
            position = newPosition;
        },
        getPosition: function () {
            return position;
        },
        refreshPosition: function () {
            return this.getPosition();
        }
    };
});
