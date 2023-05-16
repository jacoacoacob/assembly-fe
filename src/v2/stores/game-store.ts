import { defineStore } from "pinia";
import { ref } from "vue";

import { socket } from "@/socket";

interface GamePlayer {
    id: string;
    display_name: string;
}

interface Game {
    id: string;
    display_name: string;
    phase: "setup" | "play" | "complete";
    players: GamePlayer[];
    history: { type: string; data: unknown }[];
}

function initialState(): Game {
    return {
        id: "",
        display_name: "",
        phase: "setup",
        players: [],
        history: [],
    };
}

const useGameStore = defineStore("game", {
    state: initialState,
});

export { useGameStore };
export type { Game, GamePlayer };
