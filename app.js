angular.module('paiFrontend', ['ui.bootstrap','ui.utils','ui.router','ngAnimate', 'restangular']);

angular.module('paiFrontend').config(function($stateProvider, $urlRouterProvider) {

    /* Add New States Above */
    $urlRouterProvider.otherwise('/home');

});

angular.module('paiFrontend').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});

angular.module('paiFrontend').controller('MainController', function ($scope, Restangular) {
    function getRestangularInstance() {
        return Restangular
            .withConfig(function (cfg) {
                cfg.setBaseUrl("http://admin:admin@localhost:8080");
                cfg.setDefaultHeaders({'Authorization':'Basic YWRtaW46YWRtaW4='});
            })
    }

    $scope.deliverymen = null;
    getRestangularInstance()
        .all('deliveryman')
        .getList()
        .then(function (data) {
            $scope.deliverymen = data;
        });

    $scope.addDeliveryman = function (newDeliveryman) {
        $scope.deliverymen.push(angular.copy(newDeliveryman));

        return getRestangularInstance()
            .all('deliveryman')
            .post(newDeliveryman);
    };

    $scope.removeDeliveryman = function (deliveryman) {
        var index = $scope.deliverymen.indexOf(deliveryman);
        if(index !== -1){
            $scope.deliverymen.splice(index, 1);
        }

        return getRestangularInstance()
            .one('deliveryman', deliveryman.id)
            .remove();
    };
});
