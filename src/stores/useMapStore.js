import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMapStore = defineStore("mapStore", {
  state: () => ({
    aboutMap: null,
    homeMap: null,
    nightMode : false,
  }),
  getters: {
    getAboutMap: (state) => state.aboutMap,
    getHomeMap: (state) => state.homeMap,
    getNightMode: (state) => state.nightMode,
  },
  actions: {
    setAboutMap(newMap) {
      this.aboutMap = newMap;
    },
    setHomeMap(newMap) {
      this.homeMap = newMap;
    },
    setNightMode() {
      this.nightMode = !this.nightMode;
    },
  },
});
