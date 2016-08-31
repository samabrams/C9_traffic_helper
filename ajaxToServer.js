function ajaxObject(callBack){
    this.callBack = callBack.bind(this);
    var self = this;

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
                self.callBack(success);
            }
        });
    }
}
