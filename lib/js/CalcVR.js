import LatLon from 'https://cdn.jsdelivr.net/npm/geodesy@2.2.1/latlon-spherical.min.js';

export class CalcVR {
    constructor() {
        this.distance = 0;
        this.bearing = 0;
        this.newPosition = [0, 0];
        this.currentPosition = [0, 0];
        this.objectSize = '0, 0, 0';
        this.newDistance = 800;
    }
    
    calcDist(currentPosiArg, targetPosition) {
        const current = new LatLon(currentPosiArg[0], currentPosiArg[1]);
        const target = new LatLon(targetPosition[0], targetPosition[1]);
        this.distance = current.distanceTo(target);
        this.bearing = current.finalBearingTo(target)
        this.currentPosition = currentPosiArg;
    }
    calcNewPosition(currentPosition, bearing, newTargetToDistance) {
        const current = new LatLon(currentPosition[0], currentPosition[1]);
        const calculatedlced = current.destinationPoint(newTargetToDistance, bearing);
        this.newPosition = [calculatedlced.latitude, calculatedlced.longitude];
    }
    calcSizeDist(distance) {
        if(distance <= 1000 && distance >= 500){
            this.objectSize = '45 45 45';
            this.newDistance = 800;
        }else if(distance > 1000 && distance <= 8000) {
            this.objectSize = '40 40 40';
            this.newDistance = 800 + (distance/1000);
        }else if(distance > 8000 && distance <= 16000) {
            this.objectSize = '38 38 38';
            this.newDistance = 800 + (distance/1000);
        }else if(distance > 16000 && distance <= 20000) {
            this.objectSize = '35 35 35';
            this.newDistance = 800 + (distance/1000);
        }else if(distance > 20000) {
            this.objectSize = '30 30 30';
            this.newDistance = 800 + (distance/1000);
        }
    }

}
window.onload = () => {
    navigator.geolocation.getCurrentPosition(success, error, options);
};

function staticLoadPlaces() {
    return [
        {
            name: 'Time Desk',
            location: {
                lat: 35.53182711560345,
                lng: 139.65855068889573,
            }
        },
        {
            name: 'Time Desk2',
            location: {
                lat: 35.53573721220074,
                lng: 139.65488102599372,
            }
        },

    ];
}

function renderPlaces(places, pos) {
    let scene = document.querySelector('a-scene');
    var crd = pos.coords;
    let cal = new CalcVR();
    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;
        let name = place.name;
        let modelName = place.modelName;
        cal.calcDist([crd.latitude, crd.longitude], [latitude, longitude]);
	console.log(`heading: ${ crd.heading }`);
        cal.calcNewPosition(cal.currentPosition, cal.bearing, cal.newDistance);
        cal.calcSizeDist(cal.distance);
        let model = document.createElement('a-entity');
        model.setAttribute('gltf-model',"lib/obj/pin.glb");
        model.setAttribute('gps-entity-place', `latitude: ${cal.newPosition[0]}; longitude: ${cal.newPosition[1]};`);
        model.setAttribute('scale', `${cal.objectSize}`);
        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });
        var debug = document.getElementById("debug");
        model.addEventListener('mouseenter', function () {
        
  
            cal.objectSize = '50 50 50';
          
            debug.textContent ="hit";
            model.setAttribute('scale', `${cal.objectSize}`);
        });
      
        // カーソルが離れたら元にもどす
        model.addEventListener('mouseleave', function () {
            model.setAttribute('scale', `${cal.objectSize}`);
          debug.textContent ="not";
        });
        scene.appendChild(model);
    });
}
var options = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: 0
  };
  
function success(pos) {
    let places = staticLoadPlaces();
    renderPlaces(places, pos);
}
  
function error(err) {
   console.warn(`ERROR(${err.code}): ${err.message}`);
   alert('Unable to capture current location.');
 }