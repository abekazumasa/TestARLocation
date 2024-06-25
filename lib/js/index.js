window.onload = () => {
    let testEntityAdded = false;

    const el = document.querySelector("[gps-new-camera]");
    var entity ;
    el.addEventListener("gps-camera-update-position", e => {
        if(!testEntityAdded) {
            alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            entity = LocationPointFactry(e.detail.position.longitude,e.detail.position.latitude);
        }
        testEntityAdded = true;
    });

    console.log(entity);
};

 

const LocationPointFactry = (long,lat)=>{
    const entity= document.createElement("a-gltf-model");
    entity.setAttribute('id',"object");
    entity.setAttribute('src',"lib/obj/pin.glb");
    entity.setAttribute("scale", {x: 10, y: 10,z: 10});
    entity.setAttribute('gps-new-entity-place', {
        longitude: long,
        latitude: lat + 0.001
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