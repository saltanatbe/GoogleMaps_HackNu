<script>
import { RouterLink, RouterView } from "vue-router";
import { useMapStore } from "./stores/useMapStore";

export default {
  data() {
    return {
      nightMode: useMapStore().nightMode
    }
  },
  methods: {
    changeTheme() {
      useMapStore().setNightMode()
    }
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark nav-custom">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarColor01"
        aria-controls="navbarColor01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: this.$route.path === '/' }"
              to="/"
              >Dynamic</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/predefined"
              :class="{ active: this.$route.path === '/predefined' }"
              >Predefined</router-link
            >          
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <RouterView class="content" />
</template>

<style scoped>
.content {
  height: 100%;
  width: 100%;
}

.nav-custom {
  height: 10%;
}
</style>
