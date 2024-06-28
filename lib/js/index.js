

window.onload = () => {
  
let el = document.querySelector('[gps-camera]');
 console.log(el);
 el.addEventListener('gps-camera-update-positon',(e)=>{
  console.log(el);
 });
    let places = staticLoadPlaces();
    LocationPointFactry(places);
  

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
    {
      name: '測定観測用pin2',
      location: {
          lat: 35.53266559057619,
          lng: 139.65842057321805,
      }
  },
];

}

const LocationPointFactry = (places)=>{
  let scene = document.querySelector('a-scene');
  let nav = document.getElementById("nav");
  var debug = document.getElementById("debug");
  let locationName = document.getElementById("locationName");
  let distance = document.getElementById("distance");
  places.forEach((place) => {
    let latitude = place.location.lat;
    let longitude = place.location.lng;
    let name = place.name;
    let model = document.createElement('a-entity');
    model.setAttribute('look-at', '[gps-camera]');
    model.setAttribute('gltf-model',"lib/obj/pin.glb");
    model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
    model.setAttribute('scale',  {x: 10, y: 10, z: 10});
    model.addEventListener('loaded', () => {
      window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));

  });
     model.addEventListener('mouseenter', function () {
        model.setAttribute('scale', {x: 20, y: 20, z: 20});
        nav.setAttribute('class','slideUp');
      
        locationName.textContent = name;
        debug.textContent =name;

      });
    
      model.addEventListener('mouseleave', function () {
        model.setAttribute('scale', {x: 10, y: 10, z: 10});
        nav.setAttribute('class','slideDown');
      
        debug.textContent ="not";
      });
      model.addEventListener('gps-entity-place-update-positon', (event) => {
        console.log(event);
        debugdistance.textContent = `あと${event.detail.distance}m`;
     
      });
      scene.appendChild(model);
  });
}

function DistanceChack(){
  let distanceText = document.getElementById("distance");
        console.log("addObjectOK");
        var obj =document.getElementById('object');
        console.log(obj);
        obj.addEventListener('gps-entity-place-update-positon', (event) => {
            console.log(event);
            distanceText.textContent = `あと${event.detail.distance}m`;
         
          });
}



