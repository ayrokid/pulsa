// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'highcharts-ng'])

.run(function($ionicPlatform, $ionicPopup) {
  $ionicPlatform.ready(function() {

    // Check for network connection
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
          title: 'No Internet Connection',
          content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
        })
        .then(function(result) {
          if(!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    .state('app.welcome', {
        url: '/welcome',
        views: {
            'menuContent': {
                templateUrl: 'templates/welcome.html',
                controller: 'WelcomeCtrl'
            }
        }
    })
    .state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            }
        }
    })
    .state('app.about', {
        cache: false,
        url: '/about',
        views: {
            'menuContent': {
            templateUrl: 'templates/about.html',
            controller: 'AboutCtrl'
            }
        }
    })
    .state('app.dashboard', {
        cache: false,
        url: '/dashboard',
        views: {
            'menuContent': {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashCtrl'
            }
        }
    })
    .state('app.profil', {
        cache: false,
        url: '/profil',
        views: {
            'menuContent': {
                templateUrl: 'templates/profil.html',
                controller: 'ProfilCtrl'
            }
        }
    })
    .state('app.edit_profil', {
        cache: false,
        url: '/edit_profil',
        views: {
            'menuContent': {
                templateUrl: 'templates/editProfil.html',
                controller: 'ProfilCtrl'
            }
        }
    })
    .state('app.upgrade_akun', {
        url: '/upgrade_akun',
        views: {
            'menuContent': {
                templateUrl: 'templates/upgradeAkun.html',
                controller: 'UpgradeCtrl'
            }
        }
    })
    .state('app.ubah_password', {
        url: '/ubah_password',
        views: {
            'menuContent': {
                templateUrl: 'templates/ubahPassword.html',
                controller: 'UbahPasswordCtrl'
            }
        }
    })
    .state('app.ubah_pin', {
        url: '/ubah_pin',
        views: {
            'menuContent': {
                templateUrl: 'templates/ubahPin.html',
                controller: 'UbahPinCtrl'
            }
        }
    })
    .state('app.history', {
        url: '/history',
        views: {
            'menuContent': {
                templateUrl: 'templates/history.html',
                controller: 'HistoryCtrl'
            }
        }
    })
    .state('app.faq', {
        url: '/faq',
        views: {
            'menuContent': {
                templateUrl: 'templates/faq.html',
                controller: 'FaqCtrl'
            }
        }
    })

    /*
     Beli Pulsa
     ---------------------------------------------------------------------------
     */
    .state('app.beli_pulsa', {
        url: '/beli_pulsa',
        views: {
            'menuContent': {
                templateUrl: 'templates/beliPulsa.html',
                controller: 'BeliPulsaCtrl'
            }
        }
    })

    .state('app.pulsa_telepon', {
        url: '/pulsa_telepon',
        views: {
            'menuContent': {
                templateUrl: 'templates/pulsa_telepon/form.html',
                controller: 'PulsaTeleponCtrl'
            }
        }
    })

    .state('app.pulsa_listrik', {
        url: '/pulsa_listrik',
        views: {
            'menuContent': {
                templateUrl: 'templates/pulsa_listrik/form.html',
                controller: 'PulsaListrikCtrl'
            }
        }
    })
    .state('app.voucher_game', {
        url: '/voucher_game',
        views: {
            'menuContent': {
                templateUrl: 'templates/voucher_game/form.html',
                controller: 'VoucherGameCtrl'
            }
        }
    })

    /*
     Bayar Tagihan
     ---------------------------------------------------------------------------
     */
    .state('app.tagihan', {
        url: '/tagihan',
        views: {
            'menuContent': {
                templateUrl: 'templates/tagihan.html',
                controller: 'TagihanCtrl'
            }
        }
    })
    .state('app.tagihan_telepon', {
        url: '/tagihan_telepon',
        views: {
            'menuContent': {
                templateUrl: 'templates/tagihan_telepon/form.html',
                controller: 'TagihanCtrl'
            }
        }
    })
    .state('app.tagihan_internet', {
        url: '/tagihan_internet',
        views: {
            'menuContent': {
                templateUrl: 'templates/tagihan_internet/form.html',
                controller: 'TagihanInternetCtrl'
            }
        }
    })
    .state('app.tagihan_listrik', {
        url: '/tagihan_listrik',
        views: {
            'menuContent': {
                templateUrl: 'templates/tagihan_listrik/form.html',
                controller: 'TagihanListrikCtrl'
            }
        }
    })
    .state('app.tagihan_tv', {
        url: '/tagihan_tv',
        views: {
            'menuContent': {
                templateUrl: 'templates/tagihan_tv/form.html',
                controller: 'TagihanTVCtrl'
            }
        }
    })
    .state('app.tagihan_pdam', {
        url: '/tagihan_pdam',
        views: {
            'menuContent': {
                templateUrl: 'templates/tagihan_pdam/form.html',
                controller: 'TagihanPDAMCtrl'
            }
        }
    })
    .state('app.tagihan_kredit', {
        url: '/tagihan_kredit',
        views: {
            'menuContent': {
                templateUrl: 'templates/tagihan_kredit/form.html',
                controller: 'TagihanKreditCtrl'
            }
        }
    })

    /*
     Transfer
     ---------------------------------------------------------------------------
     */
    .state('app.transfer', {
        url: '/transfer',
        views: {
            'menuContent': {
                templateUrl: 'templates/transfer.html',
                controller: 'TransferCtrl'
            }
        }
    })
    .state('app.transfer_tmoney', {
        url: '/transfer_tmoney',
        views: {
            'menuContent': {
                templateUrl: 'templates/transfer/tmoney.html',
                controller: 'TransferTmoneyCtrl'
            }
        }
    })
    .state('app.transfer_bank', {
        url: '/transfer_bank',
        views: {
            'menuContent': {
                templateUrl: 'templates/transfer/bank.html',
                controller: 'TransferBankCtrl'
            }
        }
    })

    /*
     Tarik Tunai
     ---------------------------------------------------------------------------
     */
    .state('app.tarik_tunai', {
        url: '/tarik_tunai',
        views: {
            'menuContent': {
                templateUrl: 'templates/tarikTunai.html',
                controller: 'TunaiCtrl'
            }
        }
    })

    /*
     Reset Token
     ---------------------------------------------------------------------------
     */
    .state('app.buat_token', {
        url: '/buat_token',
        views: {
            'menuContent': {
                templateUrl: 'templates/buatToken.html',
                controller: 'TokenCtrl'
            }
        }
    })

    /*
     Donasi
     ---------------------------------------------------------------------------
     */
    .state('app.donasi', {
        url: '/donasi',
        views: {
            'menuContent': {
                templateUrl: 'templates/donasi.html',
                controller: 'DonasiCtrl'
            }
        }
    })
    .state('app.donasi_baznas', {
        url: '/donasi_baznas',
        views: {
            'menuContent': {
                templateUrl: 'templates/donasi/baznas.html',
                controller: 'DonasiBaznasCtrl'
            }
        }
    })
    .state('app.donasi_dhuafa', {
        url: '/donasi_dhuafa',
        views: {
            'menuContent': {
                templateUrl: 'templates/donasi/dhuafa.html',
                controller: 'DonasiDhuafaCtrl'
            }
        }
    })
    .state('app.donasi_pkpu', {
        url: '/donasi_pkpu',
        views: {
            'menuContent': {
                templateUrl: 'templates/donasi/pkpu.html',
                controller: 'DonasiPKPUCtrl'
            }
        }
    })
    .state('app.donasi_zakat', {
        url: '/donasi_zakat',
        views: {
            'menuContent': {
                templateUrl: 'templates/donasi/zakat.html',
                controller: 'DonasiZakatCtrl'
            }
        }
    })
    .state('app.donasi_obor', {
        url: '/donasi_obor',
        views: {
            'menuContent': {
                templateUrl: 'templates/donasi/obor.html',
                controller: 'DonasiOborCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/welcome');
});
