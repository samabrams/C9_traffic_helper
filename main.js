var origin = '';
var destination = '';
var durationText = '';
var onRampNames = [];
var offRampNames = [];


var app = angular.module('traffic', []);
app.controller('trafficController', function () {
    this.onRamps = onRampNames;
    this.offRamps = offRampNames;

});
// Create Hour Divs
function makeHourDivs() {
    for (var i = 0; i < 24; i++) {
        var hour = $('<div>', {id: i + 1}).text(i + 1 + ':00').addClass('hours');
        $('div.hourGrid2').append(hour);
    }
}

// Inputs and Button
function applyClickHandler(){
    $('select').change(function(){
        var origin = $('.originInput').val();
        var destination = $('.destinationInput').val();
        var day = $('.day').val();
        if (origin != 'unselected' && destination != 'unselected' && day != 'unselected') getDirections();
    });
}
function getDirections(){
    origin = $('.originInput').val() + " I5 orange county";
    console.log('origin : ', origin);
    destination = $('.destinationInput').val()  + " I5 orange county";
    console.log('destination : ', destination);
    displayDirections();
}

// Google Directions Service Route
function displayDirections(){
    var directionsService = new google.maps.DirectionsService;

    directionsService.route({
        origin: origin,
        destination: destination,

        provideRouteAlternatives: true,
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
        console.log('response.routes.. is : ',response.routes[0].legs[0].duration.text);
        durationText = response.routes[0].legs[0].duration.text;
        $('#7').append('  Duration : ' + durationText);
        $('#7').css('background-color', 'red');
        console.log('directionsDisplay is: ', directionsDisplay);
        directionsDisplayed = true;
    });

    console.log(directionsService);
}

// Initial Map on load
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: {lat: 33.636193, lng: -117.739393},

        styles: styles,
    });

    var lfz = {lat: 33.636193, lng: -117.739393};
    // var marker = new google.maps.Marker({
    //     position: lfz,
    //     map: map,
    //     title: 'Learning Fuze',
    //     icon: 'images/mark.png'
    // });



    // Markers - testing if I can add clickable markers as inputs
    var marker = new google.maps.Marker({
        position: lfz,
        map: map,
        title: 'Set Origin',
        icon: 'images/mark.png'
    });
    var infoWindow = new google.maps.InfoWindow({
        content: 'Dan is the man!'

    });
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });

    marker.addListener('click', function() {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
        console.log('after clicking marker, the marker.getPosition is : ', marker.getPosition());
    });
}

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
var styles =

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


// Initialize
$(document).ready(function () {
    makeHourDivs();
    applyClickHandler();

    var initialAjaxCall = new ajaxObject(function(success){
        var onRampInfo = success.data.onRamp;
        var offRampInfo = success.data.offRamp;
        for (var i = 0; i < onRampInfo.length; i++){
            onRampNames.push(onRampInfo[i].name);
        }
        for (var i = 0; i < offRampInfo.length; i++){
            offRampNames.push(offRampInfo[i].name);
        }
    });
    initialAjaxCall.ajaxCall('select');

});