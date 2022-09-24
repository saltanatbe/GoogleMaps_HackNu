<script>
import data from "@/stores/files.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Loader } from "@googlemaps/js-api-loader";
import { useMapStore } from "@/stores/useMapStore.js";
import Metadata from "./components/Metadata.vue";

let index = 0;

const apiOptions = {
  apiKey: "AIzaSyAues8dw_usefVuVYKfmGAmPmBvPBqmCgY",
  version: "beta",
};

let map = null;
// map.setOptions({ draggable: true });
const mapOptions = {
  draggable: false,
  tilt: 0,
  heading: 0,
  zoom: 18,
  center: {
    lat: data.list[index].Latitude,
    lng: data.list[index].Longitude,
  },
  altitude: data.list[index].Altitude,
  mapId: "e1b4d53499a2fa30",
};
const mapOptionsDark = {
  tilt: 0,
  heading: 0,
  zoom: 18,
  center: {
    lat: data.list[index].Latitude,
    lng: data.list[index].Longitude,
  },
  altitude: data.list[index].Altitude,
  mapId: "580dbb52dcccde5e",
};

export default {
  beforeUnmount() {

    document.getElementById("map-home").innerHTML = "";
    // console.log(document.getElementById("map-home"));
  },
  mounted() {
    var element = document.getElementById("nightMode");
    element.onclick = async function (event) {
      if (!useMapStore().nightMode) element.innerHTML = "Light Mode";
      else element.innerHTML = "Night Mode";
      useMapStore().setNightMode();
      map = await initMap(useMapStore().nightMode);
      initWebGLOverlayView(map);
    };
    async function initMap(isNight) {
      const mapDiv = document.getElementById("map-home");
      const apiLoader = new Loader(apiOptions);
      await apiLoader.load();
      if (!isNight) return new google.maps.Map(mapDiv, mapOptions);
      else return new google.maps.Map(mapDiv, mapOptionsDark);
    }
    var button = document.getElementById("path");
    button.onclick = async function (event) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      const dest = mapOptions.center.lat + "," + mapOptions.center.lng;
      directionsService.route(
        {
          origin: "51.50843075,-0.098585086",
          destination: dest,//"51.51116061,-0.098394436",
          travelMode: "DRIVING"
        },
        (directionsResult, directionsStatus) => {
          if (directionsStatus === "OK") {
            directionsRenderer.setDirections(directionsResult);
            directionsRenderer.setMap(map);
          }
          console.log(directionsResult);
          console.log(directionsStatus);
        }
      );
      // const directionsRenderer = new google.maps.directionsRenderer({
      //   map: map
      // })
    }
    function initWebGLOverlayView(map) {
      let scene, renderer, camera, loader;
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
        const geometry = new THREE.CylinderGeometry(40, 40, 20, 50);
        const material = new THREE.MeshBasicMaterial({
          color: 4293872,
          opacity: 0.5,
          transparent: true,
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.rotateX(1.57);
        scene.add(cylinder);
        //-------------------
        const geometry2 = new THREE.CylinderGeometry(40, 40, 20, 50);
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
        let start = data.list[index].Timestamp;
        loader.manager.onLoad = () => {
          renderer.setAnimationLoop(() => {
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
          lat: mapOptions.center.lat,
          lng: mapOptions.center.lng,
          altitude: mapOptions.altitude,
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
        Latitude: data.list[index].Latitude,
        Longitude: data.list[index].Longitude,
        Altitude: data.list[index].Altitude,
        Identifier: "",
        Timestamp: null,
        "Floor label": null,
        "Horizontal accuracy": null,
        "Vertical accuracy": null,
        Activity: "",
      },
    };
  },
  methods: {
    findLocation() {
      mapOptions.center = {
        lat: this.formValues.Latitude,
        lng: this.formValues.Longitude,
      };

      mapOptions.altitude = this.formValues.Altitude;
    },
  },
  components: { Metadata },
};
</script>

<template>
  <div>
    <div id="map-home" ref="homeMap" class="map-size"></div>
    <Metadata :formValues="formValues"></Metadata>
    <!-- <div style="background: white; width: 300px">
       <pre>
        {{ JSON.stringify(formValues, null, 2) }}
      </pre> 
    </div> -->
    <form id="fixed">
      <div class="form-group">
        <input
          type="text"
          class="form-control border-4"
          required
          id="lat"
          placeholder="Latitude"
          v-model.number.lazy="formValues.Latitude"
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          required
          id="lng"
          placeholder="Longtitude"
          v-model.number="formValues.Longitude"
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          required
          id="alt"
          placeholder="Altitude"
          v-model.number="formValues.Altitude"
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          id="name"
          placeholder="Name(optional)"
          v-model="formValues.Identifier"
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          required
          id="time"
          placeholder="Time passed"
          v-model.number="formValues.Timestamp"
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          id="floor"
          placeholder="Floor (optional)"
          v-model.number='formValues["Floor label"]'
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          required
          id="horizontalAcc"
          placeholder="Horizontal accuracy"
          v-model.number='formValues["Horizontal accuracy"]'
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          required
          id="verticalAcc"
          placeholder="Vertical accuracy"
          v-model.number='formValues["Vertical accuracy"]'
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          id="activity"
          placeholder="Activity (optional)"
          v-model="formValues.Activity"
        />
      </div>
      <!-- checkgu -->
      <div class="form-group">
        <button
          type="submit"
          class="btn btn-primary"
          @click.prevent="findLocation()"
        >
          Find location
        </button>
        
      </div>
    </form>
    <button id="path">
          Path
        </button>
  </div>
</template>

<style scoped>
.map-size {
  height: 90%;
  /* width: 200px; */
  background-color: 9cc0f9;
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
#path{
  position:fixed;
  left:10px;
  top: 200px;
}
</style>
