angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, UserService, $state, $ionicPopup, $ionicHistory, $httpParamSerializer, $ionicLoading) {

    // view name
    $scope.getName = function() {
        var name = null;
        if(window.localStorage['profile']){
            var profile = JSON.parse(window.localStorage['profile']);
            name = profile.custName;
        }

        return name;
    }
    // view balance 1
    $scope.balance = function() {
        var balance = 0;
        if(window.localStorage['profile']){
            var profile = JSON.parse(window.localStorage['profile']);
            balance = profile.balance;
        }

        return balance;
    }

    $scope.topup = function() {
        var alertPopup = $ionicPopup.alert({
                title: ' TOP UP SALDO',
                template: 'Silahkan Top Up Saldo-mu di Plasa Telkom terdekat',
                buttons: [{ text: 'OK', type: 'button-assertive'}]
            });
    }

    //refresh current page
    $scope.refresh = function(){
        $state.go($state.current, {}, { reload: true });
    }

    //checking login user
    $scope.isLoggedIn = function() {
        return UserService.isLoggedIn();
    };

    //logout user
    $scope.logout = function() {
        var confirm = $ionicPopup.confirm({
            title: 'Info',
            template: 'Silahkan konfirmasi untuk logout dari akun t-money mobile-mu',
            buttons:[{
                text: 'OK',
                type: 'button-assertive',
                onTap: function(e) {
                    return true;
                }
            },{
                text: 'BATAL',
                type: 'button-assertive'
            }]
        }).then(function(res) {
            if(res) {
                var json      = {};
                var profile   = JSON.parse(window.localStorage['profile']);
                json.terminal = 'ANDROID-TMONEY';
                json.idTmoney = profile.idTmoney;
                json.idFusion = profile.idFusion;
                json.token    = profile.token;
                var params    = $httpParamSerializer(json);
                $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
                UserService.logout(params).success(function(response) {
                    //console.log(response);
                    $ionicLoading.hide();
                    if(response.resultCode == '0'){
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        $state.go('app.welcome',{}, {reload: true});
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error!',
                            template: response.resultDesc,
                        });
                    }
                }).error(function(data) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                            title: 'failed!',
                            template: 'Please check your connection'
                    });
                });
            } else {
                console.log('failed');
            }
        });
    };

    // forgot password
    $scope.forgot = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json = {};
        json.terminal = 'ANDROID-TMONEY';
        var params    = $httpParamSerializer(json);
        UserService.resetPassword(params).success(function(response) {
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                var alertPopup = $ionicPopup.alert({
                    title: 'Sukses',
                    template: response.resultDesc,
                });
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

})

.controller('RegisterCtrl', function($scope, $ionicHistory, UserService, $ionicPopup, $state, $httpParamSerializer, $ionicLoading, $ionicSideMenuDelegate) {
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.viewTopUp = false;
    $scope.reg = {};
    $scope.reg.accType  = '1'; //Gold
    $scope.reg.terminal = 'ANDROID-TMONEY';
    $scope.doReg = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var params = $httpParamSerializer($scope.reg);
        UserService.singUp(params).success(function(data) {
            $ionicLoading.hide();
            if(data.resultCode == '0'){
                var alertPopup = $ionicPopup.alert({
                    title: 'Pendaftaran Sukses',
                    template: 'Silahkan cek email-mu untuk konfirmasi',
                });
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Registrasi gagal!',
                    template: data.resultDesc,
                });
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'Registration failed!',
                    template: 'Please check your connection'
            });
        });
    };
})

.controller('WelcomeCtrl', function($scope, $ionicHistory, UserService, $ionicPopup, $state, $httpParamSerializer, $ionicLoading, $ionicSideMenuDelegate) {
    /*if(UserService.isLoggedIn() == true) {
        $ionicHistory.nextViewOptions({
            disableBack: true,
            disableAnimate: true
        });
        $state.go('app.dashboard',{}, {reload: true});
    }*/
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.login = {};
    $scope.login.terminal = 'ANDROID-TMONEY';
    $scope.doLogin = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var params = $httpParamSerializer($scope.login);
        UserService.singIn(params).success(function(data) {
            console.log(data.user);
            $ionicLoading.hide();
            if(data.login == true){
                window.localStorage.setItem("profile", JSON.stringify(data.user));
                UserService.setUser();
                $ionicHistory.nextViewOptions({ disableBack: true });
                $state.go('app.dashboard',{}, {reload: true});
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Login gagal!',
                    template: data.resultDesc,
                });
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your connection'
            });
        });

    };
})


.controller('DashCtrl', function($scope, $ionicHistory, UserService, $ionicPopup, $state, $httpParamSerializer) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
    var profile = JSON.parse(window.localStorage['profile']);
    /*
    console.log(profile);

    */
})

.controller('ProfilCtrl', function($scope, $http, UserService, $ionicHistory,$ionicPopup, $state, $httpParamSerializer, $ionicLoading) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
    $scope.item = {};
    var json    = {};
    var profile = JSON.parse(window.localStorage['profile']);
    json.terminal = 'ANDROID-TMONEY';
    json.idTmoney = profile.idTmoney;
    json.idFusion = profile.idFusion;
    json.token    = profile.token;
    var params = $httpParamSerializer(json);
    UserService.profile(params).success(function(response) {
        console.log(response);
        if(response.resultCode == '0'){
            $scope.item = response;
        }else{
            var alertPopup = $ionicPopup.alert({
                title: 'Error!',
                template: response.resultDesc,
            });
            if(response.resultCode == '007'){
                $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                $state.go('app.welcome',{}, {reload: true});
            }
        }
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'failed!',
                template: 'Please check your connection'
        });
    });

    $scope.save = function() {
        var confirm = $ionicPopup.confirm({
            title: 'Edit Profil',
            template: 'Simpan Perubahan Profilmu?',
            buttons:[{
                text: 'OK',
                type: 'button-assertive',
                onTap: function(e) {
                    return true;
                }
            },{
                text: 'BATAL',
                type: 'button-assertive'
            }]
        }).then(function(res) {
            //$ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
            if(res) {
                console.log('success');
            } else {
                console.log('failed');
            }
        });
    }
})

.controller('UpgradeCtrl', function($scope, $ionicHistory) { })

.controller('UbahPasswordCtrl', function($scope, $http, UserService, $ionicHistory, $ionicPopup, $state, $httpParamSerializer, $ionicLoading) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
    var json    = {};
    var profile = JSON.parse(window.localStorage['profile']);
    json.terminal = 'ANDROID-TMONEY';
    $scope.doChange = function() {
        json.idTmoney     = profile.idTmoney;
        json.idFusion     = profile.idFusion;
        json.token        = profile.token;
        json.old_password = $scope.old_password;
        json.new_password = $scope.new_password;
        var params        = $httpParamSerializer(json);
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        UserService.changePassword(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                var alertPopup = $ionicPopup.alert({
                    title: 'Ubah Password',
                    template: 'Ubah Password Sukses'
                });
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }
})

.controller('UbahPinCtrl', function($scope, $http, UserService, $ionicHistory, $ionicPopup, $state, $httpParamSerializer, $ionicLoading) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
    var json    = {};
    var profile = JSON.parse(window.localStorage['profile']);
    json.terminal = 'ANDROID-TMONEY';
    $scope.doChange = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        json.idTmoney = profile.idTmoney;
        json.idFusion = profile.idFusion;
        json.token    = profile.token;
        json.old_pin  = $scope.old_pin;
        json.new_pin  = $scope.new_pin;
        var params    = $httpParamSerializer(json);
        UserService.changePIN(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                var alertPopup = $ionicPopup.alert({
                    title: 'Ubah PIN',
                    template: 'Ubah PIN Sukses'
                });
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }
})

.controller('HistoryCtrl', function($scope, $ionicHistory, UserService, $state, $ionicPopup, $httpParamSerializer, $ionicLoading) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
    var profile = JSON.parse(window.localStorage['profile']);
    var json = {};
    json.terminal = 'ANDROID-TMONEY';
    json.idTmoney = profile.idTmoney;
    json.idFusion = profile.idFusion;
    json.token    = profile.token;
    json.startDate = "2015-01-01";
    json.stopDate = "2016-12-30";
    json.limit = 100;
    var params = $httpParamSerializer(json);
    UserService.history(params).success(function(response) {
        console.log(response.record);
        $scope.items = response.record;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your connection'
        });
    });
})

.controller('FaqCtrl', function($scope, $ionicHistory) { })

.controller('AboutCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.viewTopUp = false;
    $ionicSideMenuDelegate.canDragContent(false);
})

/*
 * Beli Pulsa
 * -----------------------------------------------------------------------------
 */
.controller('BeliPulsaCtrl', function($scope, UserService, $state, $ionicHistory) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
})
.controller('PulsaTeleponCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, PulsaService, $httpParamSerializer, $ionicLoading) {
    var operator = [
        {code: '0811', info: ''}
    ];
    $scope.selectOperator = function(){
        console.log("nomor" + $scope.item.telepon);
    }
    /*
    $scope.pulsa = [
        {id:777090, info: 'KartuAS phone credit voucher'},
        {id:777080, info: 'Simpati'},
        {id:777093, info: 'Axis phone credit voucher'},
        {id:777095, info: 'Ceria phone credit voucher'},
        {id:777050, info: 'SmartFren phone credit voucher'},
        {id:777091, info: 'Tree phone credit voucher'},
        {id:777019, info: 'StartOne phone credit voucher'},
        {id:777010, info: 'Mentari phone credit voucher'},
        {id:777094, info: 'IM3 phone credit voucher'},
        {id:777040, info: 'Esia phone credit voucher'},
        {id:777030, info: 'Flexi phone credit voucher'},
        {id:777092, info: 'Hepi phone credit voucher'},
    ]; */
    // pin : 161285
    $scope.operators = {};
    $scope.item = {};
    $scope.nominals = {};
    $scope.item.fee = 0;
    $scope.item.productCode = null;
    $scope.item.refNo = null;
    var json = {};

    json.type = "AIRTIME";
    var params    = $httpParamSerializer(json);
    PulsaService.getProduct(params).success(function(response) {
        console.log(response.product);
        $scope.operators = response.product;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'failed!',
                template: 'Please check your connection'
        });
    });

    $scope.getHarga = function() {
        $scope.item.fee = $scope.item.amount * 1.1;
    }
    var json = {};
    $scope.getNominal = function() {
        json.name = $scope.item.operator;
        var params    = $httpParamSerializer(json);
        PulsaService.getNominal(params).success(function(response) {
            console.log(response.product[0].value);
            if(response.resultCode == '0'){
                $scope.nominals = response.product[0].value;
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    /*create modal konfirmasi */
    $ionicModal.fromTemplateUrl('templates/pulsa_telepon/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/pulsa_telepon/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });
    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.dashboard',{}, {reload: true});
    };
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        var profile = JSON.parse(window.localStorage['profile']);
        json.transactionType = 1;
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.billNumber      = $scope.item.telepon;
        json.amount          = $scope.item.amount;
        json.pin             = null;
        json.transactionID   = null;
        json.refNo           = null;
        console.log(json);
        var params    = $httpParamSerializer(json);
        PulsaService.topUp(params).success(function(response) {
            $ionicLoading.hide();
            console.log(response);
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });

    };
    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        var profile = JSON.parse(window.localStorage['profile']);
        json.transactionType = 2;
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.billNumber      = $scope.item.telepon;
        json.amount          = $scope.item.amount;
        json.pin             = $scope.item.pin;
        json.transactionID   = $scope.item.transactionID;
        json.refNo           = $scope.item.refNo;
        var params    = $httpParamSerializer(json);
        PulsaService.topUp(params).success(function(response) {
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }
})
.controller('PulsaListrikCtrl', function($scope, $http, $ionicModal, $ionicHistory, $ionicPopup, $state, PulsaService,$httpParamSerializer, $ionicLoading) {
    $scope.operators = {};
    $scope.item = {};
    $scope.nominals = {};
    $scope.item.fee = 0;
    $scope.item.productCode = '070002'; // PLN Prepaid
    $scope.item.refNo = null;
    var json = {};

    json.name = "Simpati";
    var params    = $httpParamSerializer(json);
    PulsaService.getNominal(params).success(function(response) {
        console.log(response);
        if(response.resultCode == '0'){
            $scope.nominals = response.product[0].value;
        }else{
            var alertPopup = $ionicPopup.alert({
                title: 'Error!',
                template: response.resultDesc,
            });
            if(response.resultCode == '007'){
                $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                $state.go('app.welcome',{}, {reload: true});
            }
        }
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'failed!',
                template: 'Please check your connection'
        });
    });

    $scope.getHarga = function() {
        $scope.item.fee = $scope.item.amount * 1.1;
    }

    /*create modal konfirmasi */
    $ionicModal.fromTemplateUrl('templates/pulsa_listrik/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/pulsa_listrik/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });
    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.dashboard',{}, {reload: true});
    };
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        var profile = JSON.parse(window.localStorage['profile']);
        json.transactionType = 1;
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.billNumber      = $scope.item.nomor;
        json.amount          = $scope.item.amount;
        json.pin             = null;
        json.transactionID   = null;
        json.refNo           = null;
        var params    = $httpParamSerializer(json);
        PulsaService.topUp(params).success(function(response) {
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });

    };
    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        var profile = JSON.parse(window.localStorage['profile']);
        json.transactionType = 2;
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.billNumber      = $scope.item.nomor;
        json.amount          = $scope.item.amount;
        json.pin             = $scope.item.pin;
        json.transactionID   = $scope.item.transactionID;
        json.refNo           = $scope.item.refNo;
        var params    = $httpParamSerializer(json);
        PulsaService.topUp(params).success(function(response) {
            //console.log(json);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }
})
.controller('VoucherGameCtrl', function($scope, $http, $ionicModal, $ionicHistory, $ionicPopup, $state, PulsaService,$httpParamSerializer, $ionicLoading) {
    $scope.vouchers = {};

    $scope.vouchers = [
        {id: '778068', name: 'Nusol game-online voucher'},
        {id: '778066', name: 'Megaxus game-online voucher'},
        {id: '778065', name: 'Lyto game-online voucher'},
        {id: '778064', name: 'Angel-Love game-online voucher'},
        {id: '778063', name: 'Zynga game-online voucher'},
        {id: '778067', name: 'Kreon game-online voucher'},
        {id: '778055', name: 'VTC game-online voucher'},
    ];

    $scope.item = {};
    $scope.nominals = {};
    $scope.item.fee = 0;
    /*var json = {};
    json.type = "GAME";
    var params    = $httpParamSerializer(json);
    PulsaService.getProduct(params).success(function(response) {
        //console.log(response.product);
        $scope.vouchers = response.product;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'failed!',
                template: 'Please check your connection'
        });
    });*/
    $scope.getHarga = function() {
        $scope.item.fee = $scope.item.amount * 1.1;
    }
    var json = {};
    $scope.getNominal = function() {
        json.name = "Simpati";
        //json.name = $scope.item.operator;
        var params    = $httpParamSerializer(json);
        PulsaService.getNominal(params).success(function(response) {
            console.log(response.product[0].value);
            if(response.resultCode == '0'){
                $scope.nominals = response.product[0].value;
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }
    /*create modal konfirmasi */
    $ionicModal.fromTemplateUrl('templates/voucher_game/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/voucher_game/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });
    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.dashboard',{}, {reload: true});
    };
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        var profile = JSON.parse(window.localStorage['profile']);
        json.transactionType = 1;
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.billNumber      = 435354;
        json.amount          = $scope.item.amount;
        json.pin             = null;
        json.transactionID   = null;
        json.refNo           = null;
        var params    = $httpParamSerializer(json);
        PulsaService.topUp(params).success(function(response) {
            console.log(json);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });

    };
    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        var profile = JSON.parse(window.localStorage['profile']);
        json.transactionType = 2;
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.billNumber      = 435354;
        json.amount          = $scope.item.amount;
        json.pin             = $scope.item.pin;
        json.transactionID   = $scope.item.transactionID;
        json.refNo           = $scope.item.refNo;
        var params    = $httpParamSerializer(json);
        PulsaService.topUp(params).success(function(response) {
            console.log(json);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }
})

/*
 * Tagihan
 * -----------------------------------------------------------------------------
 */
.controller('TagihanCtrl', function($scope, UserService, $state, $ionicHistory) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
})
.controller('TagihanTeleponCtrl', function($scope, $ionicModal, $ionicHistory,$ionicPopup, $state, TagihanService, $httpParamSerializer, $ionicLoading) {
    $scope.item        = {};
    $scope.transaksi   = "Tagihan Telepon";
    $scope.item.amount = 0
    $scope.item.fee    = 0;
    $scope.item.total  = 0;
    $scope.operators = [
        {code: '001001', name: 'Telkom fixed phone, flexi classy, speedy, trans vision, yes tv'},
        {code: '006007', name: 'Innovate'},
    ];
    //pin = 161285
    var profile = JSON.parse(window.localStorage['profile']);
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 1;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = null;
        dataJson.amount      = 0;
        dataJson.transactionID   = null;
        dataJson.refNo           = null;
        console.log(dataJson);
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
            }
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 2;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = $scope.item.pin;
        dataJson.amount      = $scope.item.total;
        dataJson.transactionID   = $scope.item.transactionID;
        dataJson.refNo           = $scope.item.refNo;
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/tagihan_internet/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/tagihan_internet/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };
})
.controller('TagihanInternetCtrl', function($scope, $ionicModal, $ionicHistory,$ionicPopup, $state, TagihanService, $httpParamSerializer, $ionicLoading) {
    $scope.item        = {};
    $scope.transaksi   = "Tagihan Internet";
    $scope.item.amount = 0
    $scope.item.fee    = 0;
    $scope.item.total  = 0;
    $scope.operators = [
        {code: '001001', name: 'Telkom fixed phone, flexi classy, speedy, trans vision, yes tv'},
        {code: '006007', name: 'Innovate'},
    ];
    //pin = 161285
    var profile = JSON.parse(window.localStorage['profile']);
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 1;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = null;
        dataJson.amount      = 0;
        dataJson.transactionID   = null;
        dataJson.refNo           = null;
        console.log(dataJson);
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
            }
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 2;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = $scope.item.pin;
        dataJson.amount      = $scope.item.total;
        dataJson.transactionID   = $scope.item.transactionID;
        dataJson.refNo           = $scope.item.refNo;
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/tagihan_internet/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/tagihan_internet/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };
})
.controller('TagihanListrikCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, TagihanService, $httpParamSerializer, $ionicLoading) {
    $scope.item        = {};
    $scope.transaksi   = "Tagihan Listrik";
    $scope.item.amount = 0
    $scope.item.fee    = 0;
    $scope.item.total  = 0;
    $scope.item.productCode = '040000';
    //pin = 161285
    var profile = JSON.parse(window.localStorage['profile']);
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 1;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = null;
        dataJson.amount      = 0;
        dataJson.transactionID   = null;
        dataJson.refNo           = null;
        console.log(dataJson);
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
            }
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 2;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = $scope.item.pin;
        dataJson.amount      = $scope.item.total;
        dataJson.transactionID   = $scope.item.transactionID;
        dataJson.refNo           = $scope.item.refNo;
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/tagihan_internet/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/tagihan_internet/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };
})
.controller('TagihanTVCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, TagihanService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.transaksi   = "Tagihan TV";
    $scope.item.amount = 0
    $scope.item.fee    = 0;
    $scope.item.total  = 0;
    $scope.operators = [
        {code: '001001', name: 'Telkom fixed phone, flexi classy, speedy, trans vision, yes tv'},
        {code: '090001', name: 'Indovision'},
        {code: '006001', name: 'Aora TV'},
        {code: '008001', name: 'Big TV Postpaid Clased Payment'},
        {code: '008002', name: 'Big TV Postpaid Open Payment'},
        {code: '008003', name: 'Big TV Prepaid'},
    ];
    //pin = 161285
    var profile = JSON.parse(window.localStorage['profile']);
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 1;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = null;
        dataJson.amount      = 0;
        dataJson.transactionID   = null;
        dataJson.refNo           = null;
        console.log(dataJson);
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
            }
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 2;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = $scope.item.pin;
        dataJson.amount      = $scope.item.total;
        dataJson.transactionID   = $scope.item.transactionID;
        dataJson.refNo           = $scope.item.refNo;
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/tagihan_internet/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/tagihan_internet/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };
})
.controller('TagihanPDAMCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, TagihanService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.transaksi   = "Tagihan PDAM";
    $scope.item.amount = 0
    $scope.item.fee    = 0;
    $scope.item.total  = 0;
    $scope.operators = [
        {code: '001304', name: 'PDAM Manado'},
        {code: '001306', name: 'PDAM Boyolali'},
        {code: '001310', name: 'PDAM Kuburaya'},
        {code: '001401', name: 'PDAM KOTA BANDUNG'},
        {code: '001402', name: 'PDAM MALANG'},
        {code: '001403', name: 'PDAM JAMBI'},
        {code: '001404', name: 'PDAM BANDAR LAMPUNG'},
        {code: '001405', name: 'PDAM PALEMBANG'},
        {code: '001406', name: 'PDAM AETRA'},
        {code: '001407', name: 'PDAM PALYJA'},
        {code: '001408', name: 'PDAM DENPASAR'},
        {code: '001409', name: 'PDAM CILACAP'},
        {code: '001410', name: 'PDAM PONTIANAK'},
        {code: '001411', name: 'PDAM MAKASAR'},
        {code: '001412', name: 'PDAM KABUPATEN BOGOR'},
        {code: '001413', name: 'PDAM BERAU'},
        {code: '001414', name: 'PDAM GROGOT'},
        {code: '001415', name: 'PDAM SUKABUMI'},
        {code: '001416', name: 'PDAM BONDOWOSO'},
        {code: '001417', name: 'PDAM BEKASI'},
        {code: '001418', name: 'PDAM BANTUL'},
        {code: '001419', name: 'PDAM SLEMAN'},
        {code: '001420', name: 'PDAM SEMARANG'},
    ];
    //pin = 161285
    var profile = JSON.parse(window.localStorage['profile']);
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 1;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = null;
        dataJson.amount      = 0;
        dataJson.transactionID   = null;
        dataJson.refNo           = null;
        console.log(dataJson);
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
            }
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 2;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = $scope.item.pin;
        dataJson.amount      = $scope.item.total;
        dataJson.transactionID   = $scope.item.transactionID;
        dataJson.refNo           = $scope.item.refNo;
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/tagihan_internet/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/tagihan_internet/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });
    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };
})
.controller('TagihanKreditCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, TagihanService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.transaksi   = "Tagihan PDAM";
    $scope.item.amount = 0
    $scope.item.fee    = 0;
    $scope.item.total  = 0;
    $scope.operators = [
        {code: '020013', name: 'ADIRA FINANCE'},
        {code: '020014', name: 'COURTS FINANCE'},
        {code: '020003', name: 'MCF / MAF'},
        {code: '020002', name: 'Columbia'},
        {code: '020015', name: 'ITC Finance'},
    ];
    //pin = 161285
    var profile = JSON.parse(window.localStorage['profile']);
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 1;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = null;
        dataJson.amount      = 0;
        dataJson.transactionID   = null;
        dataJson.refNo           = null;
        console.log(dataJson);
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
            }
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 2;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.productCode = $scope.item.productCode;
        dataJson.billNumber  = $scope.item.billNumber;
        dataJson.pin         = $scope.item.pin;
        dataJson.amount      = $scope.item.total;
        dataJson.transactionID   = $scope.item.transactionID;
        dataJson.refNo           = $scope.item.refNo;
        var params           = $httpParamSerializer(dataJson);
        TagihanService.billPayment(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/tagihan_internet/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/tagihan_internet/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };
})
/*
 * end tagihan
 */

/*
 * Transfer
 * -----------------------------------------------------------------------------
 */
.controller('TransferCtrl', function($scope, UserService, $state, $ionicHistory) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
})
.controller('TransferTmoneyCtrl', function($scope, $ionicModal, $ionicHistory,$ionicPopup, $state, TransferService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.item.token = null;
    $scope.item.fee = 5500;
    //pin = 161285
    //HP = 081311485252
    var profile = JSON.parse(window.localStorage['profile']);

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 2;
        dataJson.idTmoney = profile.idTmoney;
        dataJson.idFusion = profile.idFusion;
        dataJson.token    = profile.token;
        dataJson.destAccount = $scope.item.destination;
        dataJson.pin      = $scope.item.pin;
        dataJson.amount   = $scope.item.total;
        dataJson.transactionID = $scope.item.transactionID;
        dataJson.refNo         = $scope.item.refNo;
        var params    = $httpParamSerializer(dataJson);
        TransferService.antar_akun(params).success(function(response) {
            console.log(dataJson);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/transfer/konfirmasi/konfTmoney.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/transfer/status/statusTmoney.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };

    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 1;
        dataJson.idTmoney = profile.idTmoney;
        dataJson.idFusion = profile.idFusion;
        dataJson.token    = profile.token;
        dataJson.destAccount = $scope.item.destination;
        dataJson.pin      = null;
        dataJson.amount   = $scope.item.nominal;
        dataJson.transactionID = null;
        dataJson.refNo         = null;
        var params    = $httpParamSerializer(dataJson);
        TransferService.antar_akun(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.item.destName = response.destName;
                $scope.item.total = Number(response.feeAmount) + Number($scope.item.nominal);
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };
})
.controller('TransferBankCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, TransferService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.item.token = null;
    $scope.item.fee = 5500;
    $scope.bank = [
        {id: '014', name: 'BANK BCA'},
    ];
    //pin = 161285
    //rekening = 1231234567
    var profile = JSON.parse(window.localStorage['profile']);

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 2;
        dataJson.idTmoney    = profile.idTmoney;
        dataJson.idFusion    = profile.idFusion;
        dataJson.token       = profile.token;
        dataJson.bankCode    = $scope.item.bankID;
        dataJson.bankAccount = $scope.item.bankAccount;
        dataJson.pin         = $scope.item.pin;
        dataJson.amount      = $scope.item.total;
        dataJson.description     = $scope.item.deskripsi;
        dataJson.thirdpartyEmail = $scope.item.email;
        dataJson.transactionID = $scope.item.transactionID;
        dataJson.refNo         = $scope.item.refNo;
        var params    = $httpParamSerializer(dataJson);
        TransferService.antar_bank(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/transfer/konfirmasi/konfBank.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/transfer/status/statusBank.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };

    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal        = 'ANDROID-TMONEY';
        dataJson.transactionType = 1;
        dataJson.idTmoney        = profile.idTmoney;
        dataJson.idFusion        = profile.idFusion;
        dataJson.token           = profile.token;
        dataJson.bankCode        = $scope.item.bankID;
        dataJson.bankAccount     = $scope.item.bankAccount;
        dataJson.description     = $scope.item.deskripsi;
        dataJson.thirdpartyEmail = $scope.item.email;
        dataJson.transactionID   = null;
        dataJson.refNo           = null;
        dataJson.pin         = null;
        dataJson.amount      = $scope.item.nominal;
        console.log(dataJson);
        var params           = $httpParamSerializer(dataJson);
        TransferService.antar_bank(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount;
                $scope.item.senderName = response.senderName;
                $scope.item.total = Number(response.feeAmount) + Number($scope.item.nominal);
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
        //$scope.item.total = Number($scope.item.nominal) + Number($scope.item.fee);
        //$scope.confirm.show();
    };
})

/*
 * Tarik Tunai
 * -----------------------------------------------------------------------------
 */
.controller('TunaiCtrl', function($scope, $ionicModal, $ionicHistory,$ionicPopup, $state, UserService, TunaiService, $httpParamSerializer, $ionicLoading) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
    $scope.item = {};
    $scope.item.fee = 0;
    //pin = 161285
    var profile = JSON.parse(window.localStorage['profile']);
    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 1;
        dataJson.idTmoney = profile.idTmoney;
        dataJson.idFusion = profile.idFusion;
        dataJson.token    = profile.token;
        dataJson.pin      = null;
        dataJson.amount   = $scope.item.nominal;
        dataJson.transactionID   = null;
        dataJson.refNo           = null;
        console.log(dataJson);
        var params           = $httpParamSerializer(dataJson);
        TunaiService.reserve(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.item.fee = response.feeAmount * 1000;
                $scope.item.receiverCode = response.receiverCode;
                $scope.item.total = Number(response.feeAmount * 1000) + Number($scope.item.nominal);
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var dataJson    = {};
        dataJson.terminal = 'ANDROID-TMONEY';
        dataJson.transactionType = 2;
        dataJson.idTmoney = profile.idTmoney;
        dataJson.idFusion = profile.idFusion;
        dataJson.token    = profile.token;
        dataJson.pin      = $scope.item.pin;
        dataJson.amount   = $scope.item.nominal;
        dataJson.transactionID   = $scope.item.transactionID;
        dataJson.refNo           = $scope.item.refNo;
        var params    = $httpParamSerializer(dataJson);
        TunaiService.reserve(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.receiverCode = response.receiverCode;
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/tarik_tunai/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });
    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/tarik_tunai/status.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };
})

.controller('TokenCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, UserService, $httpParamSerializer, $ionicLoading) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
    $scope.item = {};

    var json    = {};
    var profile = JSON.parse(window.localStorage['profile']);

    $scope.doChange = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        json.terminal = 'ANDROID-TMONEY';
        json.idTmoney = profile.idTmoney;
        json.idFusion = profile.idFusion;
        json.token    = profile.token;
        json.pin      = $scope.item.pin;
        console.log(json);
        var params    = $httpParamSerializer(json);
        UserService.reserveToken(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '309'){
                $scope.item.tokenCode = response.tokenCode;
                $scope.modal.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    }
    $ionicModal.fromTemplateUrl('templates/reservasi_token/konfirmasi.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    // Triggered in the modal to close it
    $scope.close = function() {
        $scope.modal.hide();
    };
})

.controller('DonasiCtrl', function($scope, UserService, $state, $ionicHistory) {
    if(UserService.isLoggedIn() == false) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.welcome',{}, {reload: true});
    }
})
.controller('DonasiBaznasCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, DonasiService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.products = {};
    var json    = {};
    $scope.item.type = "Donasi Baznas";
    var profile = JSON.parse(window.localStorage['profile']);
    json.name = "as";
    var params    = $httpParamSerializer(json);
    DonasiService.getProduct(params).success(function(response) {
        console.log(response);
        $scope.products = response.product;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'failed!',
                template: 'Please check your connection'
        });
    });

    // Modal of Confirmation
    $ionicModal.fromTemplateUrl('templates/donasi/konfirmasi/konfDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });

    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/donasi/status/statusDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };

    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.amount          = $scope.item.amount;
        json.pin             = null;
        json.transactionID   = null;
        json.refNo           = null;
        json.transactionType = 1;
        console.log(json);
        var params    = $httpParamSerializer(json);
        DonasiService.postDonasi(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.item.transactionID = response.transactionID;
                $scope.confirm.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.amount          = $scope.item.amount;
        json.pin             = $scope.item.pin;
        json.transactionID   = $scope.item.transactionID;
        json.refNo           = $scope.item.refNo;
        json.transactionType = 2;
        console.log(json);
        var params    = $httpParamSerializer(json);
        DonasiService.postDonasi(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };
})

.controller('DonasiDhuafaCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, DonasiService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.products = {};
    var json    = {};
    $scope.item.type = "Donasi Dompet Dhuafa";
    var profile = JSON.parse(window.localStorage['profile']);
    json.name = "Dhuafa";
    var params    = $httpParamSerializer(json);
    DonasiService.getProduct(params).success(function(response) {
        console.log(response.product);
        $scope.products = response.product;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'failed!',
                template: 'Please check your connection'
        });
    });

    // Modal of Confirmation
    $ionicModal.fromTemplateUrl('templates/donasi/konfirmasi/konfDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });

    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/donasi/status/statusDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };

    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $scope.confirm.show();
        $ionicLoading.hide();
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.amount          = $scope.item.amount;
        json.pin             = $scope.item.pin;
        json.transactionID   = null;
        json.refNo           = null;
        json.transactionType = 1;
        //console.log(json);
        var params    = $httpParamSerializer(json);
        DonasiService.postDonasi(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };
})

.controller('DonasiPKPUCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, DonasiService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.products = {};
    var json    = {};
    $scope.item.type = "Donasi PKPU";
    var profile = JSON.parse(window.localStorage['profile']);
    json.name = "PKPU";
    var params    = $httpParamSerializer(json);
    DonasiService.getProduct(params).success(function(response) {
        console.log(response.product);
        $scope.products = response.product;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'failed!',
                template: 'Please check your connection'
        });
    });

    // Modal of Confirmation
    $ionicModal.fromTemplateUrl('templates/donasi/konfirmasi/konfDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });

    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/donasi/status/statusDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };

    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $scope.confirm.show();
        $ionicLoading.hide();
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.amount          = $scope.item.amount;
        json.pin             = $scope.item.pin;
        json.transactionID   = null;
        json.refNo           = null;
        json.transactionType = 1;
        var params    = $httpParamSerializer(json);
        DonasiService.postDonasi(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };
})

.controller('DonasiZakatCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, DonasiService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.products = {};
    var json    = {};
    $scope.item.type = "Donasi Rumah Zakat";
    var profile = JSON.parse(window.localStorage['profile']);
    json.name = "rumah";
    var params    = $httpParamSerializer(json);
    DonasiService.getProduct(params).success(function(response) {
        console.log(response.product);
        $scope.products = response.product;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'failed!',
                template: 'Please check your connection'
        });
    });

    // Modal of Confirmation
    $ionicModal.fromTemplateUrl('templates/donasi/konfirmasi/konfDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });

    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/donasi/status/statusDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };

    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $scope.confirm.show();
        $ionicLoading.hide();
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.amount          = $scope.item.amount;
        json.pin             = $scope.item.pin;
        json.transactionID   = null;
        json.refNo           = null;
        json.transactionType = 1;
        var params    = $httpParamSerializer(json);
        DonasiService.postDonasi(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };
})

.controller('DonasiOborCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, $state, DonasiService, $httpParamSerializer, $ionicLoading) {
    $scope.item = {};
    $scope.products = {};
    var json    = {};
    $scope.item.type = "Donasi Obor Berkat";
    var profile = JSON.parse(window.localStorage['profile']);
    json.name = "obor";
    var params    = $httpParamSerializer(json);
    DonasiService.getProduct(params).success(function(response) {
        console.log(response);
        $scope.products = response.product;
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
                title: 'failed!',
                template: 'Please check your connection'
        });
    });

    // Modal of Confirmation
    $ionicModal.fromTemplateUrl('templates/donasi/konfirmasi/konfDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.confirm = modal;
    });

    // Modal of Status Transaction
    $ionicModal.fromTemplateUrl('templates/donasi/status/statusDhuafa.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.status_trans = modal;
    });

    // Triggered in the modal to close it
    $scope.confirm_close = function() {
        $scope.confirm.hide();
    };
    $scope.status_close = function() {
        $scope.status_trans.hide();
    };

    // Open the modal
    $scope.save = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $scope.confirm.show();
        $ionicLoading.hide();
    };

    $scope.doPay = function() {
        $ionicLoading.show({ content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        var json    = {};
        json.terminal        = 'ANDROID-TMONEY';
        json.idTmoney        = profile.idTmoney;
        json.idFusion        = profile.idFusion;
        json.token           = profile.token;
        json.productCode     = $scope.item.productCode;
        json.amount          = $scope.item.amount;
        json.pin             = $scope.item.pin;
        json.transactionID   = null;
        json.refNo           = null;
        json.transactionType = 1;
        var params    = $httpParamSerializer(json);
        DonasiService.postDonasi(params).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if(response.resultCode == '0'){
                $scope.item.refNo = response.refNo;
                $scope.confirm.hide();
                $scope.status_trans.show();
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.resultDesc,
                });
                if(response.resultCode == '007'){
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
                    $state.go('app.welcome',{}, {reload: true});
                }
            }
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                    title: 'failed!',
                    template: 'Please check your connection'
            });
        });
    };
});