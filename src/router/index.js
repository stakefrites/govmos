import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/SelectChainsView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("../views/SettingsView.vue"),
  },
  {
    path: "/proposals/:network",
    name: "proposals",
    component: () => import("../views/ProposalView.vue"),
  },
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
