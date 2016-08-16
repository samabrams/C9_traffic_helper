// Create Hour Divs
function makeHourDivs() {
    for (var i = 0; i < 24; i++) {
        var hour = $('<div>', {id: i + 1}).text(i + 1 + ':00').addClass('hours');
        $('div.hourGrid2').append(hour);
    }
}

// Inputs


// Static Traffic Map
// function initMap() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 13,
//         center: {lat: 33.636193, lng: -117.739393}
//     });
//
//     var trafficLayer = new google.maps.TrafficLayer();
//     console.log(trafficLayer);
//     trafficLayer.setMap(map);
// }



// Directions Test
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 33.636193, lng: -117.739393}
    });

    var trafficLayer = new google.maps.TrafficLayer();
    console.log(trafficLayer);
    trafficLayer.setMap(map);
    directionsDisplay.setMap(map);


    directionsService.route({
        origin: 'Brea',
        destination: 'Irvine',

        provideRouteAlternatives: true,
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: 'bestguess'
        }

    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
        console.log('response : ', response);
        console.log('directionsDisplay.setDirections is: ', directionsDisplay.setDirections);
    });

    console.log(directionsService);
}



// // Add call to button
// function getDirections() {

// }

// Initialize
$(document).ready(function () {
    makeHourDivs();

});