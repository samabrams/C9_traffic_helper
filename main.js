// Create Hour Divs
function makeHourDivs() {
    for (var i = 0; i < 24; i++) {
        var hour = $('<div>', {id: i + 1}).text(i + 1 + ':00').addClass('hours');
        $('div.hourGrid2').append(hour);
    }
}

// Inputs


// Directions Test
var map;
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    var styles =
    //
    // [{"featureType": "water", "stylers": [{"color": "#19a0d8"}]}, {
    //     "featureType": "administrative",
    //     "elementType": "labels.text.stroke",
    //     "stylers": [{"color": "#ffffff"}, {"weight": 6}]
    // }, {
    //     "featureType": "administrative",
    //     "elementType": "labels.text.fill",
    //     "stylers": [{"color": "#e85113"}]
    // }, {
    //     "featureType": "road.highway",
    //     "elementType": "geometry.stroke",
    //     "stylers": [{"color": "#efe9e4"}, {"lightness": -40}]
    // }, {
    //     "featureType": "road.arterial",
    //     "elementType": "geometry.stroke",
    //     "stylers": [{"color": "#efe9e4"}, {"lightness": -20}]
    // }, {
    //     "featureType": "road",
    //     "elementType": "labels.text.stroke",
    //     "stylers": [{"lightness": 100}]
    // }, {
    //     "featureType": "road",
    //     "elementType": "labels.text.fill",
    //     "stylers": [{"lightness": -100}]
    // }, {"featureType": "road.highway", "elementType": "labels.icon"}, {
    //     "featureType": "landscape",
    //     "elementType": "labels",
    //     "stylers": [{"visibility": "off"}]
    // }, {
    //     "featureType": "landscape",
    //     "stylers": [{"lightness": 20}, {"color": "#efe9e4"}]
    // }, {"featureType": "landscape.man_made", "stylers": [{"visibility": "off"}]}, {
    //     "featureType": "water",
    //     "elementType": "labels.text.stroke",
    //     "stylers": [{"lightness": 100}]
    // }, {
    //     "featureType": "water",
    //     "elementType": "labels.text.fill",
    //     "stylers": [{"lightness": -100}]
    // }, {
    //     "featureType": "poi",
    //     "elementType": "labels.text.fill",
    //     "stylers": [{"hue": "#11ff00"}]
    // }, {
    //     "featureType": "poi",
    //     "elementType": "labels.text.stroke",
    //     "stylers": [{"lightness": 100}]
    // }, {
    //     "featureType": "poi",
    //     "elementType": "labels.icon",
    //     "stylers": [{"hue": "#4cff00"}, {"saturation": 58}]
    // }, {
    //     "featureType": "poi",
    //     "elementType": "geometry",
    //     "stylers": [{"visibility": "on"}, {"color": "#f0e4d3"}]
    // }, {
    //     "featureType": "road.highway",
    //     "elementType": "geometry.fill",
    //     "stylers": [{"color": "#efe9e4"}, {"lightness": -25}]
    // }, {
    //     "featureType": "road.arterial",
    //     "elementType": "geometry.fill",
    //     "stylers": [{"color": "#efe9e4"}, {"lightness": -10}]
    // }, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "simplified"}]}]

        [{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{"saturation": 36}, {"color": "#000000"}, {"lightness": 40}]
    }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16}]
    }, {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#000000"}, {"lightness": 20}]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#000000"}, {"lightness": 17}, {"weight": 1.2}]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{"color": "#000000"}, {"lightness": 20}]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{"color": "#000000"}, {"lightness": 21}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#000000"}, {"lightness": 17}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#000000"}, {"lightness": 29}, {"weight": 0.2}]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{"color": "#000000"}, {"lightness": 18}]
    }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{"color": "#000000"}, {"lightness": 16}]
    }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{"color": "#000000"}, {"lightness": 19}]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#000000"}, {"lightness": 17}]
    }]


    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: {lat: 33.636193, lng: -117.739393},

        styles: styles,
    });

    var lfz = {lat: 33.636193, lng: -117.739393};
    var marker = new google.maps.Marker({
        position: lfz,
        map: map,
        title: 'Learning Fuze'
    });

    var infoWindow = new google.maps.InfoWindow({
        content: 'Dan is the man!'
    });
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });

}
// var trafficLayer = new google.maps.TrafficLayer();
// console.log(trafficLayer);
// trafficLayer.setMap(map);
// directionsDisplay.setMap(map);
//
//
// directionsService.route({
//     origin: 'Brea',
//     destination: 'Irvine',
//
//     provideRouteAlternatives: true,
//     travelMode: 'DRIVING',
//     drivingOptions: {
//         departureTime: new Date(Date.now()),
//         trafficModel: 'bestguess'
//     }
//
// }, function (response, status) {
//     if (status === 'OK') {
//         directionsDisplay.setDirections(response);
//     } else {
//         window.alert('Directions request failed due to ' + status);
//     }
//     console.log('response : ', response);
//     console.log('directionsDisplay.setDirections is: ', directionsDisplay.setDirections);
// });
//
// console.log(directionsService);


// // Add call to button
// function getDirections() {

// }

// Initialize
$(document).ready(function () {
    makeHourDivs();

});