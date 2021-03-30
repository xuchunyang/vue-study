import Vue from "vue";
import VueRouter from "vue-router";
import PackageList from "../components/PackageList.vue";
import PackageDetail from "../components/PackageDetail.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "PackageList",
    component: PackageList,
    props: (route) => {
      return {
        queryFromURL: route.query.q,
        pageNumberFromURL: route.query.page,
      };
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/package/:name",
    component: PackageDetail,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
