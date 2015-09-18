define([ 'jquery' ], function($) {
    /**
     * This an extremely simple interface for an Elevator Operator.
     */
    var ElevatorOperator = function() {

        var klass = function() {
                this.init.apply(this, arguments);	    
    	};

    	klass.fn = klass.prototype;
            klass.fn.klass = klass;

            /**
             * Initializes this ElevatorOperator instance, setting the starting 
    	   * floor for the elevator, the initial state of the doors, ant the 
             * top floor in the building.
             */
    	klass.fn.init = function(startingFloor, doorsOpen, topFloor) {
    	    // TODO: Implement Me.
            this.startingFloor = startingFloor;
            this.doorsOpen = doorsOpen;
            this.topFloor = topFloor;
            this.requestQueue = [];
    	};

            /**
             * Returns the current location (floor number) of the elevator.
             */
    	klass.fn.getCurrentFloor = function() {
            this.currentFloor = this.currentFloor || this.startingFloor;
            return this.currentFloor;
    	};

            /**
             * Returns a boolean indication of whether or not the elevator 
             * doors are currently open.
             */
        klass.fn.areDoorsOpen = function() {
            // TODO: Implement Me.
            return this.doorsOpen;
        };
            /**
             * Evaluates and returns the destination (floor number) of the elevator.
             */
        klass.fn.getDestinationFloor = function(floor) {
            
            var currentRequest = this.requestQueue[0] || null;

            if (currentRequest !== null) {
                if (this.moveToDropoffFloor || this.arrivedAtDropoffFloor)
                    this.destinationFloor = currentRequest.dropoffFloor;
                else {
                    this.destinationFloor = currentRequest.pickupFloor;
                    this.moveToPickupFloor = true;
                }
            } else {
                this.destinationFloor = this.startingFloor;
            }
            return this.destinationFloor;
        };

        klass.fn.elevatorChoice = function() {
            var choice;
            var destinationFloor = this.getDestinationFloor();
            var currentFloor = this.getCurrentFloor();
            
            //if we have nowhere to go then do nothing
            if (!this.moveToPickupFloor && !this.moveToDropoffFloor && 
                !this.arrivedAtDropoffFloor) {
                choice = 4;
                console.log('waiting...');
            }
            //if we're at the destination then determine what to do with the doors
            else if (currentFloor === destinationFloor) {
                
                if (this.areDoorsOpen() && this.arrivedAtDropoffFloor) { 
                    //customer has been dropped off. so process next request.
                    this.arrivedAtDropoffFloor = false;
                    choice = 3; //close doors 
                    this.requestQueue.shift();
                } else if (!this.areDoorsOpen() && this.moveToDropoffFloor) {
                    //elevator has arrived at dropoff floor
                    this.arrivedAtDropoffFloor = true;
                    this.moveToDropoffFloor = false;
                    choice = 2; //open doors
                }
                else if (this.areDoorsOpen() && this.moveToPickupFloor) {
                    //customer enters elevator. close doors and move to dropoff
                    this.moveToDropoffFloor = true;
                    this.moveToPickupFloor = false;
                    choice = 3; //close doors
                } else if (!this.areDoorsOpen() && this.moveToPickupFloor) {
                    //elevator has arrived at pickup floor
                    choice = 2; //open doors
                } else {
                    console.log('something unexpected...'); 
                    choice = 3; //keep doors closed;
                }  
            }
            //we need to get moving...
            else {
                //movement logic, applies to both picking up and dropping off
                if (currentFloor < destinationFloor)
                    choice = 0; //moves up
                else 
                    choice = 1; //moves down
            }
            
            return choice;
        };
            /**
             * Takes one of the following actions, updating the state of 
             * the elevator:
             *  - Moves up
             *  - Moves down
             *  - Opens doors
             *  - Closes doors
             *  - Do nothing
             */
    	klass.fn.step = function() {
            console.dir(this.requestQueue);
            
            var choice = this.elevatorChoice();

            switch(choice) {
            case 0:
                // Move Up
                if(this.topFloor !== null && this.currentFloor < this.topFloor) {
                    this.currentFloor++;
                }
                break;
            case 1:
                // Move Down
                if(this.currentFloor > 0) {
                    this.currentFloor--;
                }
                break;
            case 2:
                // Open Doors
                this.doorsOpen = true;
                break;
            case 3:
                // Close Doors
                this.doorsOpen = false;
                break;
            case 4:
                // Do Nothing
                break;
           }
        };

            /**
             * Indicates that a customer is waiting on the specified floor 
             * to be picked up.
             * 
             * TODO: Add support for indicating the direction of travel (i.e. up or down).
             */
    	klass.fn.requestPickup = function(floor) {
            //deprecated. see requestDropoff below
            return console.log("Deprecated in favor of specifing pickup request & dropoff request in one call");
    	};

            /**
             * Indicates that a customer is on a specified pickup floor 
             * and has requested to be dropped off at the specified dropoff floor.
             */
    	klass.fn.requestDropoff = function(pickupFloor, dropoffFloor) {
            // this.moveToPickupFloor = true;
            // this.pickupFloor = pickupFloor;
            // this.dropoffFloor = dropoffFloor;
            this.requestQueue.push({
                pickupFloor: pickupFloor,
                dropoffFloor: dropoffFloor
            });
    	};

    	return klass;
    }();

    return ElevatorOperator;
});
