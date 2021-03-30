<template>
  <div id="app" class="container grid-lg">
    <div class="tags columns my-2">
      <button
        v-for="name in tags"
        :key="name"
        :class="['btn', 'column', activeTags.includes(name) ? 'active' : '']"
        @click="toggleTag(name)"
      >
        {{ name }}
      </button>
    </div>

    <div v-if="activeTags.length" class="text-small">
      {{ filteredChampions.length }} matches
    </div>
    <div class="grid" ref="grid">
      <div v-for="c in champions" :key="c.id" class="grid-item" :data-id="c.id">
        <img
          :src="require(`./assets/${c.id}.png`)"
          :alt="c.id"
          width="120"
          height="120"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Isotope from "isotope-layout";
import { data as championsObject } from "./assets/champion.json";

export default {
  data() {
    return {
      champions: Object.values(championsObject),
      iso: null,
      activeTags: [],
    };
  },
  watch: {
    filteredChampions() {
      console.log("filteredChampions changed");
      this.iso.arrange({
        filter: (itemElem) => {
          const championId = itemElem.dataset.id;
          return this.filteredChampions.find(({ id }) => id === championId);
        },
      });
    },
  },
  computed: {
    tags() {
      const allTags = this.champions.reduce(
        (allTags, { tags }) => allTags.concat(tags),
        []
      );
      return [...new Set(allTags)];
    },
    filteredChampions() {
      if (this.activeTags.length === 0) return this.champions;

      return this.champions.filter(({ tags }) => {
        return tags.some((t) => this.activeTags.includes(t));
      });
    },
  },
  mounted() {
    console.log("mounted: 初始化 Isotope");
    this.iso = new Isotope(".grid", {
      itemSelector: ".grid-item",
      // XXX 这个选项什么意思？
      layoutMode: "fitRows",
    });
  },
  methods: {
    toggleTag(tag) {
      const idx = this.activeTags.indexOf(tag);
      if (idx > -1) {
        this.activeTags.splice(idx, 1);
      } else {
        this.activeTags.push(tag);
      }
      console.log(this.activeTags);
    },
  },
};
</script>


<style src="spectre.css/dist/spectre.css"></style>

<style>
/* body {
  max-width: 1000px;
  margin: 1em auto 3em auto;
}

.grid-item {
  margin-right: 5px;
} */
</style>