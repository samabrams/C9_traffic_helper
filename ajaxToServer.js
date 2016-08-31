function ajaxObject(){

    this.ajaxCall = function(command){
        this.command = command;
        var dataObj = {
            origin: $('.originInput').val(),
            destination: $('.destinationInput').val(),
            date: $('.dateInput').val(),
            command: this.command
        }

        $.ajax({
            url: 'traffic_server.php',
            method: 'post',
            dataType: 'json',
            data: dataObj,
            success: function(success){
                console.log(success);
            }
        });
    }
}
