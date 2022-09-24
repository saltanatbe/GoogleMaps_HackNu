<script>
import data from "@/stores/files.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Loader } from "@googlemaps/js-api-loader";
import { useMapStore } from "@/stores/useMapStore.js";

console.log("====================================");
console.log("in about view");
console.log("====================================");
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
  mapId: "d6f0f88a3b3b2883",
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
    document.getElementById("map-predef").innerHTML = "";
    console.log(document.getElementById("map-predef"));
  },
  mounted() {
    async function initMap(isNight) {
      const mapDiv = document.getElementById("map-predef");
      const apiLoader = new Loader(apiOptions);
      await apiLoader.load();
      if (isNight == true) return new google.maps.Map(mapDiv, mapOptionsDark);
      else return new google.maps.Map(mapDiv, mapOptions);
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
            start += 1000;
            // console.log(start, data.list[index + 1].Timestamp);
            if (start >= data.list[(index + 1) % data.list.length].Timestamp) {
              index += 1;
              if (index == data.list.length - 1) {
                index = 0;
                start = data.list[index].Timestamp;
              }
            }
            mapOptions.center.lat = data.list[index].Latitude;
            mapOptions.center.lng = data.list[index].Longitude;
            mapOptions.altitude = data.list[index].Altitude;
            // from tutorial
            // map.moveCamera({
            //   tilt: mapOptions.tilt,
            //   heading: mapOptions.heading,
            //   zoom: mapOptions.zoom,
            // });
            // if (mapOptions.tilt < 67.5) {
            //   mapOptions.tilt += 0.5;
            // } else if (mapOptions.heading <= 360) {
            //   mapOptions.heading += 0.2;
            // } else {
            //   renderer.setAnimationLoop(null);
            // }
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
      let map = await initMap(true);
      initWebGLOverlayView(map);
    })();
  },
};
</script>

<template>
  <div id="map-predef" class="map-size"></div>
</template>

<style scoped>
.map-size {
  height: 90%;
  background-color: aqua;
}
</style>
