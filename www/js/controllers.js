angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {})

.controller('ChatCtrl', function ($scope, Chat) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chat = Chat.chat;
    $scope.position = Chat.getPosition();
    $scope.message = "";
    
    $scope.publish = function () {
        Chat.publish($scope.message);
        $scope.message = "";
    }
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});