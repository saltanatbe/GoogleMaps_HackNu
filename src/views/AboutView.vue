<script>
  import data from "@/stores/files.js";
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { Loader } from "@googlemaps/js-api-loader";
  import { useMapStore } from "@/stores/useMapStore.js";
  import Metadata from "@/views/components/Metadata.vue";
  
  let historyIndex = 0;
  let actionIndex = 0;
  let map = null;
  const apiOptions = {
    apiKey: "AIzaSyAues8dw_usefVuVYKfmGAmPmBvPBqmCgY",
    version: "beta",
  };
  
  const mapOptions = {
    tilt: 0,
    heading: 0,
    zoom: 20,
    center: {
      lat: data.list[historyIndex][actionIndex].Latitude,
      lng: data.list[historyIndex][actionIndex].Longitude,
    },
    altitude: data.list[historyIndex][actionIndex].Altitude,
    mapId: "d6f0f88a3b3b2883",
  };
  
  const mapOptionsDark = {
    tilt: 0,
    heading: 0,
    zoom: 20,
    center: {
      lat: data.list[historyIndex][actionIndex].Latitude,
      lng: data.list[historyIndex][actionIndex].Longitude,
    },
    altitude: data.list[historyIndex][actionIndex].Altitude,
    mapId: "580dbb52dcccde5e",
  };
  
  export default {
    data() {
      return {
        manualMode: false,
        histories: data.list,
        historyIndex: historyIndex,
        actionIndex: actionIndex,
      };
    },
    beforeUnmount() {
      document.getElementById("map-predef").innerHTML = "";
      // console.log(document.getElementById("map-predef"));
    },
    mounted() {
      let vue = this;
  
      var element = document.getElementById("nightMode");
  
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
        element.onclick = async function (event) {
          if (!useMapStore().nightMode) element.innerHTML = "Light Mode";
          else element.innerHTML = "Night Mode";
          useMapStore().setNightMode();
          map = await initMap(useMapStore().nightMode);
  
          webGLOverlayView.setMap(map);
        };
        webGLOverlayView.onAdd = () => {
          scene = new THREE.Scene();
          camera = new THREE.PerspectiveCamera();
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
  
          // // 2. Initiate FlyControls with various params
          // controls = new FlyControls(camera, renderer.domElement);
          // controls.movementSpeed = 100;
          // controls.rollSpeed = Math.PI / 24;
          // controls.autoForward = false;
          // controls.dragToLook = true;
  
          directionalLight.position.set(0.5, -1, 0.5);
          scene.add(ambientLight);
          scene.add(directionalLight);
          console.log(scene);
          loader = new GLTFLoader();
          loader.load("dot.gltf", (gltf) => {
            gltf.scene.scale.set(1, 1, 1);
            gltf.scene.rotation.x = (180 * Math.PI) / 180;
            scene.add(gltf.scene);
          });
  
          // ----cylinder -----
          // upper radius, bottom radius, altitude
          console.log(
            "raduis",
            data.list,
            vue.historyIndex,
            vue.actionIndex,
            data.list[vue.historyIndex][vue.actionIndex]["Horizontal accuracy"],
            data.list[vue.historyIndex][vue.actionIndex]["Horizontal accuracy"],
            data.list[vue.historyIndex][vue.actionIndex]["Vertical accuracy"]
          );
          const geometry = new THREE.CylinderGeometry(
            data.list[historyIndex][actionIndex]["Horizontal accuracy"],
            data.list[historyIndex][actionIndex]["Horizontal accuracy"],
            data.list[historyIndex][actionIndex]["Vertical accuracy"],
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
          //-------------------
          const geometry2 = new THREE.CylinderGeometry(
            data.list[historyIndex][actionIndex]["Horizontal accuracy"],
            data.list[historyIndex][actionIndex]["Horizontal accuracy"],
            data.list[historyIndex][actionIndex]["Vertical accuracy"],
            50
          );
          const edges = new THREE.EdgesGeometry(geometry2);
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x4184f0 })
          );
          line.rotateX(1.57);
          scene.add(line);
          //-------------------/
          // 3. update controls with a small step value to "power its engines"
          // controls.update(0.01);
        };
        webGLOverlayView.onContextRestored = ({ gl }) => {
          renderer = new THREE.WebGLRenderer({
            canvas: gl.canvas,
            context: gl,
            ...gl.getContextAttributes(),
          });
          renderer.autoClear = false;
  
          let start = data.list[vue.historyIndex][vue.actionIndex].Timestamp;
  
          loader.manager.onLoad = () => {
            let value = true;
            let mue = vue;
            let button = document.getElementById("myBtn");
            // console.log(button);
            button.onclick = async function (event) {
              mue.manualMode = !mue.manualMode;
              event.preventDefault();
              if (value) {
                renderer.setAnimationLoop(null);
              } else {
                renderer.setAnimationLoop(() => animationOptions());
              }
              value = !value;
            };
  
            function createShallow() {
              console.log(
                "entered shallow",
                vue.actionIndex,
                data.list[vue.historyIndex].length
              );
              if (vue.actionIndex >= data.list[vue.historyIndex].length) return;
              const geometry = new THREE.CylinderGeometry(
                data.list[vue.historyIndex][vue.actionIndex][
                  "Horizontal accuracy"
                ],
                data.list[vue.historyIndex][vue.actionIndex][
                  "Horizontal accuracy"
                ],
                data.list[vue.historyIndex][vue.actionIndex]["Vertical accuracy"],
                50
              );
              const material = new THREE.MeshBasicMaterial({
                color: 0x4184f0,
                opacity: 0.5,
                transparent: true,
              });
              const cylinder = new THREE.Mesh(geometry, material);
              cylinder.rotateX(1.57);
              // console.log(scene);
              let ball = scene.children.pop();
              scene.children.pop();
              scene.children.pop();
              scene.add(cylinder);
              const geometry2 = new THREE.CylinderGeometry(
                data.list[vue.historyIndex][vue.actionIndex][
                  "Horizontal accuracy"
                ],
                data.list[vue.historyIndex][vue.actionIndex][
                  "Horizontal accuracy"
                ],
                data.list[vue.historyIndex][vue.actionIndex]["Vertical accuracy"],
                50
              );
              const edges = new THREE.EdgesGeometry(geometry2);
              const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({ color: 0x4184f0 })
              );
              line.rotateX(1.57);
              scene.add(line);
              scene.add(ball);
            }
  
            function animationOptions() {
              start += 1000;
              // console.log(historyIndex, actionIndex);
              if (vue.actionIndex >= data.list[vue.historyIndex].length) {
              } else {
                if (data.list[vue.historyIndex].length == 1) {
                  createShallow();
                } else if (
                  data.list[vue.historyIndex].length > 1 &&
                  start >=
                    data.list[vue.historyIndex][
                      (vue.actionIndex + 1) % data.list[vue.historyIndex].length
                    ].Timestamp
                ) {
                  createShallow();
                  vue.actionIndex += 1;
                  if (vue.actionIndex == data.list[vue.historyIndex].length - 1) {
                    vue.actionIndex = 0;
                    start =
                      data.list[vue.historyIndex][vue.actionIndex].Timestamp;
                  }
                }
                // console.log(vue.actionIndex, data.list[vue.historyIndex].length);
                if (vue.actionIndex >= data.list[vue.historyIndex].length) return;
                mapOptions.center.lat =
                  data.list[vue.historyIndex][vue.actionIndex].Latitude;
                mapOptions.center.lng =
                  data.list[vue.historyIndex][vue.actionIndex].Longitude;
                mapOptions.altitude =
                  data.list[vue.historyIndex][vue.actionIndex].Altitude;
                // from tutorial
                map.moveCamera({
                  tilt: mapOptions.tilt,
                  heading: mapOptions.heading,
                  zoom: mapOptions.zoom,
                  center: {
                    lat: mapOptions.center.lat,
                    lng: mapOptions.center.lng,
                  },
                });
                if (mapOptions.tilt < 50.5) {
                  mapOptions.tilt += 0.5;
                }
              }
              // from tutorial
            }
            renderer.setAnimationLoop(() => animationOptions());
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
    components: { Metadata },
    methods: {
      setHistory(i) {
        this.historyIndex = i;
        this.actionIndex = 0;
      },
      createUrl() {
        let x = this.histories[historyIndex][actionIndex].Latitude;
        let y = this.histories[historyIndex][actionIndex].Longitude;
        let z = this.histories[historyIndex][actionIndex].Altitude;
        let url = `http://127.0.0.1:5173?x=${x}&y=${y}&z=${z}`;
        alert(url);
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
          <div class="modal-body">...</div>
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
      <div
        class="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <span class="m-1" v-for="(history, i) in histories">
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            :value="i"
            :id="`btnradio${i}`"
            autocomplete="off"
            v-model="historyIndex"
          />
          <label class="btn btn-outline-primary" :for="`btnradio${i}`"
            >Preset {{ i }}</label
          >
        </span>
      </div>
      <div id="map-predef" class="map-size"></div>
    </div>
    <div class="form-group" id="fixed">
      <button id="myBtn" type="submit" class="btn btn-primary mx-2">
        {{ manualMode ? "Turn Tracking Camera Mode" : "Turn Manual Camera Mode" }}
      </button>
    </div>
    <Metadata :formValues="histories[historyIndex][actionIndex]"></Metadata>
  </template>
  
  <style scoped>
  .container90 {
    height: 90%;
  }
  .map-size {
    height: 90%;
    background-color: #9cc0f9;
  }
  
  .choose-history-bar {
    height: 10%;
  }
  
  #fixed {
    position: fixed;
    top: 135px;
    left: 10px;
    /* width: 20%; */
    box-sizing: border-box;
    padding: 5px;
    border: solid 2px white;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.7); /* Green background with 30% opacity */
  }
  </style>
  