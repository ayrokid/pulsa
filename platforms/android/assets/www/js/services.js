angular.module('starter.services', [])

.service('UserService', function($q, $http){

    var BASE_URL = 'http://devapi.ucontestdev.info/api/';

    if (window.localStorage['profile']) {
        var _user = JSON.parse(window.localStorage['profile']);
    }

    var setUser = function (session) {
        _user = session;
        window.localStorage['profile'] = JSON.stringify(_user);
    }

    return {
        singUp: function(data) {
            var link = BASE_URL+'sign-up';
            return $http.post(link,data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },

        singIn: function(data) {
            var link = BASE_URL+'sign-in';
            return $http.post(link,data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },

        profile: function(data) {
            var link = BASE_URL+'my-profile';
            return $http.post(link,data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },

        setUser: function(){
            _user = JSON.parse(window.localStorage['profile']);
        },

        isLoggedIn: function () {
            return _user ? true : false;
        },

        getUser: function () {
            return _user;
        },

        logout: function (data) {
            window.localStorage.removeItem("profile");
            _user    = null;

            var link = BASE_URL+'sign-out';

            return $http.post(link,data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        resetPassword: function(data) {
            var link = BASE_URL+'reset-password';
            return $http.post(link,data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        changePassword: function(data) {
            var link = BASE_URL+'change-password';
            return $http.post(link,data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        changePIN: function(data) {
            var link = BASE_URL+'change-pin';
            return $http.post(link,data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        reserveToken: function(data) {
            var url = BASE_URL+'reserve-token';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        history: function(data) {
            var url = BASE_URL+'transaction-history';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    }
})

.service('PulsaService', function($http){
    var BASE_URL = 'http://devapi.ucontestdev.info/api/';
    return {
        getProduct: function(data) {
            var url = BASE_URL+'get-product';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getNominal: function(data) {
            var url = BASE_URL+'get-product/nominal';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        topUp: function(data) {
            var url = BASE_URL+'topup-prepaid';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    }
})

.service('TagihanService', function($http){
    var BASE_URL = 'http://devapi.ucontestdev.info/api/';
    return {
        billPayment: function(data) {
            var url = BASE_URL+'bill-payment';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    }
})

.service('TransferService', function($http){
    var BASE_URL = 'http://devapi.ucontestdev.info/api/';
    return {
        antar_akun: function(data) {
            var url = BASE_URL+'transfer-p2p';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        antar_bank: function(data) {
            var url = BASE_URL+'transfer-p2b';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    }
})

.service('TunaiService', function($http){
    var BASE_URL = 'http://devapi.ucontestdev.info/api/';
    return {
        usage: function(data) {
            var url = BASE_URL+'cashout-tarik-tunai';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        reserve: function(data) {
            var url = BASE_URL+'reserve-tarik-tunai';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    }
})

.service('DonasiService', function($http){
    var BASE_URL = 'http://devapi.ucontestdev.info/api/';
    return {
        getProduct: function(data) {
            var url = BASE_URL+'get-product';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        postDonasi: function(data) {
            var url = BASE_URL+'donation';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    }
})