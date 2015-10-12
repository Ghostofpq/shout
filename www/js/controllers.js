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
        Chat.publish($scope.message);
        $scope.message = "";
    };
    $scope.$on('newMessage', function (event, args) {
        $scope.chat.unshift(args);
        $ionicScrollDelegate.scrollTop();
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
    $scope.name = Chat.getName();
    $scope.color = Chat.getColor();
    $scope.setName = function () {
        Chat.setName($scope.name);
    };
    $scope.setColor = function () {
        Chat.setColor($scope.color);
    };
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

//.controller('LoadingUpCtrl', function ($cordovaGeolocation) {
//    console.log("yo");
//    var position = $cordovaGeolocation.getCurrentPosition({
//        'timeout': 1000 * 10,
//        'enableHighAccuracy': true
//    }).then(function (position) {
//        console.log(position);
//    }, function (err) {
//        console.log(":(");
//    });
//});