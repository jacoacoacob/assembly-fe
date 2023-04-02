import { createRouter, createWebHistory, type RouteParams, type RouterLinkProps } from "vue-router";

import CreateAccountPage from "@/views/v2/CreateAccountPage.vue";
import HomePage from "@/views/v2/HomePage.vue";
import LoginPage from "@/views/v2/LoginPage.vue";
import ManageAccountPage from "@/views/v2/ManageAccountPage.vue";

interface Breadcrumb {
    name: string | ((params: RouteParams) => string);
    to?: RouterLinkProps["to"];
}

const routerV2 = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home-page",
            component: HomePage
        },
        {
            path: "/login",
            name: "login-page",
            component: LoginPage
        },
        {
            path: "/register",
            name: "create-account-page",
            component: CreateAccountPage,
        },
        {
            path: "/account",
            name: "manage-account-page",
            component: ManageAccountPage,
        },
    ],
});

export { routerV2 }