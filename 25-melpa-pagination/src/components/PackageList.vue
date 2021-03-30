<template>
  <div class="package-list">
    <div v-if="loading">
      <div class="loading loading-lg"></div>
      <p class="my-2 text-center">{{ loading }}</p>
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
            <td v-for="(val, f) in p" :key="f">
              <router-link
                v-if="f === 'name'"
                class="btn btn-link"
                :to="`/package/${val}`"
                >{{ val }}</router-link
              >
              <span v-else> {{ val }} </span>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="nav-page">
          <li>
            <button
              :class="[
                'btn',
                'btn-action',
                pageRange.includes(1) ? 'disabled' : '',
              ]"
              @click="backwardPage"
            >
              <i class="icon icon-arrow-left"></i>
            </button>
          </li>
          <li v-for="i in pageRange" :key="i">
            <button
              :class="['btn', 'btn-action', i === pageNumber ? 'active' : '']"
              @click="pageNumber = i"
            >
              {{ i }}
            </button>
          </li>
          <li>
            <button
              :class="[
                'btn',
                'btn-action',
                pageRange.includes(totalPages) ? 'disabled' : '',
              ]"
              @click="forwardPage"
            >
              <i class="icon icon-arrow-right"></i>
            </button>
          </li>
        </ul>
      </nav>
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
  props: ["queryFromURL", "pageNumberFromURL"],
  data() {
    return {
      loading: false,
      fields: ["name", "version", "desc", "downloads"],
      packages: [],
      matchingPackages: [],
      pageNumber: this.pageNumberFromURL ? parseInt(this.pageNumberFromURL) : 1,
      pageLength: 50,
      q: this.queryFromURL || "",
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
    pageRange() {
      let start = this.pageNumber - 3;
      if (start < 1) start = 1;

      let end = this.pageNumber + 3 + (3 - (this.pageNumber - start));
      console.log(start, end);
      if (end > this.totalPages) end = this.totalPages;

      if (end - this.pageNumber < 3) {
        start -= 3 - (end - this.pageNumber);
        if (start < 1) start = 1;
      }
      return _.range(start, end + 1);
    },
  },
  watch: {
    q() {
      this.debouncedSearchPackages();
    },
  },
  methods: {
    // todo update page number
    updateURL() {
      const params = new URLSearchParams(location.search);
      if (this.q !== "") {
        params.set("q", this.q);
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${params}`
        );
      } else if (params.has("q")) {
        params.delete("q");
        if (params.toString()) {
          window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${params}`
          );
        } else {
          window.history.replaceState({}, "", `${window.location.pathname}`);
        }
      }
    },

    searchPackages(keepPageNumber = false) {
      const start = new Date();
      console.log(`Searching for "${this.q}" ...`);

      this.updateURL();

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

      // reset after each search
      if (!keepPageNumber) {
        this.pageNumber = 1;
      }

      console.log(`Searching for "${this.q}" ...done in ${new Date() - start}`);
    },
    _forwardPage(n = 1) {
      this.pageNumber += n * 7;
      if (this.pageNumber < 1) this.pageNumber = 1;
      if (this.pageNumber > this.totalPages) this.pageNumber = this.totalPages;
    },
    forwardPage() {
      this._forwardPage();
    },
    backwardPage() {
      this._forwardPage(-1);
    },
  },
  created() {
    // debug not work
    debug("PackageList created");
    console.log("PackageList created");

    console.log("route = ", this.$route);
    console.log(this["iq"]);

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
        this.searchPackages(true);
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

nav {
  display: flex;
  align-items: center;
  justify-content: center;
}

ul.nav-page {
  list-style: none;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}
</style>
