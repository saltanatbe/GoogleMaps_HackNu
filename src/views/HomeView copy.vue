<script>
import data from "@/stores/files.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Loader } from "@googlemaps/js-api-loader";
import { useMapStore } from "@/stores/useMapStore.js";
import Metadata from "./components/Metadata.vue";

let index = 0;
//leave
const apiOptions = {
  apiKey: "AIzaSyAues8dw_usefVuVYKfmGAmPmBvPBqmCgY",
  version: "beta",
};

//leave
var p = false;
let map = null;

//leave
let myLocation = {
  lat: data.list[0][index].Latitude,
  lng: data.list[0][index].Longitude,
};

//leave
const mapOptions = {
  tilt: 0,
  heading: 0,
  zoom: 18,
  center: {
    lat: data.list[0][index].Latitude,
    lng: data.list[0][index].Longitude,
  },
  altitude: data.list[0][index].Altitude,
  mapId: "e1b4d53499a2fa30",
};

//leave
const mapOptionsDark = {
  tilt: 0,
  heading: 0,
  zoom: 18,
  center: {
    lat: data.list[0][index].Latitude,
    lng: data.list[0][index].Longitude,
  },
  altitude: data.list[0][index].Altitude,
  mapId: "580dbb52dcccde5e",
};

export default {
  beforeUnmount() {
    document.getElementById("map-home").innerHTML = "";
    // console.log(document.getElementById("map-home"));
  },
  mounted() {
    let vue = this;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams);
    if (urlParams.get("x")) this.formValues.Latitude = urlParams.get("x");
    if (urlParams.get("y")) this.formValues.Longitude = urlParams.get("y");
    if (urlParams.get("z")) this.formValues.Altitude = urlParams.get("z");
    console.log(this.formValues);
    async function initMap(isNight) {
      const mapDiv = document.getElementById("map-home");
      const apiLoader = new Loader(apiOptions);
      await apiLoader.load();
      if (!isNight) return new google.maps.Map(mapDiv, mapOptions);
      else {
        mapOptionsDark.center.lat = mapOptions.center.lat;
        mapOptionsDark.center.lng = mapOptions.center.lng;
        mapOptionsDark.altitude = mapOptions.altitude;
        return new google.maps.Map(mapDiv, mapOptionsDark);
      }
    }
    function initWebGLOverlayView(map) {
      let scene, renderer, camera, loader;
      var element = document.getElementById("nightMode");
      var button = document.getElementById("path");

      //find location-leave
      var btn = document.getElementById("find");
      btn.onclick = async function (event) {
      renderer.setAnimationLoop(() => {
            map.moveCamera({
              tilt: mapOptions.tilt,
              heading: mapOptions.heading,
              zoom: mapOptions.zoom,
              center: {
                lat: mapOptions.center.lat,
                lng: mapOptions.center.lng,
              },
            });
          });
          setTimeout(()=>{
            renderer.setAnimationLoop(null);
          }, 500)
          
      };

      //path - leave
    button.onclick = async function (event) {
        event.preventDefault();
        if (p == false) {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer();
          const dest = mapOptions.center.lat + "," + mapOptions.center.lng;
          var activity = "DRIVING";
          var originLocation = myLocation.lat + "," + myLocation.lng;
          directionsService.route(
            {
              origin: originLocation,
              destination: dest, //"51.51116061,-0.098394436",
              travelMode: activity,
            },
            (directionsResult, directionsStatus) => {
              if (directionsStatus === "OK") {
                // renderer.setDirections(directionsResult);
                // renderer.sendMap(map)
                directionsRenderer.setDirections(directionsResult);
                // map.mapOptions("dragable");
                directionsRenderer.setMap(map);
              }
              // console.log(directionsResult);
              // console.log(directionsStatus);
            }
          );
        } else {
          renderer.resetState();
        }
        p = !p;
      };

      //night mode leave
    element.onclick = async function (event) {
      renderer.setAnimationLoop("null");
      if (!useMapStore().nightMode) element.innerHTML = "Light Mode";
      else element.innerHTML = "Night Mode";
      useMapStore().setNightMode();
      map = await initMap(useMapStore().nightMode);
      initWebGLOverlayView(map);
      };
    
      const webGLOverlayView = new google.maps.WebGLOverlayView();
      webGLOverlayView.onAdd = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera();
        const ambientLight = new THREE.AmbientLight(16777215, 0.75);
        const directionalLight = new THREE.DirectionalLight(16777215, 0.25);
        directionalLight.position.set(0.5, -1, 0.5);
        scene.add(ambientLight);
        scene.add(directionalLight);
        // ----cylinder -----
        const geometry = new THREE.CylinderGeometry(
          data.list[0][0]["Horizontal accuracy"],
          data.list[0][0]["Horizontal accuracy"],
          data.list[0][0]["Vertical accuracy"],
          50
        );
        const material = new THREE.MeshBasicMaterial({
          color: 4293872,
          opacity: 0.5,
          transparent: true,
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.rotateX(1.57);
        scene.add(cylinder);
        //-------------------
        const geometry2 = new THREE.CylinderGeometry(
          data.list[0][0]["Horizontal accuracy"],
          data.list[0][0]["Horizontal accuracy"],
          data.list[0][0]["Vertical accuracy"],
          50
        );
        const edges = new THREE.EdgesGeometry(geometry2);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 4293872 })
        );
        line.rotateX(1.57);
        scene.add(line);
        //-------------------
        loader = new GLTFLoader();
        loader.load("dot.gltf", (gltf) => {
          gltf.scene.scale.set(5, 5, 5);
          gltf.scene.rotation.x = (180 * Math.PI) / 180;
          scene.add(gltf.scene);
        });
      };
      webGLOverlayView.onContextRestored = ({ gl }) => {
        renderer = new THREE.WebGLRenderer({
          canvas: gl.canvas,
          context: gl,
          ...gl.getContextAttributes(),
        });
        renderer.autoClear = false;
        let start = data.list[0][0].Timestamp;
        loader.manager.onLoad = () => {
          function createShallow() {
            const geometry = new THREE.CylinderGeometry(
              data.list[0][0]["Horizontal accuracy"],
              data.list[0][0]["Horizontal accuracy"],
              data.list[0][0]["Vertical accuracy"],
              50
            );
            const material = new THREE.MeshBasicMaterial({
              color: 0x4184f0,
              opacity: 0.5,
              transparent: true,
            });
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.rotateX(1.57);
            scene.add(cylinder);
          }
          renderer.setAnimationLoop(() => {
            createShallow();
            // start += 1000;
            // // console.log(start, data.list[index + 1].Timestamp);
            // if (start >= data.list[(index + 1) % data.list.length].Timestamp) {
            //   index += 1;
            //   if (index == data.list.length - 1) {
            //     index = 0;
            //     start = data.list[index].Timestamp;
            //   }
            // }
            // mapOptions.center.lat = data.list[index].Latitude;
            // mapOptions.center.lng = data.list[index].Longitude;
            // mapOptions.altitude = data.list[index].Altitude;
            // camera move
            map.moveCamera({
              tilt: mapOptions.tilt,
              heading: mapOptions.heading,
              zoom: mapOptions.zoom,
              center: {
                lat: mapOptions.center.lat,
                lng: mapOptions.center.lng,
              },
            });
            if (mapOptions.tilt < 67.5) {
              mapOptions.tilt += 0.5;
            } else {
              renderer.setAnimationLoop(null);
            }
          });
        };
      };
      webGLOverlayView.onDraw = ({ gl, transformer }) => {
        const latLngAltitudeLiteral = {
          lat: !vue.formValues.Latitude
            ? mapOptions.center.lat
            : Number(vue.formValues.Latitude),
          lng: !vue.formValues.Longitude
            ? mapOptions.center.lat
            : Number(vue.formValues.Longitude),
          altitude: !vue.formValues.Altitude
            ? mapOptions.center.lat
            : Number(vue.formValues.Altitude),
        };
        const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
        camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
        webGLOverlayView.requestRedraw();
        renderer.render(scene, camera);
        renderer.resetState();
      };
      webGLOverlayView.setMap(map);
    }
    async function createMap() {
      map = await initMap(useMapStore().nightMode);
      initWebGLOverlayView(map);
    }
    createMap();
  },
  data() {
    return {
      formValues: {
        Latitude: data.list[0][index].Latitude,
        Longitude: data.list[0][index].Longitude,
        Altitude: data.list[0][index].Altitude,
        Identifier: "",
        Timestamp: null,
        "Floor label": null,
        "Horizontal accuracy": null,
        "Vertical accuracy": null,
        Activity: "",
      },
      myLocation: {
        lat: null,
        lng: null,
      },
    };
  },
  methods: {
    //find location leave
    findLocation() {
      mapOptions.center = {
        lat: this.formValues.Latitude,
        lng: this.formValues.Longitude,
      };
      mapOptions.altitude = this.formValues.Altitude;
    },
    createUrl() {
      let x = this.formValues.Latitude;
      let y = this.formValues.Longitude;
      let z = this.formValues.Altitude;
      let url = `http://127.0.0.1:5173?x=${x}&y=${y}&z=${z}`;
      return url;
    },
    //get my location leave
    getMyLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          mapOptions.center.lat = position.coords.latitude;
          mapOptions.center.lng = position.coords.longitude;
          this.formValues.Latitude = mapOptions.center.lat;
          this.formValues.Longitude = mapOptions.center.lng;
          let alt = prompt(
            "Please enter on which floor of the building you are? If you are outside, enter 1"
          );
          this.formValues.Altitude = alt * 2.7;
          mapOptions.altitude = this.formValues.Altitude;
          myLocation.lat = this.formValues.Latitude;
          myLocation.lng = this.formValues.Longitude;
        },
        (error) => {
          console.log(error.message);
        }
      );
    },
  },
  components: { Metadata },
};
</script>

<template>
  
    <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <a :href="createUrl()">share this link!</a>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  <div class="container90">
    <div id="map-home" ref="homeMap" class="map-size"></div>
    
    <Metadata :formValues="formValues"></Metadata>

  <form id="fixed">
    <div class="form-group">
    <input type="text" class="form-control border-4"  required id="lat" placeholder="Latitude" v-model.number.lazy="formValues.Latitude
    ">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" required id="lng" placeholder="Longtitude" v-model.number="formValues.Longitude">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" required id="alt" placeholder="Altitude" v-model.number="formValues.Altitude">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="name" placeholder="Name(optional)" v-model="formValues.Identifier">
  </div>
   <div class="form-group">
    <input type="text" class="form-control" required id="time" placeholder="Time passed" v-model.number="formValues.Timestamp">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="floor" placeholder="Floor (optional)" v-model.number='formValues["Floor label"]'>
  </div>
  <div class="form-group">
    <input type="text" class="form-control" required id="horizontalAcc" placeholder="Horizontal accuracy" v-model.number='formValues["Horizontal accuracy"]'>
  </div>
  <div class="form-group">
    <input type="text" class="form-control" required id="verticalAcc" placeholder="Vertical accuracy" v-model.number='formValues["Vertical accuracy"]'>
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="activity" placeholder="Activity (optional)" v-model="formValues.Activity">
  </div> 
      
  <div class="form-group">
        <button
          type="submit"
          class="btn btn-primary"
          id = "find"
          @click.prevent="findLocation()"
        >
          Find location
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          @click.prevent="getMyLocation()">
          My location
        </button>
      </div>
    </form>
    <div class="fixed">
      <button id="path" class="btn btn-primary">
          Path
      </button>
      <button
      type="button"
      class="btn btn-primary fixed2"
      data-toggle="modal"
      data-target="#exampleModal"
    >
      Share with Friends!
    </button>
    </div>
      
  </div>
</template>

<style scoped>
.map-size {
  height: 100%;
  /* width: 200px; */
  background-color: #9cc0f9;
}
.container90 {
  height: 90%;
}


#fixed {
  position: fixed;
  top: 135px;
  left: 10px;
  width: 20%;
  box-sizing: border-box;
  padding: 5px;
  border: solid 2px white;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.7); /* Green background with 30% opacity */
}
.form-control  {
  border-width: 2px;
}
.form-group  {
  margin: 8px 2px;
}
.fixed{
  position:fixed;
  left:20px;
  margin:10px;
  top: 635px;
}
</style>
