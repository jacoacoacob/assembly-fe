 import { createRouter, createWebHistory, type RouteParams, type RouterLinkProps } from "vue-router";

import SavedGamesView from "@/views/SavedGamesView.vue";
import NewGameView from "@/views/NewGameView.vue";
import WelcomeView from "@/views/WelcomeView.vue";
import GameView from "@/views/GameView.vue";
import { loadGame, loadGameHistory } from "./api/game-api";
import { useGameStateStore } from "./stores/game-state-store";
import { useEventsStore } from "./stores-v2/events.store";

interface Breadcrumb {
    name: string | ((params: RouteParams) => string);
    to?: RouterLinkProps["to"];
}

declare module "vue-router" {
    interface RouteMeta {
        breadcrumbs: Breadcrumb[];
    }
}

const router = createRouter({
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
            path: "/new-game",
            name: "new-game",
            component: NewGameView,
            beforeEnter() {
                const gameState = useGameStateStore();
                gameState.resetState();
            },
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
                const gameHistory = loadGameHistory(to.params.name as string);
                if (gameHistory) {
                    console.log("gameHistory", gameHistory)
                    events.loadHistory(gameHistory);
                }
                // const gameState = useGameStateStore();
                // const data = loadGame(to.params.name as string);
                // if (data) {
                //     gameState.loadHistory(data.history);
                // }
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

export { router };
