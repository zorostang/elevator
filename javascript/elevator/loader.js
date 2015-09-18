requirejs.config({
    // Use this file's path as the baseURL.

    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        lib: '../lib',
        jquery: [ '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min', 
                  '../lib/jquery-1.10.2' ]
    }
});


require([ 'jquery', 'operator' ], function($, ElevatorOperator) {
    elevator = window.elevator || {};
    elevator.operator = new ElevatorOperator(1, false, 10);

    var logDiv = $('#elevator-log');
    if(logDiv.length <= 0) {
	   logDiv = $('<div>', {
	    id: 'elevator-log'
	   }).appendTo($('body'));
    }

    // Log the elevator state every 2 seconds.
    var STEP_INTERVAL = 2000;

    var executeElevatorStep = function() {
	elevator.operator.step();
	var log = 'Current Floor: ' + elevator.operator.getCurrentFloor() + ', Doors Open: ' + elevator.operator.areDoorsOpen(); 
	$('<div>', {
	    class: 'state',
	    text: log
	}).prependTo(logDiv);
	setTimeout(arguments.callee, STEP_INTERVAL);
    };

    setTimeout(executeElevatorStep, STEP_INTERVAL);

    requestDropoff = function() {
	var dropoffFloorInput = $('input[name=dropoff-floorNumber]');
	var pickupFloorInput = $('input[name=pickup-floorNumber]');

    if(dropoffFloorInput.val() === "") {
	    alert("please enter a valid dropoff floor.");
        return;
	}
    if(pickupFloorInput.val() === "") {
        alert("please enter a valid pickup floor.");
        return;
    }

	elevator.operator.requestDropoff(parseInt(pickupFloorInput.val(),10),parseInt(dropoffFloorInput.val(),10));
    };
});
