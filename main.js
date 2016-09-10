var origin = '';
var destination = '';
var durationText = '';
var latLongs = {'S. LUIS REY': {lat: 33.405157,lng:-117.598075},
                'MAGDALENA': {lat: 33.413656,lng: -117.602388},
                'EL CAMINO REAL': {lat: 33.420511,lng: -117.606481},
                'PRESIDIO': {lat: 33.428817,lng: -117.611856},
                'PICO 2': {lat: 33.440004,lng: -117.624274}
};

var app = angular.module('traffic', []);
app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {"Content-Type": "application/x-www-form-urlencoded"};
});
app.controller('trafficController', function ($scope, $http, $timeout) {
    var self = this;
    self.loading = false;
    self.colors = ['rgba(0,128,255,0.2)', 'rgba(0, 51, 102, 0.2)', 'rgba(0, 204, 204, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(0, 204, 0, 0.2)', 'rgba(204, 0, 204, 0.2)', 'rgba(255, 128, 0, 0.2)'],
    self.onRamps = [];
    self.offRamps = [];
    self.markers = [];
    self.httpObject = function (callBack) {
        var httpSelf = this;
        httpSelf.callBack = callBack.bind(httpSelf);


        httpSelf.httpCall = function (command) {
            self.loading = true;
            this.command = command;
            var dataObj = $.param({
                origin: $('.originInput').val(),
                destination: $('.destinationInput').val(),
                date: $('.day').val(),
                command: this.command
            });

            $http({
                url: 'traffic_server.php',
                method: 'post',
                dataType: 'json',
                data: dataObj
            }).then(function success(response) {
                httpSelf.callBack(response);
            }, function error(response) {
                console.log('ERROR ERROR ERROR', response);
            });
        }
    };
    self.initialhttpCall = new self.httpObject(function (response) {
        var onRampInfo = response.data.data.onRamp;
        var offRampInfo = response.data.data.offRamp;
        for (var index in onRampInfo) {
            self.onRamps.push({
                name: onRampInfo[index].name,
                id: onRampInfo[index].ID,
                lat: onRampInfo[index].lat,
                long: onRampInfo[index].long
            });
        }
        for (var index in offRampInfo) {
            self.offRamps.push({
                name: offRampInfo[index].name,
                id: offRampInfo[index].ID,
                lat: offRampInfo[index].lat,
                long: offRampInfo[index].long
            });
        }
        self.initMap();
        self.addMarkers();
        self.loading = false;
    });

    self.calculationCall = new self.httpObject(function (response) {
        self.createGraph(response);
        console.log('calculationCall', response);
        var chosenDayData = response.data.data[$('.day').val() - 1];
        console.log('first time for chosen day: ', chosenDayData[0]);
        self.populateHourDivs(chosenDayData);
        self.loading = false;
    });
    self.populateHourDivs = function (chosenDayData) {
        var dayColor = self.colors[$('.day').val() - 1];
        for (var i = 0; i < 144; i += 6) {
            var hourDivID = i / 6;
            var hourDiv = $('#' + hourDivID);
            hourDiv.css('background-color', dayColor);
            var hourDivIDText = hourDiv.text();
            var stopIndex = hourDivIDText.indexOf(':00');
            hourDivIDText = hourDivIDText.substr(0, stopIndex + 3);
            var hourData = Math.round(chosenDayData[i][Object.keys(chosenDayData[i])[0]] / 60);
            hourDivIDText += " | " + hourData;
            if (hourData > 1) {
                hourDivIDText += " minutes";
            }
            else {
                hourDivIDText += " minute";
            }
            hourDiv.text(hourDivIDText);
            for (var j = 10; j < 60; j += 10) {
                var dataIndex = i + j / 10;
                var subDiv = $('#' + hourDivID + '.ui-accordion-content .' + j);
                var subDivText = subDiv.text();
                var subDivStopIndex = subDivText.indexOf(0);
                subDivText = subDivText.substr(0, subDivStopIndex + 1);
                var tenMinuteData = Math.round(chosenDayData[dataIndex][Object.keys(chosenDayData[dataIndex])[0]] / 60);
                subDivText += " | " + tenMinuteData;
                if (tenMinuteData > 1) {
                    subDivText += " minutes";
                }
                else {
                    subDivText += " minute";
                }
                subDiv.text(subDivText);
            }
        }
    };
    // Create Hour Divs and Panel Divs for accordion
    self.makeHourDivs = function () {
        for (var i = 0; i < 24; i++) {
            var hour = $('<div>', {id: i}).text(i + ':00 ').addClass('hours');
            // $('div.hourGrid2').append(hour);

            var panel = $('<div>', {id: i, class: 'panel'});
            $('.hourGrid2').append(hour, panel);
        }
    };

    // Creates 10 minute increment div' within panel div - required for accordion
    self.create10min = function () {
        for (var j = 10; j < 60; j += 10) {
            var timeIncrement = $('<div>', {class: j}).text(":"+j);
            $('.panel').append(timeIncrement);
        }
    };

    self.appendAccordion = function () {
        $('#accordion.hourGrid2').accordion();
    };


// Draw Graph

    self.createGraph = function (DBresponse) {
        //remove previous graph
        $('#graph').empty();

        var DBdata = DBresponse.data.data;
        console.log(DBdata);

        //populatedData.done(function(){
        //use data from DB to create array
        var total_data = [];

        for (var entry in DBdata[0]) {
            for (var info in DBdata[0][entry]) {
                //check to see if any data is undefined
                try {
                    if (DBdata[6][entry][info] === undefined) {
                        throw 'sat undefined'
                    }
                    data_set = {
                        hour: info,
                        sunday: (DBdata[0][entry][info] / 60).toFixed(2),
                        monday: (DBdata[1][entry][info] / 60).toFixed(2),
                        tuesday: (DBdata[2][entry][info] / 60).toFixed(2),
                        wednesday: (DBdata[3][entry][info] / 60).toFixed(2),
                        thursday: (DBdata[4][entry][info] / 60).toFixed(2),
                        friday: (DBdata[5][entry][info] / 60).toFixed(2),
                        saturday: (DBdata[6][entry][info] / 60).toFixed(2)
                    };
                }
                catch (error) {
                    data_set = {
                        hour: info,
                        sunday: (DBdata[0][entry][info] / 60).toFixed(2),
                        monday: (DBdata[1][entry][info] / 60).toFixed(2),
                        tuesday: (DBdata[2][entry][info] / 60).toFixed(2),
                        wednesday: (DBdata[3][entry][info] / 60).toFixed(2),
                        thursday: (DBdata[4][entry][info] / 60).toFixed(2),
                        friday: (DBdata[5][entry][info] / 60).toFixed(2)
                    };
                }

                total_data.push(data_set);
            }
        }

        //pass array total_data to Morris for graph creation
        new Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'graph',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            resize: true,

            parseTime: false,

            data: total_data,
            lineColors: ['rgba(0,128,255,1)', 'rgba(0, 51, 102, 1)', 'rgba(0, 204, 204, 1)', 'rgba(255, 0, 0, 1)', 'rgba(0, 204, 0, 1)', 'rgba(204, 0, 204, 1)', 'rgba(255, 128, 0, 1)'],

            // The name of the data record attribute that contains x-values.
            xkey: 'hour',
            // A list of names of data record attributes that contain y-values.
            ykeys: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
        });
    };
// Inputs and Button
    self.applyChangeHandler = function () {
        $('select').change(function () {
            var origin = $('.originInput').val();
            var destination = $('.destinationInput').val();
            var day = $('.day').val();
            if (origin != 'unselected' && destination != 'unselected' && day != 'unselected') {
                self.getDirections();
                self.calculationCall.httpCall('getCalc');
            }
        });
    };
    self.getDirections = function () {
        var originID = $('.originInput').find(":selected").attr('id');
        var originLat = latLongs[originID].lat;
        var originLng = latLongs[originID].lng;
        var destinationID = $('.destinationInput').find(":selected").attr('id');
        var destinationLat = latLongs[destinationID].lat;
        var destinationLng = latLongs[destinationID].lng;
        origin = originLat+", "+originLng;
        destination = destinationLat+", "+destinationLng;
        // origin = $('.originInput').find(":selected").attr('lat') + ", " + $('.originInput').find(":selected").attr('long');
        // console.log('origin : ', origin);
        // destination = $('.destinationInput').find(":selected").attr('lat') + ", " + $('.destinationInput').find(":selected").attr('long');
        // console.log('destination : ', destination);
        self.displayDirections();
    };

// Google Directions Service Route
    self.displayDirections = function () {
        var directionsService = new google.maps.DirectionsService;

        directionsService.route({
            origin: origin,
            destination: destination,
            provideRouteAlternatives: false,
            travelMode: 'DRIVING',
            drivingOptions: {
                departureTime: new Date(Date.now()),
                trafficModel: 'bestguess'
            }

        }, function (response, status) {
            if (status === 'OK') {

                for (var i = 0, len = response.routes.length; i < len; i++) {
                    var directionsDisplay = new google.maps.DirectionsRenderer({
                        map: map,
                        directions: response,
                        routeIndex: i,
                        draggable: true,
                        // polylineOptions: {
                        //     strokeColor: 'red'
                        // }
                    });
                }

            } else {
                window.alert('Directions request failed due to ' + status);
            }
            console.log('response : ', response);
            console.log('response.routes.. is : ', response.routes[0].legs[0].duration.text);
            durationText = response.routes[0].legs[0].duration.text;
            console.log('directionsDisplay is: ', directionsDisplay);
            directionsDisplayed = true;
        });

        console.log(directionsService);
    };

// Initial Map on load
    var map;
    self.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: {lat: 33.4288, lng: -117.612},

            styles: self.styles
        });

        var lfz = {lat: 33.636193, lng: -117.739393};
        // var marker = new google.maps.Marker({
        //     position: lfz,
        //     map: map,
        //     title: 'Learning Fuze',
        //     icon: 'images/mark.png'
        // });


    };
    self.addMarkers = function() {
        // Markers - testing if I can add clickable markers as inputs
        for (var index in latLongs) {
            var markerObj = {};
            var position = {lat: parseFloat(latLongs[index].lat), lng: parseFloat(latLongs[index].lng)};
            console.log(position);
            markerObj.marker = new google.maps.Marker({
                position: position,
                map: map,
                title: index,
                icon: 'images/mark.png'
            });
            markerObj.infoWindow = new google.maps.InfoWindow({
                content: markerObj.marker.title
            });

            self.markers.push(markerObj);
            console.log('markers inner: ', self.markers);
        }
        console.log('markers: ', self.markers);
       self.markers.forEach(function(value){
            var markObj = value;
            console.log('markObj: ',markObj);
            markObj.marker.addListener('click', function () {
                if (!self.originClicked){
                    origin = this.getPosition();
                    console.log('origin after marker click: ', origin);
                    self.originClicked = true;
                }
                else {
                    destination = this.getPosition();
                    if (origin != destination){
                        self.displayDirections();
                        self.originClicked = false;
                    }
                }
            });
            markObj.marker.addListener('mouseover', function () {
                markObj.infoWindow.open(map, this);
            });
            markObj.marker.addListener('mouseout', function(){
                    markObj.infoWindow.close();
            })

        });
    };

// // Adds the traffic layer
//     var trafficLayer = new google.maps.TrafficLayer();
//     console.log(trafficLayer);
//     trafficLayer.setMap(map);
//
// Origins and Destinations
//
// var onRamps = [
//     {
//         position: new google.maps.LatLng(33.636193, -117.739393),
//         type: 'info'
//     }
// ];
//
// var offRamps = [
//     {
//         position: new google.maps.LatLng(33.636193, -117.739393),
//         type: 'info'
//     }
// ];


// Defines map style - set in the initMap
    self.styles =

        [{"featureType": "water", "stylers": [{"color": "#19a0d8"}]}, {
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#ffffff"}, {"weight": 6}]
        }, {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#e85113"}]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#efe9e4"}, {"lightness": -40}]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#efe9e4"}, {"lightness": -20}]
        }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{"lightness": 100}]
        }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{"lightness": -100}]
        }, {"featureType": "road.highway", "elementType": "labels.icon"}, {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "landscape",
            "stylers": [{"lightness": 20}, {"color": "#efe9e4"}]
        }, {"featureType": "landscape.man_made", "stylers": [{"visibility": "off"}]}, {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{"lightness": 100}]
        }, {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"lightness": -100}]
        }, {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{"hue": "#11ff00"}]
        }, {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [{"lightness": 100}]
        }, {
            "featureType": "poi",
            "elementType": "labels.icon",
            "stylers": [{"hue": "#4cff00"}, {"saturation": 58}]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{"visibility": "on"}, {"color": "#f0e4d3"}]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#efe9e4"}, {"lightness": -25}]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#efe9e4"}, {"lightness": -10}]
        }, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "simplified"}]}]

    self.makeHourDivs();
    self.create10min();
    self.appendAccordion();
    self.applyChangeHandler();
    self.initialhttpCall.httpCall('select');

});