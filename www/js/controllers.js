angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {})

.controller('ChatCtrl', function ($scope, $ionicScrollDelegate, Chat) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chat = [];
    $scope.position = Chat.getPosition();
    $scope.message = "";

    $scope.publish = function () {
        Chat.publish($scope.message);
        $scope.message = "";
    };
    $scope.$on('newMessage', function (event, args) {
        console.log(args);
        $scope.chat.unshift(args);
        $ionicScrollDelegate.scrollTop();
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
