var app = angular.module('nyumbani.vrview', []);

// Request modal
app.controller('listingModalCtrl', function ($scope, $timeout) {
    var vrView;
    $scope.map = { zoom: 13 };
    $scope.options = {icon:'img/ionic.png'};
    var vrLoaded = false;
    $scope.hideModal = function () {
        $scope.listingModal.hide();
        $scope.detailRID = null;
    };

    function onVrViewLoad() {

        var body = document.documentElement;
        if (body.requestFullscreen) {
            body.requestFullscreen();
        } else if (body.webkitrequestFullscreen) {
            body.webkitrequestFullscreen();
        } else if (body.mozrequestFullscreen) {
            body.mozrequestFullscreen();
        } else if (body.msrequestFullscreen) {
            body.msrequestFullscreen();
        }
        vrView = new VRView.Player('#vrview', {
            image: $scope.listing.vr,
            is_stereo: false
        });
    }
    $scope.$on('modal.shown', function () {
        if (!vrLoaded) {
            onVrViewLoad();
            vrLoaded = true;
        } else {
            vrView.setContent({
                image: $scope.listing.vr,
                is_stereo: $scope.listing.stereo
            });
        }

        $scope.marker = JSON.parse(JSON.stringify($scope.listing.marker));
        $scope.map.center = JSON.parse(JSON.stringify($scope.marker.coords));
        $scope.marker.options = {
            draggable: false
        };
    });

    $scope.marker = {id: 0};
    

});