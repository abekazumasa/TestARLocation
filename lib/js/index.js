window.onload = () => {
    let testEntityAdded = false;

    const el = document.querySelector("[gps-new-camera]");
   
    el.addEventListener("gps-camera-update-position", e => {
        if(!testEntityAdded) {
            alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            var vec = Transform(e.detail.position.longitude,e.detail.position.latitude);
        const entity = LocationPointFactry(vec);
        }
        testEntityAdded = true;
    });
};

const Transform =({ latitude, longitude }) => [
    {
    location: { latitude, longitude },
    scale: ['5', '5', '5'],
    },
];  

const LocationPointFactry = (Transform)=>{
    const entity= document.createElement("a-gltf-model");
    entity.setAttribute('id',"object");
    entity.setAttribute('src',"lib/obj/pin.glb");
    entity.setAttribute("scale", Transform.scale);
    entity.setAttribute('gps-new-entity-place', {
        longitude: Transform.location,
        latitude: Transform.latitude + 0.001
    });
    document.querySelector("a-scene").appendChild(entity);
    entity.addEventListener(
        'loaded',
        () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')),
      );
      return entity;
}

function DistanceChack(){
        console.log("addObjectOK");
        var obj =document.getElementById('object');
        console.log(obj);
        obj.addEventListener('gps-entity-place-update-positon', (event) => {
            console.log(event);
            text.textContent = `あと${event.detail.distance}m`;
         
          });
}