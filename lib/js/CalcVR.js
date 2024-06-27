import LatLon from 'https://cdn.jsdelivr.net/npm/geodesy@2.2.1/latlon-spherical.min.js';

export class CalcVR {
    constructor() {
        this.distance = 0;
        this.bearing = 0;
        this.newPosition = [0, 0];
        this.currentPosition = [0, 0];
        this.objectSize = '0, 0, 0';
        this.newDistance = 0;
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
            this.objectSize = '100 100 100';
            this.newDistance = 800;
        }else if(distance > 1000 && distance <= 8000) {
            this.objectSize = '90 90 90';
            this.newDistance = 800 + (distance/1000);
        }else if(distance > 8000 && distance <= 16000) {
            this.objectSize = '70 70 70';
            this.newDistance = 800 + (distance/1000);
        }else if(distance > 16000 && distance <= 20000) {
            this.objectSize = '60 60 60';
            this.newDistance = 800 + (distance/1000);
        }else if(distance > 20000&& distance<4000) {
            this.objectSize = '50 50 50';
            this.newDistance = 800 + (distance/1000);
        }else if(distance > 40000) {
            this.objectSize = '40 40 40';
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
            name: '倉岡西品川家',
            location: {
                lat: 35.61188137336042,
                lng: 139.7255540344704,
            }
        },
        {
            name: 'マギ 下北沢開発',
            location: {
                lat: 35.66521752219795,
                lng: 139.66498751546231,
            }
        },
        {
            name: 'マギ 猫米',
            location: {
                lat: 35.66742427555168,
                lng: 139.6659865879075,
            }
        },
        {
            name: 'マギ 本社（浅井さんセカンドハウス）',
            location: {
                lat: 35.04369612042651,
                lng: 139.8332695477962,
            }
        },
        {
            name: '産業遺産情報センター',
            location: {
                lat: 35.69975642068451,
                lng: 139.71542093037817,
            }
        },
        {
            name: '産業遺産国民会議 中野事務所',
            location: {
                lat: 35.706544972205975,
                lng: 139.66935272322877,
            }
        },
        {
            name: '大井町駅 東口',
            location: {
                lat: 35.60750055074128,
                lng: 139.73512738943293,
            }
        },
        {
            name: '測定観測用pin',
            location: {
                lat: 35.53326581423899,
                lng: 139.65637783148912,
            }
        },
    ];
}

function renderPlaces(places, pos) {
    let scene = document.querySelector('a-scene');
    var crd = pos.coords;
    console.log(crd);
    let cal = new CalcVR();
  
    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;
        let name = place.name;
        console.log(crd.latitude);
        console.log(crd.longitude);
        cal.calcDist([crd.latitude, crd.longitude], [latitude, longitude]);
       const dis = cal.distance;
	console.log(`heading: ${ crd.heading }`);
   
        cal.calcNewPosition(cal.currentPosition, cal.bearing, cal.newDistance);

            cal.calcSizeDist(cal.distance);

        let model = document.createElement('a-entity');
        model.setAttribute('gltf-model',"lib/obj/pin.glb");
        model.setAttribute('gps-entity-place', `latitude: ${cal.newPosition[0]}; longitude: ${cal.newPosition[1]};`);
        model.setAttribute('look-at', '[gps-camera]');
        model.setAttribute('scale', `${cal.objectSize}`);
        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });
        let debug = document.getElementById("debug");
        let oldscale =cal.objectSize;
        let nav = document.getElementById("nav");
        var locationName = document.getElementById("locationName");
        model.addEventListener('mouseenter', function () {
            var distance = document.getElementById("distance");
            nav.setAttribute('class','slideUp');
            locationName.textContent = name;
            if(dis>1000){
               var km =dis;
               km=km/1000;
                distance.textContent ="約"+km.toFixed(1)+"Km";
            }else{
                distance.textContent ="約"+dis.toFixed(1)+"m";
            }
            cal.objectSize = '50 50 50';
            debug.textContent =name;
            model.setAttribute('scale', `${cal.objectSize}`);
        });
        // カーソルが離れたら元にもどす
        model.addEventListener('mouseleave', function () {
            nav.setAttribute('class','slideDown');
            model.setAttribute('scale', `${oldscale}`);
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