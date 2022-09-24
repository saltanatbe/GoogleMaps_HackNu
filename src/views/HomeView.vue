<script>
import data from "@/stores/files.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Loader } from "@googlemaps/js-api-loader";
import { useMapStore } from "@/stores/useMapStore.js";

let index = 0;

const apiOptions = {
  apiKey: "AIzaSyAues8dw_usefVuVYKfmGAmPmBvPBqmCgY",
  version: "beta",
};

const mapOptions = {
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

export default {
  beforeUnmount() {
    document.getElementById("map-home").innerHTML = "";
    console.log(document.getElementById("map-home"));
  },
  mounted() {
    async function initMap() {
      const mapDiv = document.getElementById("map-home");
      const apiLoader = new Loader(apiOptions);
      await apiLoader.load();
      return new google.maps.Map(mapDiv, mapOptions);
    }

    function initWebGLOverlayView(map) {
      let scene, renderer, camera, loader;
      const webGLOverlayView = new google.maps.WebGLOverlayView();

      webGLOverlayView.onAdd = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);

        directionalLight.position.set(0.5, -1, 0.5);
        scene.add(ambientLight);
        scene.add(directionalLight);

        // ----cylinder -----
        const geometry = new THREE.CylinderGeometry(40, 40, 20, 50);
        const material = new THREE.MeshBasicMaterial({
          color: 0x4184f0,
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
          new THREE.LineBasicMaterial({ color: 0x4184f0 })
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

            console.log("MAPOPTIONSBOOOOOOOm" + mapOptions.center.lat);

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
    (async () => {
      let map = await initMap();
      initWebGLOverlayView(map);
    })();
  },
  
  
  data(){
    return {
      formValues: {
        lat: data.list[index].Latitude,
        lng: data.list[index].Longitude,
        alt: data.list[index].Altitude,
        name: "",
        time: null,
        floor: null,
        horizontalAcc: null,
        verticalAcc: null,
        activity: ""
      },
      
    }
  },
  methods: {
    findLocation(){
      mapOptions.center = {
        lat: this.formValues.lat,
        lng: this.formValues.lng,
      }
      console.log("AAAAAAAAAAAAAAAAAa ");
      mapOptions.altitude = this.formValues.alt
      // alert("VVVVVVVVVVVVVVVV")
     
    }
  }
};
</script>

<template>
  <div id="map-home" ref="homeMap" class="map-size"></div>
  <div style="background: white; width: 300px;">
      <pre>
        {{ JSON.stringify(formValues, null, 2) }}
      </pre>
    </div>
  <form id="fixed">
  <div class="form-group">
    <input type="text" class="form-control border-4"  required id="lat" placeholder="Latitude" v-model.number.lazy="formValues.lat">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" required id="lng" placeholder="Longtitude" v-model.number="formValues.lng">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" required id="alt" placeholder="Altitude" v-model.number="formValues.alt">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="name" placeholder="Name(optional)" v-model="formValues.name">
  </div>
  <!-- <div class="form-group">
    <input type="text" class="form-control" required id="time" placeholder="Time passed" v-model.number="formValues.time">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="floor" placeholder="Floor (optional)" v-model.number="formValues.floor">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" required id="horizontalAcc" placeholder="Horizontal accuracy" v-model.number="formValues.horizontalAcc">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" required id="verticalAcc" placeholder="Vertical accuracy" v-model.number="formValues.verticalAcc">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="activity" placeholder="Activity (optional)" v-model="formValues.activity">
  </div> -->
  <div class="form-group">
  <button type="submit" class="btn btn-primary" @click.prevent="findLocation()">Find location</button></div>
</form>

</template>

<style scoped>
.map-size {
  height: 90%;
  /* width: 200px; */
  background-color: aqua;
}
#fixed{
  position: fixed;
  top: 135px;
  left: 10px;
  width: 20%;
  box-sizing: border-box;
  padding: 5px;
  border: solid 2px white;
  border-radius: 6px;
  background:  rgba(255,255,255,0.7);/* Green background with 30% opacity */
}
.form-control{
  border-width: 2px;
}
.form-group{
  margin: 8px 2px;
}



</style>
