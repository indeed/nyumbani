var app = angular.module('nyumbani.controllers', []);

var fireRef = new Firebase("https://cbapp.firebaseio.com");

// Main app & menu controller
app.controller('menuCtrl', function ($scope, $ionicHistory, $localStorage, $ionicModal, authService) {

    $scope.$storage = $localStorage.$default({
        user: {}
    });

    $scope.views = [
        { name: "profile", ref: "profile/" + $scope.$storage.user.uid, icon: "ion-android-person" },
        { name: "listings", ref: "listings", icon: "ion-home" },
        { name: "create", ref: "create", icon: "ion-camera" },
        { name: "messages", ref: "messages", icon: "ion-chatbubbles" },
    ];

    $scope.$watch('$storage.user.uid', function () {
        $scope.views[0] = { name: "profile", ref: "profile/" + $scope.$storage.user.uid, icon: "ion-android-person" };
    });

    $scope.auth = authService.auth;
    $scope.auth.$onAuth(function (authData) {
        if (authData) {
            authService.registerUser(authData);
            $scope.$storage.user = {
                profileImageURL: authData[authData.provider].profileImageURL,
                displayName: authData[authData.provider].displayName,
                uid: authData.uid
            }
            $scope.authModal.hide();
        } else {
            $scope.$storage.user = {
                profileImageURL: "img/user-default.jpg",
                displayName: "Anonymous User",
                uid: null
            }
            $scope.authModal.show();
        }
    });

    // Highlight current view in menu
    $scope.isViewSelected = function (name) {
        if ($ionicHistory.currentStateName() == 'app.' + name) {
            return true
        } else {
            return false
        }
    };

    // Settings modal open
    $ionicModal.fromTemplateUrl('settingsModal.html', function (modal) {
        $scope.settingsModal = modal;
    }, {
            scope: $scope,
            animation: 'slide-in-right',
            focusFirstInput: true
        });

    // Auth modal open
    $ionicModal.fromTemplateUrl('authModal.html', function (modal) {
        $scope.authModal = modal;
    }, {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        });

});

// Settings modal
app.controller('settingsModalCtrl', function ($scope, authService) {

    $scope.hideModal = function () {
        $scope.settingsModal.hide();
    };

    $scope.logout = function () {
        authService.auth.$unauth();
        $scope.hideModal();
    };
});

// Auth modal
app.controller('authModalCtrl', function ($scope, authService, $localStorage) {

    $scope.auth = function (method) {
        authService.auth.$unauth();
        authService.auth.$authWithOAuthPopup(method);
    }

    $scope.hideAuth = function () {
        $scope.authModal.hide();
    }

    $scope.requestFullScreen = function () {

        var el = document.body;

        // Supports most browsers and their versions.
        var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen
            || el.mozRequestFullScreen || el.msRequestFullScreen;

        if (requestMethod) {

            // Native full screen.
            requestMethod.call(el);

        } else if (typeof window.ActiveXObject !== "undefined") {

            // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");

            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

});

// Cougarvision view
app.controller('messagesCtrl', function ($scope) {
    console.log("ok");
    $scope.messages = [
        {
            name: "Oluwatobi",
            time: "5:21 PM",
            content: "Is 2:00pm on Saturday a good time?",
            img: "img/data/msg_tobi.jpg"
        },
        {
            name: "Danilla",
            time: "3:05 PM",
            content: "Okay, sounds good. Thanks for your time! See you in a few days.",
            img: "img/data/msg_danilla.jpg"
        },
        {
            name: "Michael",
            time: "Tue",
            content: "Sorry, I've found another place that is closer to work.",
            img: "img/data/msg_dempsey.jpg"
        },
        {
            name: "Barack",
            time: "Jan 30",
            content: "Hey Mr. President!",
            img: "img/data/msg_obama.jpg"
        },
    ]
});

// News & announcements view
app.controller('profileCtrl', function ($scope, $colorThief, $stateParams, $firebaseObject, rootRef) {
    $scope.profile = {}
    $scope.$on('$ionicView.beforeEnter', function () {
        var obj = $firebaseObject(rootRef.child('users').child($stateParams.uid));
        obj.$loaded(function (data) {
            $scope.setColor(data.auth.profileImageURL);
            $scope.profile = data;
        });
    });

    $scope.setColor = function (src) {
        var image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = src;
        image.onload = function () {
            $scope.dominantColor = $colorThief.getColor(image);
        };
    }
});

// News & announcements view
app.controller('listingsCtrl', function ($scope, $ionicPlatform, $ionicModal) {

    $scope.listings = [
        {
            id: 0,
            stereo: false,
            date: "2017-01-23",
            name: "A bright and colourful demo",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            address: "32 Fake Street, Unit 320",
            location: "Vancouver",
            price: "$2200",
            marker: {
                id: 0,
                coords: {
                    latitude: 49.2725003,
                    longitude: -123.1937607
                },
            },
            baths: 2,
            beds: 2,
            img: "https://lh3.googleusercontent.com/5-ydfmLiViA9lt28PUtCrqh2kl5FKwFovjumpDarXOVJc1i-HEmCX-QcKusr8jxU67SPbhaUzD3dPw=w1920-h1080-rw-no",
            vr: "https://lh3.googleusercontent.com/5-ydfmLiViA9lt28PUtCrqh2kl5FKwFovjumpDarXOVJc1i-HEmCX-QcKusr8jxU67SPbhaUzD3dPw=w3840-h2160-rw-no"
        },
        {
            id: 1,
            stereo: false,
            date: "2017-01-10",
            name: "Beautiful apt in heart of Toronto",
            desc: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
            address: "32 Fake Street, Unit 320",
            location: "Toronto",
            price: "$1200",
            marker: {
                id: 0,
                coords: {
                    latitude: 43.736216, 
                    longitude: -79.383932
                },
            },
            baths: 1,
            beds: 1,
            img: "https://lh3.googleusercontent.com/iuM8DRjVkGC9fxWrKNv7Q3-MNIK3cIUeBXTrbOigky3Jq9u0X34uKd9AjVLf0AeWyZis-_emlphN6A=w1920-h1080-rw-no",
            vr: "https://lh3.googleusercontent.com/iuM8DRjVkGC9fxWrKNv7Q3-MNIK3cIUeBXTrbOigky3Jq9u0X34uKd9AjVLf0AeWyZis-_emlphN6A=w3840-h2160-rw-no"
        },
        {
            id: 2,
            stereo: false,
            date: "2016-12-11",
            name: "Unique retro bus home",
            desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
            address: "32 Fake Street, Unit 320",
            location: "Toronto",
            price: "$400",
            marker: {
                id: 0,
                coords: {
                    latitude: 43.732216, 
                    longitude: -79.505932
                },
            },
            baths: 1,
            beds: 1,
            img: "img/data/bus_preview.jpg",
            vr: "img/data/bus.jpg"
        },
        {
            id: 3,
            stereo: false,
            date: "2015-12-11",
            name: "Demo vehicle interior",
            desc: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
            address: "32 Fake Street, Unit 320",
            location: "Montreal",
            price: "$43000",
            marker: {
                id: 0,
                coords: {
                    latitude: 45.452791, 
                    longitude: -73.671767
                },
            },
            baths: 0,
            beds: 0,
            img: "https://lh3.googleusercontent.com/E7WaJwefhYLZrgOn-FUE-Iqp1cwHKwcd66zutHVp2GnagVuDmL41BkjtBL3LiprgnVITrEHexVAnJg=w1920-h1080-rw-no",
            vr: "https://lh3.googleusercontent.com/E7WaJwefhYLZrgOn-FUE-Iqp1cwHKwcd66zutHVp2GnagVuDmL41BkjtBL3LiprgnVITrEHexVAnJg=w3840-h2160-rw-no"
        }
    ]

    $scope.showRequest = function (listing) {
        $scope.listing = listing;
        $scope.listingModal.show();
    }

    // Individual request modal open
    $ionicModal.fromTemplateUrl('listingModal.html', function (modal) {
        $scope.listingModal = modal;
    }, {
            scope: $scope,
            animation: 'slide-in-right',
            focusFirstInput: true
        });
});

app.controller('cvCtrl', function ($scope) {

});
