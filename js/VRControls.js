/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 */

THREE.VRControls = function ( object, onError, normalInput ) {

	var scope = this;

	var vrInputs = [];

	var normalModeInput = normalInput;

	function filterInvalidDevices( devices ) {

	  // Exclude Cardboard position sensor if Oculus exists.

	  var oculusDevices = devices.filter(function (device) {

	    return device.deviceName.toLowerCase().indexOf('oculus') !== -1;

	  });

	  if (oculusDevices.length >= 1) {

	    return devices.filter(function (device) {

	      return device.deviceName.toLowerCase().indexOf('cardboard') === -1;

	    });

	  } else {

	    return devices;

	  }

	}

	function gotVRDevices( devices ) {

		devices = filterInvalidDevices( devices );

		for ( var i = 0; i < devices.length; i ++ ) {

		  if (devices[i] instanceof PositionSensorVRDevice ||
        (window.HMDPositionSensorVRDevice && devices[i] instanceof HMDPositionSensorVRDevice)) {

				vrInputs.push( devices[ i ] );

			}

		}

		if ( onError ) onError( 'HMD not available' );

	}

	if ( navigator.getVRDevices ) {

		navigator.getVRDevices().then( gotVRDevices );

	}

	// the Rift SDK returns the position in meters
	// this scale factor allows the user to define how meters
	// are converted to scene units.

	this.scale = 1;

	this.update = function (isVRMode) {
	  if (!isVRMode && normalModeInput) {
	    var state = normalModeInput.getState();
	    object.quaternion.copy(state.orientation);
	  } else {
	    for (var i = 0; i < vrInputs.length; i++) {

	      var vrInput = vrInputs[i];

	      var state = vrInput.getState();

	      if (state.orientation !== null) {

	        object.quaternion.copy(state.orientation);

	      }

	      if (state.position !== null) {

	        object.position.copy(state.position).multiplyScalar(scope.scale);

	      }

	    }
	  }
	};

	this.resetSensor = function () {

		for ( var i = 0; i < vrInputs.length; i ++ ) {

			var vrInput = vrInputs[ i ];

			if ( vrInput.resetSensor !== undefined ) {

				vrInput.resetSensor();

			} else if ( vrInput.zeroSensor !== undefined ) {

				vrInput.zeroSensor();

			}

		}

	};

	this.zeroSensor = function () {

		THREE.warn( 'THREE.VRControls: .zeroSensor() is now .resetSensor().' );
		this.resetSensor();

	};

};
