var origin = '';
var destination = '';
var durationText = '';
var onRampNames = [];
var offRampNames = [];


var app = angular.module('traffic', []);
app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {"Content-Type": "application/x-www-form-urlencoded"};
});
app.controller('trafficController', function ($scope, $http, $timeout) {
    var self = this;
    self.onRamps = [];
    self.offRamps = [];
    self.httpObject = function (callBack) {
        var httpSelf = this;
        httpSelf.callBack = callBack.bind(httpSelf);


        httpSelf.httpCall = function (command) {
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
                console.log(response);
               httpSelf.callBack(response);
            }, function error(response) {
                console.log('ERROR ERROR ERROR', response);
            });
        }
    };
    self.initialhttpCall = new self.httpObject(function (response) {
        var onRampInfo = response.data.data.onRamp;
        var offRampInfo = response.data.data.offRamp;
        for (var index in onRampInfo){
            self.onRamps.push({name: onRampInfo[index].name, id: onRampInfo[index].ID, lat: onRampInfo[index].lat, long: onRampInfo[index].long});
        }
        for (var index in offRampInfo) {
            self.offRamps.push({name: offRampInfo[index].name, id: offRampInfo[index].ID, lat: offRampInfo[index].lat, long: offRampInfo[index].long});
        }
        self.initMap();
        self.addMarkers();
    });
    self.calculationCall = new self.httpObject(function (response){
        self.createGraph(response);
        console.log('calculationCall', response);
    });
    // Create Hour Divs
    self.makeHourDivs = function() {
        for (var i = 0; i < 24; i++) {
            var hour = $('<div>', {id: i + 1}).text(i + 1 + ':00').addClass('hours');
            $('div.hourGrid2').append(hour);
        }
    };
// Draw Graph

    self.createGraph = function(DBresponse) {
        //remove previous graph
        $('#graph').empty();

        var DBdata = DBresponse.data.data;
        console.log(DBdata);

        //populatedData.done(function(){
        //use data from DB to create array
        var total_data = [];

        for (var entry in DBdata[0]){
            for (var info in DBdata[0][entry]) {
                //check to see if any data is undefined
                //  if it is, set to zero for now

                // if (typeof DBdata[6][entry][info] === undefined)
                // {
                try{
                    if(DBdata[6][entry][info] === undefined)
                    {
                        throw 'sat undefined'
                    }
                    data_set={hour: info, sunday: (DBdata[0][entry][info]/60).toFixed(2),
                        monday: (DBdata[1][entry][info]/60).toFixed(2), tuesday: (DBdata[2][entry][info]/60).toFixed(2),
                        wednesday: (DBdata[3][entry][info]/60).toFixed(2), thursday: (DBdata[4][entry][info]/60).toFixed(2),
                        friday: (DBdata[5][entry][info]/60).toFixed(2), saturday:(DBdata[6][entry][info]/60).toFixed(2)};
                }
                catch(error)
                {
                    data_set={hour: info, sunday: (DBdata[0][entry][info]/60).toFixed(2),
                        monday: (DBdata[1][entry][info]/60).toFixed(2), tuesday: (DBdata[2][entry][info]/60).toFixed(2),
                        wednesday: (DBdata[3][entry][info]/60).toFixed(2), thursday: (DBdata[4][entry][info]/60).toFixed(2),
                        friday: (DBdata[5][entry][info]/60).toFixed(2)};
                }
                //}
                // else
                // {
                //     data_set={hour: info, sunday: DBdata[0][entry][info],
                //         monday: DBdata[1][entry][info], tuesday: DBdata[2][entry][info],
                //         wednesday: DBdata[3][entry][info], thursday: DBdata[4][entry][info],
                //         friday: DBdata[5][entry][info], saturday: DBdata[6][entry][info]};
                // }

                total_data.push(data_set);
            }
        }

        // for (var i in DBdata){
        //     for (var j in DBdata[i]){
        //         console.log(j + ' ' + DBdata[i][j]);
        //     }
        // }


        // for (i = 0; i < 2400; i+=10) {
        //     // time = null;
        //     // time_string = i.toString();
        //     //
        //     // if (time_string.length == 1) {
        //     //     time = "000" + time_string;
        //     // }
        //     // else if (time_string.length == 2) {
        //     //     time = "00" + time_string;
        //     // }
        //     // else if (time_string.length == 3) {
        //     //     time = "0" + time_string;
        //     // }
        //     // else {
        //     //     time = time_string;
        //     // }
        //     data_set={hour: time, sunday: dummyData.sunday[time], monday: dummyData.monday[time],
        //         tuesday: dummyData.tuesday[time], wednesday: dummyData.wednesday[time],
        //         thursday: dummyData.thursday[time],  friday: dummyData.friday[time], saturday: dummyData.saturday[time]};
        //     total_data.push(data_set);
        // }

        //pass array total_data to Morris for graph creation
        new Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'graph',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            resize: true,

            parseTime: false,

            data: total_data,
            lineColors: ['#0ea8e3', '#305066', '#22c3aa', '#db4825', '#c7db4c', '#19a0d8', '#e85113'],

            // The name of the data record attribute that contains x-values.
            xkey: 'hour',
            // A list of names of data record attributes that contain y-values.
            ykeys: ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
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
        origin = $('.originInput').find(":selected").attr('lat')+", "+ $('.originInput').find(":selected").attr('long') ;
        console.log('origin : ', origin);
        destination = $('.destinationInput').find(":selected").attr('lat')+", "+$('.destinationInput').find(":selected").attr('long');
        console.log('destination : ', destination);
        self.displayDirections();
    };

// Google Directions Service Route
   self.displayDirections =  function () {
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
            $('#7').append('  Duration : ' + durationText);
            $('#7').css('background-color', 'red');
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
        var marker = null;
        // Markers - testing if I can add clickable markers as inputs
        for (var i = 0; i < self.onRamps.length; i++) {
            var position = {lat: parseFloat(self.onRamps[i].lat), lng: parseFloat(self.onRamps[i].long)};
            console.log(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: self.onRamps[i].name,
                icon: 'images/mark.png'
            });

            marker.addListener('click', function () {
                map.setZoom(12);
                map.setCenter(this.getPosition());
                console.log('after clicking marker, the marker.getPosition is : ', this.getPosition());
                var infoWindow = new google.maps.InfoWindow({
                    content: this.title
                });
                infoWindow.open(map, this);
            });
            // marker.addListener('mouseover', function () {
            //     var infoWindow = new google.maps.InfoWindow({
            //         content: this.title
            //     });
            //     infoWindow.open(map, this);
            // });
        }
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
    self.applyChangeHandler();
    self.initialhttpCall.httpCall('select');

});