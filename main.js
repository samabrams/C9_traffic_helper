

// Create Hour Divs
function makeHourDivs(){
    for(var i=0; i < 24; i++){
        var hour = $('<div>', {id: i+1}).text(i+1 + ':00').addClass('hours');
        $('div.hourGrid2').append(hour);
    }
}

// Initialize
$(document).ready(makeHourDivs);