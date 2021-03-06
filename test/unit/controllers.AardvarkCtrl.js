'use strict';

/* jasmine specs for controllers go here */
describe('Aardvark controllers', function () {

    beforeEach(function () {
        jasmine.addMatchers({
            toEqualData: function(util, customEqualityTesters) {
                return {
                    compare: function(actual, expected) {
                        var passed = angular.equals(actual, expected);
                        return {
                            pass: passed,
                            message: 'Expected ' + JSON.stringify(actual) + '\nto equal ' + JSON.stringify(expected)
                        };
                    }
                };
            }
        });
    });

    beforeEach(module('Aardvark'));

    describe('AardvarkCtrl', function () {
        var rootScope, scope, ctrl, $httpBackend, browser, location, controllerCreator;

        beforeEach(inject(function ($rootScope, _$httpBackend_, $browser, $location, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/aardvark/config').respond({key: "value", tsdbHost: "tsdb", tsdbPort: 4242});
            $httpBackend.expectGET('http://tsdb:4242/api/config').respond({});
            $httpBackend.expectGET('http://tsdb:4242/api/version').respond({version: "2.0.0"});
            browser = $browser;
            location = $location;
            controllerCreator = $controller;

            // hmm
            rootScope = $rootScope;
            scope = $rootScope.$new();
            ctrl = $controller('AardvarkCtrl', {$scope: scope, $rootScope: rootScope});
        }));


        it('should create a default model and initialise the config on initialisation', function () {
            expect(rootScope.model).toEqualData({
                global: {},
                graphs: [],
                queries: []
            });
            $httpBackend.flush();

            expect(rootScope.config).toEqualData({
                key: "value", tsdbHost: "tsdb", tsdbPort: 4242, tsdbProtocol: "http","annotations":{"allowDelete":true, allowAddEdit: true},
                tsdbBaseReadUrl: "http://tsdb:4242", tsdbBaseWriteUrl: "http://tsdb:4242",
                authenticatedReads: false, authenticatedWrites: false, allowBulkAnnotationsCall: true,
                ui: {
                    metrics: {
                        enableExpandAll:false,
                        alwaysShowMetricFilter:false
                    },
                    graphs: {
                        dygraph: {
                            highlightingDefault:false
                        }
                    }
                },
                hidePrefixes:[]
            });
        });


        it('should create re-request the config and call listeners when config update is requested', function () {
            $httpBackend.flush();

            expect(rootScope.config).toEqualData({
                key: "value", tsdbHost: "tsdb", tsdbPort: 4242, tsdbProtocol: "http","annotations":{"allowDelete":true, allowAddEdit: true},
                tsdbBaseReadUrl: "http://tsdb:4242", tsdbBaseWriteUrl: "http://tsdb:4242",
                authenticatedReads: false, authenticatedWrites: false, allowBulkAnnotationsCall: true,
                ui: {
                    metrics: {
                        enableExpandAll:false,
                        alwaysShowMetricFilter:false
                    },
                    graphs: {
                        dygraph: {
                            highlightingDefault:false
                        }
                    }
                },
                hidePrefixes:[]
            });

            var configReceived = false;
            rootScope.onConfigUpdate(function () {
                configReceived = true;
            });

            // we should get a second get call when we ask the config to update
            $httpBackend.expectGET('/aardvark/config').respond({key: "value", tsdbHost: "tsdb", tsdbPort: 4242});
            $httpBackend.expectGET('http://tsdb:4242/api/config').respond({});
            $httpBackend.expectGET('http://tsdb:4242/api/version').respond({version: "2.0.0"});
            rootScope.updateConfig();
            $httpBackend.flush();
            expect(configReceived).toEqualData(true);
        });

        it('should save the model to the location hash when requested and then rehydrate correctly', function () {

            expect(rootScope.model).toEqualData({
                global: {},
                graphs: [],
                queries: []
            });

            rootScope.model = {
                global: {},
                graphs: [],
                queries: [
                    {
                        id: "1",
                        type: "metric",
                        name: "fred",
                        graphOptions: {
                            graphId: 0
                        }
                    }
                ]
            };
            rootScope.saveModel();

            expect(location.url().indexOf('#')).toEqualData(0);
            var encoded = location.url().substring(0);
            
            location.hash("");
            ctrl = controllerCreator('AardvarkCtrl', {$scope: scope, $rootScope: rootScope});
            expect(rootScope.model).toEqualData({
                global: {},
                graphs: [],
                queries: []
            });

            location.hash(encoded);
            ctrl = controllerCreator('AardvarkCtrl', {$scope: scope, $rootScope: rootScope});
            expect(rootScope.model).toEqualData(
                {
                    "global":{
                        "absoluteTimeSpecification":false,
                        "autoReload":false,
                        "autoGraphHeight":false,
                        globalDownsampling:false,
                        "relativePeriod":"2h",
                        "baselining":false,
                        "graphHeight":null
                    },
                    "graphs":[],
                    "queries":[
                        {
                            "id":1,
                            type: "metric",
                            "name":"fred",
                            "tags":[],
                            "graphOptions":{
                                "rate":false,
                                "rateCounter":false,
                                "downsample":false,
                                "graphId":0,
                                "rateCounterReset":"",
                                "rateCounterMax":"",
                                "downsampleBy":"",
                                "downsampleTo":"",
                                aggregator: null
                            }
                        }
                    ]
                });
            rootScope.saveModel();

            expect(location.url().indexOf('#')).toEqualData(0);
            encoded = location.url().substring(0);

            location.hash("");
            ctrl = controllerCreator('AardvarkCtrl', {$scope: scope, $rootScope: rootScope});
            expect(rootScope.model).toEqualData(
                {
                    global: {},
                    graphs: [],
                    queries: []
                });

            location.hash(encoded);
            ctrl = controllerCreator('AardvarkCtrl', {$scope: scope, $rootScope: rootScope});
            expect(rootScope.model).toEqualData(
                {
                    "global":{
                        "absoluteTimeSpecification":false,
                        "autoReload":false,
                        "autoGraphHeight":false,
                        globalDownsampling:false,
                        "relativePeriod":"2h",
                        "baselining":false,
                        "graphHeight":null
                    },
                    "graphs":[],
                    "queries":[
                        {
                            "id":1,
                            type: "metric",
                            "name":"fred",
                            "tags":[],
                            "graphOptions":{
                                "rate":false,
                                "rateCounter":false,
                                "downsample":false,
                                "graphId":0,
                                "rateCounterReset":"",
                                "rateCounterMax":"",
                                "downsampleBy":"",
                                "downsampleTo":"",
                                aggregator: null
                            }
                        }
                    ]
                });
            rootScope.saveModel();
            expect(location.url()).toEqualData(encoded);
        });
        
        it('autoReload timer should be triggered when setup', function() {
            expect(rootScope.activeTimeoutId).toEqualData(null);
            
            rootScope.model = {
                global: {
                    autoReload: true,
                    autoReloadPeriod: "60"
                },
                graphs: [],
                queries: []
            }
            
            rootScope.resetAutoReload();
            
            var timeoutId = rootScope.activeTimeoutId;
            expect(timeoutId != null).toEqualData(true);

            rootScope.model = {
                global: {
                    autoReload: true,
                    autoReloadPeriod: "120"
                },
                graphs: [],
                queries: []
            }

            rootScope.resetAutoReload();

            var timeoutId2 = rootScope.activeTimeoutId;
            expect(timeoutId != timeoutId2).toEqualData(true);

            rootScope.model = {
                global: {
                    autoReload: false
                },
                graphs: [],
                queries: []
            }

            rootScope.resetAutoReload();
            
            expect(rootScope.activeTimeoutId).toEqualData(null);
        })

    });
});

