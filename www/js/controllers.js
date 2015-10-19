angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {})

.controller('ChatCtrl', function ($scope, $ionicScrollDelegate, Chat, $interval) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.watch = {};
    $scope.temporal = {};
    $scope.pos = {}
    $scope.chat = [];

    $scope.message = "";

    $scope.publish = function () {
        if ($scope.message.trim().length > 0) {
            var payload = Chat.convertMessageToPayload($scope.message);
            payload.ext = false;
            $scope.chat.unshift(payload);
            Chat.publish(Chat.convertMessageToPayload($scope.message));
        }
        $scope.message = "";
    };
    $scope.$on('newMessage', function (event, args) {
        if (!$scope.chat.find(function (element, index, array) {
                if (element.m === args.m && element.n === args.n && element.ts === args.ts) {
                    return true;
                }
            })) {
            $scope.chat.unshift(args);
            $ionicScrollDelegate.scrollTop();
        }
    });

    $scope.watch = navigator.geolocation.watchPosition(function (updatedPos) {
        $scope.pos = updatedPos;
        console.log(updatedPos);
        Chat.refreshPosition(updatedPos);
    }, function (error) {
        console.log("Watch error!");
        console.log(error);
    });
})

.controller('AccountCtrl', function ($scope, Chat) {
    $scope.settings = Chat.getSettings();
    $scope.updateSettings = Chat.setSettings($scope.settings);
})

.directive('input', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            'returnClose': '=',
            'onReturn': '&',
            'onFocus': '&',
            'onBlur': '&'
        },
        link: function (scope, element, attr) {
            element.bind('focus', function (e) {
                if (scope.onFocus) {
                    $timeout(function () {
                        scope.onFocus();
                    });
                }
            });
            element.bind('blur', function (e) {
                if (scope.onBlur) {
                    $timeout(function () {
                        scope.onBlur();
                    });
                }
            });
            element.bind('keydown', function (e) {
                if (e.which == 13) {
                    if (scope.returnClose) element[0].blur();
                    if (scope.onReturn) {
                        $timeout(function () {
                            scope.onReturn();
                        });
                    }
                }
            });
        }
    }
});