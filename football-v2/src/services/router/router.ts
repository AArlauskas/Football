import { RoutePaths } from "@/constants/routes";
import Login from "@/pages/login/Login.vue";
import Register from "@/pages/register/Register.vue";
import Rules from "@/pages/rules/Rules.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: RoutePaths.LOGIN,
      component: Login,
    },
    {
      path: RoutePaths.REGISTER,
      component: Register,
    },
    {
      path: RoutePaths.RULES,
      component: Rules,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: RoutePaths.LOGIN,
    },
  ],
});

export { router };
