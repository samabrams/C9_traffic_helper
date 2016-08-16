// Create Hour Divs
function makeHourDivs() {
    for (var i = 0; i < 24; i++) {
        var hour = $('<div>', {id: i + 1}).text(i + 1 + ':00').addClass('hours');
        $('div.hourGrid2').append(hour);
    }
}

// Add call to button
// function addCallToBtn() {
//     $('.ajaxCallBtn').click(mapCall);
// }

// Initialize
$(document).ready(function () {
    makeHourDivs();
    // addCallToBtn();

});

// LFZ Address - 9080 Irvine Center Dr. Irvine


function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 34.04924594193164, lng: -118.24104309082031}
    });

    var trafficLayer = new google.maps.TrafficLayer();
    console.log(trafficLayer);
    trafficLayer.setMap(map);
}
