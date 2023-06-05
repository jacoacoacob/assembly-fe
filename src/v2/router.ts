import { createRouter, createWebHistory, type RouteParams, type RouterLinkProps } from "vue-router";

import HomePage from "@/v2/views/HomePage.vue";
import GamePage from "@/v2/views/GamePage.vue";
import GameWaitingRoomPage from "@/v2/views/GameWaitingRoomPage.vue";
import GamePlayPage from "@/v2/views/GamePlayPage.vue";

interface Breadcrumb {
    name: string | ((params: RouteParams) => string);
    to?: RouterLinkProps["to"];
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "",
            name: "home-page",
            component: HomePage,
        },
        {
            path: "/:gameLinkId",
            component: GamePage,
            children: [
                {
                    path: "",
                    name: "waiting-room",
                    component: GameWaitingRoomPage
                },
                {
                    path: "play",
                    name: "game-play",
                    component: GamePlayPage
                }
            ]
        },
    ],
});

export { router }