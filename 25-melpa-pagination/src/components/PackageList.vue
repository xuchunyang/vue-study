<template>
  <div class="package-list container grid-lg">
    <div v-if="loading">
      <div class="loading loading-lg"></div>
      <p class="my-2">{{ loading }}</p>
    </div>
    <div v-else>
      <h2>
        Current List of {{ packages.length }} Packages
        <span class="total-downloads"
          >{{ totalDownloads }} downloads to date</span
        >
      </h2>
      <input
        type="search"
        name="q"
        id="search"
        class="form-input"
        placeholder="Search package by name and description"
      />
      <div class="search-result-tip"></div>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th v-for="f in fields" :key="f">{{ f }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in packages" :key="p.name">
            <td v-for="(val, f) in p" :key="f">{{ val }}</td>
          </tr>
        </tbody>
      </table>
      <nav></nav>
    </div>
  </div>
</template>

<script>
import Debug from "debug";
const debug = Debug("melpa");
debug("not work???");

import { sumBy } from "lodash";

export default {
  name: "PackageList",
  data() {
    return {
      loading: false,
      fields: ["name", "version", "desc", "downloads"],
      packages: [],
    };
  },
  computed: {
    totalDownloads() {
      return sumBy(this.packages, "downloads").toLocaleString();
    },
  },
  created() {
    // debug not work
    debug("PackageList created");
    console.log("PackageList created");

    const apiUrl =
      "https://study-1258907199.cos.ap-nanjing.myqcloud.com/melpa.json";
    this.loading = `Loading packages...`;
    fetch(apiUrl)
      .then((resp) => resp.json())
      .then((res) => {
        this.packages = res.map((arrPkg) => {
          const pkg = {};
          for (let i = 0; i < this.fields.length; i++) {
            const key = this.fields[i];
            const val = arrPkg[i];
            pkg[key] = val;
          }
          return pkg;
        });
        this.loading = false;
      });
  },
};
</script>

<style scoped>
.total-downloads {
  font-size: 65%;
  color: #666;
}
</style>