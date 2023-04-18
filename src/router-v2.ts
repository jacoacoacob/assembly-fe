import { createRouter, createWebHistory, type RouteParams, type RouterLinkProps } from "vue-router";

import GamePage from "@/views/v2/GamePage.vue";
import HomePage from "@/views/v2/HomePage.vue";

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
            path: "/:token",
            name: "game-page",
            component: GamePage
        },
    ],
});

export { routerV2 }