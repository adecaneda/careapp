/**
 * Created by Ale on 10.12.2014.
 */
var careappFront = angular.module('careappFront', []);

function customersController($scope, $http) {

    // Initialize things
    $scope.formData = {
        customer: {}
    };
    $scope.entities = {
        customers: {}
    };

    // when landing on the page, get all customers and show them
    $scope.refreshCustomers = function() {
        $http.get('/api/customers')
            .success(function(data) {
                $scope.entities.customers = data;
            })
            .error(function(data) {
                console.log('Error: ' + data.message);
            });
    };
    $scope.refreshCustomers();

    // saves/updates a customer from the form
    $scope.saveCustomer = function() {
        if ($scope.formData.customer._id) {
            $http.put('/api/customers/' + $scope.formData.customer._id, $scope.formData.customer)
                .success(function (data) {
                    // clear the form
                    $scope.formData.customer = {};
                    console.log(data);
                })
                .error(function (data) {
                    alert('Error: ' + data.message);
                });
        } else {
            $http.post('/api/customers', $scope.formData.customer)
                .success(function (data) {
                    // clear the form
                    $scope.formData.customer = {};
                    // add the new customer
                    $scope.refreshCustomers();
                })
                .error(function (data) {
                    alert('Error: ' + data.message);
                });
        }
    };

    // selects or unselect a customer
    $scope.selectCustomer = function(idx) {
        if (idx == undefined) {
            $scope.formData.customer = {}
        } else {
            $scope.formData.customer = $scope.entities.customers[idx];
        }
    };

    // deletes a customer
    $scope.deleteCustomer = function(idx) {
        $http.delete('/api/customers/' + $scope.entities.customers[idx]._id)
            .success(function(data) {
                $scope.entities.customers.splice(idx, 1);
            })
            .error(function(data) {
                alert('Error: ' + data.message);
            });
    };

}

function changesController($scope, $http) {

    // Initialize things
    $scope.formData = {
        change: {}
    };
    $scope.entities = {
        changes: {}
    };
    $scope.entity = {
        change: {}
    };

    // when landing on the page, get all changes and show them
    $scope.refreshChanges = function() {
        $http.get('/api/changelog', {params: $scope.formData.change})
            .success(function(data) {
                $scope.entities.changes = data;
            })
            .error(function(data) {
                console.log('Error: ' + data.message);
            });
    };
    $scope.refreshChanges();

    // selects/unselects a change
    $scope.selectChange = function(idx) {
        if (idx == undefined) {
            $scope.formData.change = {};

        } else {
            $scope.entity.change = $scope.entities.changes[idx];
            $scope.formData.change = {
                model: $scope.entity.change.model,
                eid: $scope.entity.change.eid
            }
        }

    };

}