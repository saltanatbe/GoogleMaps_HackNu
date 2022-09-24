import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMapStore = defineStore("mapStore", {
  state: () => ({
    aboutMap: null,
    homeMap: null,
  }),
  getters: {
    getAboutMap: (state) => state.aboutMap,
    getHomeMap: (state) => state.homeMap,
  },
  actions: {
    setAboutMap(newMap) {
      this.aboutMap = newMap;
    },
    setHomeMap(newMap) {
      this.homeMap = newMap;
    },
  },
});
