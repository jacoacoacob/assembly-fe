import { defineStore } from "pinia";

import { lRef } from "../composables/use-socket-ref";

interface GamePlayer {
    id: string;
    display_name: string;
}

interface GameHistoryEvent {
    type: string;
    data: unknown;
}

interface GameMeta {
    id: string;
    display_name: string;
    phase: "setup" | "play" | "complete";
}

const useGameStore = defineStore("game", () => {
    const meta = lRef("game:meta", {
        display_name: "",
        id: "",
        phase: "setup",
    });

    const history = lRef("game:history", []);

    const players = lRef("game:players", []);

    return { meta, history, players };
});

export { useGameStore };
export type { GameMeta, GamePlayer, GameHistoryEvent };
