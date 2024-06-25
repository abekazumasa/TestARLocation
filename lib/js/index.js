window.onload = () => {
    let testEntityAdded = false;

    const el = document.querySelector("[gps-camera]");
    var text =document.getElementById('debug');
    el.addEventListener("gps-camera-update-position", e => {
        console.log("camreaUpdate!");
        console.log(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
        if(!testEntityAdded) {
            alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            
            LocationFactry(e.detail.position.longitude,e.detail.position.latitude);
        }
      
        testEntityAdded = true;
    });
    //text.textContent ="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    console.log("addObjectOK");
    DistanceChack();
};


function LocationFactry(longitude,latitude) {
    // Add a box to the north of the initial GPS position
    const entity= document.createElement("a-entity");
    entity.setAttribute('id',"object");
    entity.setAttribute('gltf-model',"lib/obj/pin.glb");
    entity.setAttribute("scale", {
        x: 10, 
        y: 10,
        z: 10
    });
    entity.setAttribute('gps-entity-place', {
        longitude: longitude,
        latitude: latitude + 0.001
    });
    document.querySelector("a-scene").appendChild(entity);
}
function DistanceChack(){

    var obj =document.getElementById('object');
    console.log(obj);
    if(obj !=null){

        obj.addEventListener('gps-entity-place-update-positon', (event) => {
            console.log(event);
            text.textContent = `あと${event.detail.distance}m`;
         
          });
    }
}