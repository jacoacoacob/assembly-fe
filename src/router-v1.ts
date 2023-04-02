 import { createRouter, createWebHistory, type RouteParams, type RouterLinkProps } from "vue-router";

import SavedGamesView from "@/views/v1/SavedGamesView.vue";
import NewGameView from "@/views/v1/NewGameView.vue";
import WelcomeView from "@/views/v1/WelcomeView.vue";
import GameView from "@/views/v1/GameView.vue";
import ChatView from "@/views/v1/ChatView.vue";
import { loadGameHistory } from "./api/game-api";
import { useEventsStore } from "./stores-v2/events.store";
import { useSettingsStore } from "./stores-v2/settings.store";
import { useResetGame } from "./composables/use-reset-game";

interface Breadcrumb {
    name: string | ((params: RouteParams) => string);
    to?: RouterLinkProps["to"];
}

declare module "vue-router" {
    interface RouteMeta {
        breadcrumbs: Breadcrumb[];
    }
}

const routerV1 = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "welcome",
            component: WelcomeView,
            meta: {
                breadcrumbs: [
                    {
                        name: "Home"
                    }
                ]
            }
        },
        {
            path: "/chat",
            name: "chat",
            component: ChatView,
        },
        {
            path: "/new-game",
            name: "new-game",
            component: NewGameView,
            meta: {
                breadcrumbs: [
                    {
                        name: "Home",
                        to: "/"
                    },
                    {
                        name: "New Game"
                    },
                ]
            }
        },
        {
            path: "/saved-games",
            name: "saved-games",
            component: SavedGamesView,
            meta: {
                breadcrumbs: [
                    {
                        name: "Home",
                        to: "/"
                    },
                    {
                        name: "Saved Games"
                    },
                ]
            }
        },
        {
            path: "/game/:name?",
            name: "game",
            component: GameView,
            beforeEnter(to) {
                const events = useEventsStore();
                const settings = useSettingsStore();

                const resetGame = useResetGame();

                resetGame();

                settings.$subscribe((_mutation, _state) => {
                    settings.save();
                });

                const gameHistory = loadGameHistory(to.params.name as string);
                if (gameHistory) {
                    events.loadHistory(gameHistory);
                    settings.load();
                }
            },
            meta: {
                breadcrumbs: [
                    {
                        name: "Home",
                        to: "/"
                    },
                    {
                        name: (params) => `Game: ${params.name}`,
                    },
                ]
            }
        }
    ],
});

export { routerV1 };
