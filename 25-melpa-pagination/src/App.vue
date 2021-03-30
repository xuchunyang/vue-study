<template>
  <div id="app">
    <package-list></package-list>
  </div>
</template>

<script>
import PackageList from "./components/PackageList.vue";

export default {
  name: "App",
  components: {
    PackageList,
  },
};
</script>

<style src="spectre.css/dist/spectre.css"></style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
