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
        this.bearing = current.finalBearingTo(target);
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
let watchId;
const models = [];
window.onload = () => {
     navigator.geolocation.getCurrentPosition(success, error, options);
    watchId = navigator.geolocation.watchPosition(updatesuccess, error, options);
};   

function staticLoadPlaces() {
    let req = new XMLHttpRequest();
    let data;
    req.onreadystatechange = function() {
        // サーバーからのレスポンスが正常＆通信が正常に終了したとき                
        if(req.readyState == 4 && req.status == 200) {
            // 取得したJSONファイルの中身を変数へ格納
             data = JSON.parse(req.responseText);

        }
    };
    //HTTPメソッドとアクセスするサーバーのURLを指定
    req.open("GET", "./lib/json/Location.json", false);
    //実際にサーバーへリクエストを送信
    req.send(null);
    return data;
}
var gpsdistance = [];
let latitude;
let longitude;
let cal;
let distance = document.getElementById("distance");
let debugdistance = document.getElementById("debugdistance");
function renderPlaces(places, pos) {
    let scene = document.querySelector('a-scene');
    let nav = document.getElementById("nav");
    let locationName = document.getElementById("locationName");
    let debug = document.getElementById("debug");
   
    var crd = pos.coords;
    var id =0;
     cal = new CalcVR();
    places.forEach((place) => {
         latitude = place.location.lat;
         longitude = place.location.lng;
        let name = place.name;
        //console.log(place.name);
        cal.calcDist([crd.latitude, crd.longitude], [latitude, longitude]);
        const dis = cal.distance;
        gpsdistance.push(cal.distance);
	    //console.log(`heading: ${ crd.heading }`);
        cal.calcNewPosition(cal.currentPosition, cal.bearing, cal.newDistance);
            cal.calcSizeDist(cal.distance);
          
        let model = document.createElement('a-entity');
    
        model.setAttribute('id',id);
        model.setAttribute('look-at', '[gps-camera]');
        model.setAttribute('gltf-model',"lib/obj/pin.glb");
        model.setAttribute( 'do-something-once-loaded' , '' ); 
        model.setAttribute('gps-entity-place', `latitude: ${cal.newPosition[0]}; longitude: ${cal.newPosition[1]};`);
        model.setAttribute('scale', `${cal.objectSize}`);
        id++;
        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
          
        });
        let oldscale =cal.objectSize;
        model.addEventListener('mouseenter', function (event) {
            target = event.target;
            nav.setAttribute('class','slideUp');
            locationName.textContent = name;
            if(dis>1000){
               var km =dis;
               km=km/1000;
                distance.textContent ="約"+km.toFixed(1)+"Km";
            }else{
                distance.textContent ="約"+dis.toFixed(1)+"m";
            }
            cal.objectSize = '120 120 120';
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
        models.push(model);
    });
  
}
var options = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: 0
  };
  let places ; 
function  success(pos) {
    console.log(pos);
     places = staticLoadPlaces();
     console.log(places);
    setTimeout(function() {
        renderPlaces(places, pos);
      }, 1000);
}

function updatesuccess(pos){
    console.log(pos);
    places = staticLoadPlaces();
    if(models.length!== 0){
        updateLoaction(models,places,pos);
    }

}
var target;
function updateLoaction(models,places,pos){
    let index =0;
    cal  = new CalcVR();
    var crd = pos.coords;
    places.forEach((place)=>{
      
        latitude = place.location.lat;
        longitude = place.location.lng;
        cal.calcDist([crd.latitude, crd.longitude], [latitude, longitude]);
        gpsdistance[index] = cal.distance;

         if(models[index] ==target){

            if(gpsdistance[index]>1000){
                gpsdistance[index]=cal.distance/1000;
             
                distance.textContent ="約"+gpsdistance[index].toFixed(1)+"Km";
              }else{
                  distance.textContent ="約"+gpsdistance[index].toFixed(1)+"m";
              }
              debugdistance.textContent = "約"+gpsdistance[index];
         }
         index++;
    });
   
}
  
function error(err) {
   console.warn(`ERROR(${err.code}): ${err.message}`);
   alert('Unable to capture current location.');
 }

