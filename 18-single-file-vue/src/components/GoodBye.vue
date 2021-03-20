<template>
  <h1>GoodBye {{ who || "World" }}</h1>
</template>

<script>
export default {
  name: "GoodBye",
  props: {
    who: String,
  },
};
</script>

<style scoped>
h1 {
  color: blueviolet;
}
</style>