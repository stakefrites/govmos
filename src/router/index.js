import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/SelectChainsView.vue"),
  },
  {
    path: "/govmos",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/proposals/:network",
    name: "proposals",
    component: () => import("../views/ProposalView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
