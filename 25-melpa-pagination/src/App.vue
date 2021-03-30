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
<style src="spectre.css/dist/spectre-icons.css"></style>

<style>
#app {
  margin-top: 1em;
  text-align: center;
}
</style>
