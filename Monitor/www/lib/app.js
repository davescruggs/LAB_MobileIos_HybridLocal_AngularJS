/**
 * Describe Salesforce object to be used in the app. For example: Below AngularJS factory shows how to describe and
 * create an 'Contact' object. And then set its type, fields, where-clause etc.
 *
 *  PS: This module is injected into ListCtrl, EditCtrl etc. controllers to further consume the object.
 */

angular.module('SeeTheWonder', ['AngularForce', 'AngularForceObjectFactory', 'Contact', 'Account', 'Lead', 'Wonder__c', 'Employee']);

/**
 * Configure all the AngularJS routes here.
 */
angular.module('SeeTheWonder').config(function ($routeProvider) {
    $routeProvider.
    when('/contacts', {
        controller: 'ContactCtrl',
        templateUrl: 'partials/contacts.html'
    }).
    when('/contacts/view/:contactId', {
        controller: 'ContactViewCtrl',
        templateUrl: 'partials/contact/view.html'
    }).
    when('/accounts', {
        controller: 'AccountCtrl',
        templateUrl: 'partials/accounts.html'
    }).
    when('/leads', {
        controller: 'LeadCtrl',
        templateUrl: 'partials/leads.html'
    }).
    when('/leadnew', {
        controller: 'LeadDetailCtrl',
        templateUrl: 'partials/newLead.html'
    }).
    when('/about', {
        controller: 'AboutCtrl',
        templateUrl: 'partials/about.html'
    }).
    when('/employees', {
        controller: 'EmployeeCtrl',
        templateUrl: 'partials/employees.html'
    }).
    when('/logout', {
        controller: 'AboutCtrl',
        templateUrl: 'partials/logout.html'
    }).
    when('/wonder', {
        controller: 'WonderCtrl',
        templateUrl: 'partials/contacts.html'
    }).
    when('/wonder/:wonderId', {
        controller: 'WonderDetailCtrl',
        templateUrl: 'partials/detail.html'
    }).
    when('/camera', {
        controller: 'CameraCtrl',
        templateUrl: 'partials/camera.html'
    }).
    otherwise({
        redirectTo: '/wonder'
    });
});

angular.module('Contact', []).factory('Contact', function (AngularForceObjectFactory) {
    //Describe the contact object
    var objDesc = {
        type: 'Contact',
        fields: ['Id', 'Name', 'FirstName', 'LastName', 'Phone', 'Email'],
        where: '',
        orderBy: 'LastName ASC',
        limit: 20
    };
    var Contact = AngularForceObjectFactory(objDesc);

    return Contact;
});

angular.module('Account', []).factory('Account', function (AngularForceObjectFactory) {
    //Describe the contact object
    var objDesc = {
        type: 'Account',
        fields: ['Id', 'Name', 'Type', 'Phone', 'Fax'],
        where: '',
        orderBy: 'Name ASC',
        limit: 20
    };
    var Account = AngularForceObjectFactory(objDesc);

    return Account;
});

angular.module('Lead', []).factory('Lead', function (AngularForceObjectFactory) {
    //Describe the contact object
    var objDesc = {
        type: 'Lead',
        fields: ['Id', 'Name', 'Company', 'Phone', 'FirstName', 'LastName', 'Status'],
        where: '',
        orderBy: 'CreatedDate DESC',
        limit: 20
    };
    var Lead = AngularForceObjectFactory(objDesc);

    return Lead;
});

angular.module('Wonder__c', []).factory('Wonder__c', function (AngularForceObjectFactory) {
    //Describe the contact object
    var objDesc = {
        type: 'Contact',
        fields: ['Id', 'Name', 'Phone', 'Email'],
        where: '',
        orderBy: 'CreatedDate DESC',
        limit: 20
    };
    var Wonder__c = AngularForceObjectFactory(objDesc);

    return Wonder__c;
});

// got this from http://docs.angularjs.org/api/ngResource.$resource and http://docs.angularjs.org/tutorial/step_11. 
// hope it works.
angular.module('Employee', ['ngResource']).factory('Employee', function ($http) {
    console.log('retrieving employees from still-refuge-9644');
    var Employee = {
        query: function () {
            return $http.get('https://still-refuge-9644.herokuapp.com/employees')
        }
    };
    console.log('acquired employee list factory object')
    return Employee;
});


angular.module('SeeTheWonder').controller('AboutCtrl', ['$scope', '$location', 'AngularForce', '$rootScope',

     function ($scope, $location, AngularForce, $rootScope) {
        $rootScope.buttonPrompt = "Back";
        $rootScope.doButtonAction = function () {
            $location.path("/about");
        }

        $scope.doLogout = function () {
            //AngularForce.logout(function() { $scope.showFinal(); });
            cordova.require("salesforce/plugin/oauth").logout();
        }
     }]);

angular.module('SeeTheWonder').controller('ContactCtrl', ['$scope', '$location', 'Contact', 'AngularForce', 'SFConfig', '$rootScope',

    function ($scope, $location, Contact, AngularForce, SFConfig, $rootScope) {
        $scope.errorMessage = null;
        $rootScope.mainheading = "Contacts";

        $rootScope.doButtonAction = function () {
            $location.path("/about");
        }

        Contact.query(function (data) {
            $scope.records = data.records;
            $scope.$apply();
        }, function (data) {
            logToConsole('QUERYERROR');
            logToConsole(data);
            $scope.errorMessage = data.responseText;
            $scope.$apply();
        });



    }]);

angular.module('SeeTheWonder').controller('EmployeeCtrl', ['$scope', '$location', 'Employee', 'AngularForce', 'SFConfig', '$rootScope',

    function ($scope, $location, Employee, AngularForce, SFConfig, $rootScope) {
        $scope.errorMessage = null;
        $scope.employees = [];
        $rootScope.mainheading = "Employees";

        $rootScope.doButtonAction = function () {
            $location.path("/about");
        }

        console.log('&&&&& Resful Query for Employees &&&&&');

        var handleSuccess = function (data, status) {
            $scope.employees = data.rows; // TODO: should have error checking here
            console.log('EmployeeCtrl handleSuccess');
            console.log($scope.employees);
        };

        var handleError = function (data, status, headers, config) {
            $scope.errorMessage = "Error: " + status;
            console.log('EmployeeCtrl handleError reached');
        };

        Employee.query().success(handleSuccess).error(handleError);


        //        $scope.employees = [{"id":10002,"first_name":"Bezalel","last_name":"Simmel","hire_date":"1985-11-21T00:00:00.000Z"},{"id":10003,"first_name":"Parto","last_name":"Bamford","hire_date":"1986-08-28T00:00:00.000Z"},{"id":10004,"first_name":"Chirstian","last_name":"Koblick","hire_date":"1986-12-01T00:00:00.000Z"},{"id":10005,"first_name":"Kyoichi","last_name":"Maliniak","hire_date":"1989-09-12T00:00:00.000Z"},{"id":10006,"first_name":"Anneke","last_name":"Preusig","hire_date":"1989-06-02T00:00:00.000Z"},{"id":10007,"first_name":"Tzvetan","last_name":"Zielinski","hire_date":"1989-02-10T00:00:00.000Z"},{"id":10008,"first_name":"Saniya","last_name":"Kalloufi","hire_date":"1994-09-15T00:00:00.000Z"},{"id":10009,"first_name":"Sumant","last_name":"Peac","hire_date":"1985-02-18T00:00:00.000Z"},{"id":10010,"first_name":"Duangkaew","last_name":"Piveteau","hire_date":"1989-08-24T00:00:00.000Z"}];

        //        console.log('&&&&& Made $resource query &&&&&');

        console.log('&&&&& leaving employee list controller &&&&&&');
    }]);

angular.module('SeeTheWonder').controller('ContactViewCtrl', ['$scope', '$location', 'Contact', 'AngularForce', 'SFConfig', '$rootScope', '$routeParams', function ($scope, $location, Contact, AngularForce, SFConfig, $rootScope, $routeParams) {
        var self = this;

        $rootScope.doButtonAction = function () {
            $location.path("/about");
        }

        console.log('+++ Contact detail +++');
        if ($routeParams.contactId) {
            console.log('+++ Finding contact id: ' + $routeParams.contactId + ' +++ ');
            AngularForce.login(function () {
                Contact.get({
                    id: $routeParams.contactId
                }, function (contact) {
                    self.original = contact;
                    $scope.contact = new Contact(self.original);
                    $scope.$apply(); //Required coz sfdc uses jquery.ajax
                    console.log('********* contact: *****');
                    for (var prop in contact) {
                        console.log(prop + ': ' + $scope.contact[prop])
                    }
                    console.log('First name: ' + $scope.contact.FirstName);
                    console.log('Last name: ' + $scope.contact.LastName);
                    console.log(' ******');
                });
            });
            console.log('+++ Contact found: +++');
            console.log('********* contact: *****');
            for (var prop in $scope.contact) {
                console.log(prop + ': ' + $scope.contact[prop])
            }
            console.log(' ******');
        } else {
            $scope.contact = new Contact();
            //$scope.$apply();
            console.log('New contact created');
        }

        $scope.isClean = function () {
            return angular.equals(self.original, $scope.contact);
        }

        $scope.destroy = function () {
            self.original.destroy(function () {
                $scope.$apply(function () {
                    $location.path('/contacts');
                });
            }, function (errors) {
                alert("Could not delete contact!\n" + JSON.parse(errors.responseText)[0].message);
            });
        };

        $scope.save = function () {
            if ($scope.contact.Id) {
                $scope.contact.update(function () {
                    $scope.$apply(function () {
                        $location.path('/contacts/view/' + $scope.contact.Id);
                    });

                });
            } else {
                Contact.save($scope.contact, function (contact) {
                    var c = contact;
                    $scope.$apply(function () {
                        $location.path('/contacts/view/' + c.Id || c.id);
                    });
                });
            }
        };

        $scope.doCancel = function () {
            if ($scope.contact.Id) {
                $location.path('/contacts/view/' + $scope.contact.Id);
            } else {
                $location.path('/contacts');
            }
        }
    }]);

angular.module('SeeTheWonder').controller('LeadCtrl', ['$scope', '$location', 'Lead', 'AngularForce', 'SFConfig', '$rootScope',

    function ($scope, $location, Lead, AngularForce, SFConfig, $rootScope) {
        $scope.errorMessage = null;

        $rootScope.mainheading = "Leads";
        $rootScope.doButtonAction = function () {
            $location.path("/leadnew");
        }

        Lead.query(function (data) {
            $scope.records = data.records;
            $scope.$apply();
        }, function (data) {
            logToConsole('QUERYERROR');
            logToConsole(data);
            $scope.errorMessage = data.responseText;
            $scope.$apply();
        });
    }]);

angular.module('SeeTheWonder').controller('AccountCtrl', ['$scope', '$location', 'Account', 'AngularForce', 'SFConfig', '$rootScope',

    function ($scope, $location, Account, AngularForce, SFConfig, $rootScope) {
        $scope.errorMessage = null;
        $rootScope.mainheading = "Accounts";
        $rootScope.doButtonAction = function () {
            $location.path("/about");
        }

        $scope.hasErrorMessage = function () {
            return $scope.errorMessage != null;
        }

        Account.query(function (data) {
            $scope.records = data.records;
            $scope.$apply();
        }, function (data) {
            logToConsole('QUERYERROR');
            logToConsole(data);
            $scope.errorMessage = data.responseText;
            $scope.$apply();
        });



    }]);



angular.module('SeeTheWonder').controller('LeadDetailCtrl', ['$scope', '$location', 'Lead', 'AngularForce', 'SFConfig', '$rootScope',

    function ($scope, $location, Lead, AngularForce, SFConfig, $rootScope) {
        $scope.errorMessage = null;

        $rootScope.mainheading = "New Lead";


        $scope.newLead = new Lead();

        $scope.doSave = function () {
            $scope.newLead.LeadStatus = 'Open - Not Contacted';
            Lead.save($scope.newLead, function (data) {
                //alert('success!');
                $location.path("/leads");
                $scope.apply(function () {
                    $location.path("/leads");
                });
            }, function (data) {
                logToConsole('QUERYERROR');
                logToConsole(data.responseText);
                alert('error!');
            });


        }

    }]);

angular.module('SeeTheWonder').controller('WonderCtrl', ['$scope', '$location', 'Wonder__c', 'Contact', 'AngularForce', 'SFConfig', '$rootScope',

    function ($scope, $location, Wonder__c, Contact, AngularForce, SFConfig, $rootScope) {
        $scope.errorMessage = null;
        $scope.instanceUrl = SFConfig.originalOptions.instanceUrl;

        $rootScope.buttonPrompt = " + ";
        $rootScope.doButtonAction = function () {
            $location.path("/camera");
        }
        $rootScope.hasButtonPrompt = function () {
            return $rootScope.buttonPrompt != null;
        }


        $scope.hasErrorMessage = function () {
            return $scope.errorMessage != null;
        }

        $scope.showDetail = function (targetId) {
            logToConsole('here I am');
            $location.path('/wonder/' + targetId);
        }

        Contact.query(function (data) {
            $scope.records = data.records;
            $scope.$apply();
        }, function (data) {
            logToConsole('QUERYERROR');
            logToConsole(data);
            $scope.errorMessage = data.responseText;
            $scope.$apply();
        });



    }]);

angular.module('SeeTheWonder').controller('WonderDetailCtrl', ['$scope', '$routeParams', '$location', 'Wonder__c', 'AngularForce', 'SFConfig', '$rootScope',

    function ($scope, $routeParams, $location, Wonder__c, AngularForce, SFConfig, $rootScope) {

        $rootScope.buttonPrompt = "Back";
        $rootScope.doButtonAction = function () {
            $location.path("/wonder");
        }

        $scope.instanceUrl = SFConfig.originalOptions.instanceUrl;

        $scope.targetId = $routeParams.wonderId;

        $scope.summary = null;

        $scope.processing = true;

        $scope.description = null;

        $scope.isWorking = function () {
            return $scope.processing;
        }


        $scope.doCommentOnDetail = function () {
            logToConsole("in do comment on detail");
            if (!$scope.description || $scope.description == "") {
                logToConsole("about description is " + $scope.description);
                return;
            }
            data = {
                "comment": $scope.description
            };

            $scope.processing = true;

            Wonder__c.apexrest(
                "/wonder/detail/" + $scope.targetId, function (data) {
                logToConsole("wonder detail post comment success");
                $scope.processing = false;
                $scope.description = null;
                $scope.doDisplayDetail();
            }, function (data) {
                logToConsole("combined failure");
                logArray(data);
                $scope.errorText = data.responseText;
                $scope.processing = false;
                $scope.$apply();
            },
                "post",
                data, {},
                false);
        }

        $scope.doDisplayDetail = function () {
            Wonder__c.apexrest(
                "/wonder/detail/" + $scope.targetId, function (data) {
                logToConsole("wonder detail success");
                $scope.summary = data;
                $scope.processing = false;

                $scope.$apply();
            }, function (data) {
                logToConsole("combined failure");
                logArray(data);
                $scope.errorText = data.responseText;
                $scope.processing = false;
                $scope.$apply();
            },
                "get", {}, {},
                false);
        }

        $scope.doDisplayDetail();

    }]);

angular.module('SeeTheWonder').controller('CameraCtrl', ['$scope', '$location', 'Wonder__c', '$rootScope',

        function ($scope, $location, Wonder__c, $rootScope) {

        $rootScope.buttonPrompt = "Back";
        $rootScope.doButtonAction = function () {
            $location.path("/wonder");
        }


        $scope.newPicture = null;
        $scope.newWonder = null;
        $scope.status = "Ready";
        $scope.description;
        $scope.processing = false;
        $scope.errorText = null;

        $scope.imagesource = Camera.PictureSourceType.PHOTOLIBRARY;

        $scope.hasPicture = function () {
            return $scope.newPicture != null;
        }

        $scope.hasError = function () {
            return $scope.errorText != null;
        }

        $scope.isWorking = function () {
            return $scope.processing;
        }

        $scope.doList = function () {
            logToConsole('attempting to update location');
            $location.path('/wonder');
            $scope.$apply();
        }

        $scope.doPictureCamera = function () {
            $scope.imagesource = Camera.PictureSourceType.CAMERA;
            $scope.doPicture();
        };

        $scope.doPictureLibrary = function () {
            $scope.imagesource = Camera.PictureSourceType.PHOTOLIBRARY;
            $scope.doPicture();
        };



        $scope.doPicture = function () {
            var options = {
                quality: 10,
                correctOrientation: true,
                // Very useful for debugging in the emulator!
                sourceType: $scope.imagesource,
                //sourceType: Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG
            };
            navigator.camera.getPicture(function (imageData) {
                $scope.status = "Photo Success";
                $scope.newPicture = imageData;
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData
                $scope.$apply();
            }, function (errorMsg) {
                // Most likely error is user cancelling out
                //cordova.require("salesforce/util/logger").logToConsole("Photo Error " + errorMsg);
                $scope.status = "Photo Fail";

            },
                options);
            return false;
        };

        $scope.doReportTheWasteCombined = function () {
            //path, callback, error, method, payload, paramMap, retry
            logToConsole("in doCombinedPost1");

            $scope.processing = true;

            data = {
                "image": $scope.newPicture,
                "description": $scope.description,
            };

            logToConsole("in doCombinedPost2");


            Wonder__c.apexrest(
                "/wonderHelper", function (data) {
                logToConsole("combined success");
                $scope.doList();
            }, function (data) {
                logToConsole("combined failure");
                logArray(data);
                $scope.errorText = data.responseText;
                $scope.processing = false;
                $scope.$apply();
            },
                "post",
                data, {},
                false);



        };
        }]);