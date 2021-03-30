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
        <picture class="p-relative">
          <img
            :src="require(`./assets/${c.id}.png`)"
            :alt="c.id"
            width="120"
            height="120"
          />
          <figcaption class="p-absolute">
            <span>
              {{ c.name }}
            </span>
          </figcaption>
        </picture>
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
.grid-item {
  width: 120px;
  height: 120px;
}

figcaption {
  display: none;
  bottom: 1px;
  right: 0;
  width: 100%;
  text-align: center;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}

.grid-item:hover figcaption {
  display: block;
  z-index: 3;
}

img {
  transition: 0.1s;
  filter: grayscale(0.5);
}

.grid-item:hover img {
  filter: none;
  transform: scale(1.4);
  position: relative;
  z-index: 2;
}
</style>