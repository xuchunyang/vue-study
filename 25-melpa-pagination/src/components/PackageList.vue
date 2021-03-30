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
        autocomplete="off"
        v-model="q"
        type="search"
        name="q"
        id="search"
        class="form-input"
        placeholder="Search package by name and description"
      />
      <div class="search-result-tip text-left text-small m-2">
        {{ matchingPackages.length }} matching packages
      </div>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th v-for="f in fields" :key="f">{{ f }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in matchingPackagesForCurrentPage" :key="p.name">
            <td v-for="(val, f) in p" :key="f">{{ val }}</td>
          </tr>
        </tbody>
      </table>
      <ul class="nav-page">
        <li v-for="i in totalPages" :key="i">
          <button
            :class="['btn', 'btn-action', i === pageNumber ? 'active' : '']"
            @click="pageNumber = i"
          >
            {{ i }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Debug from "debug";
const debug = Debug("melpa");
debug("not work???");

import _ from "lodash";

export default {
  name: "PackageList",
  data() {
    return {
      loading: false,
      fields: ["name", "version", "desc", "downloads"],
      packages: [],
      matchingPackages: [],
      q: "",
      pageNumber: 1,
      pageLength: 50,
    };
  },
  computed: {
    totalDownloads() {
      return _.sumBy(this.packages, "downloads").toLocaleString();
    },
    matchingPackagesForCurrentPage() {
      const start = (this.pageNumber - 1) * this.pageLength;
      const end = start + this.pageLength;
      return this.matchingPackages.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.matchingPackages.length / this.pageLength);
    },
  },
  watch: {
    q() {
      this.debouncedSearchPackages();
    },
  },
  methods: {
    searchPackages() {
      const start = new Date();
      console.log(`Searching for "${this.q}" ...`);

      const q = this.q;
      if (q === "" || q.trim() === "") {
        this.matchingPackages = this.packages;
      } else {
        const terms = q.trim().toLowerCase().split(/\s+/);
        this.matchingPackages = this.packages.filter((p) => {
          return _.every(
            terms,
            (t) =>
              p.name.toLowerCase().includes(t) ||
              p.desc.toLowerCase().includes(t)
          );
        });
      }

      console.log(`Searching for "${this.q}" ...done in ${new Date() - start}`);
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
        this.searchPackages();
        this.debouncedSearchPackages = _.debounce(this.searchPackages, 150);
        this.loading = false;
      });
  },
};
</script>

<style scoped>
.loading {
  margin-top: 40vh;
}

.total-downloads {
  font-size: 65%;
  color: #666;
}

.search-result-tip {
  color: #666;
}

ul.nav-page {
  list-style: none;
  margin: 2em 0;
  display: flex;
  flex-wrap: wrap;
}
</style>