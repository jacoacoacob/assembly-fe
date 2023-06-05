import { defineStore } from "pinia";

import { lRef, lmRef } from "../composables/use-socket-ref";
import { socket } from "@/socket";

interface GamePlayer {
    id: string;
    game_id: string;
    /** the clientId of the client that created this player */
    created_by: string;
    display_name: string;
    created: string;
    updated: string;
}

interface GameHistoryEvent {
    type: string;
    data: unknown;
}

interface GameHistory {
    game_id: string;
    events: GameHistoryEvent[];
    updated: string;
}

interface GameLink {
    id: string;
    game_id: string;
    role: "guest" | "owner";
    created: string;
}

interface GameMeta {
    id: string;
    display_name: string;
    phase: "setup" | "play" | "complete";
    created: string;
    updated: string;
}

const useGameStore = defineStore("game", () => {
    const meta = lRef("game:meta", {
        display_name: "",
        id: "",
        phase: "setup",
        created: "",
        updated: "",
    });

    const history = lmRef("game_history:events", []);

    socket.on("game_history:events:append", (events) => {
        history.value.push(...events);
    });

    const historyUpdated = lRef("game_history:updated", "");

    const players = lRef("game:players", []);

    const links = lRef("game:links", []);

    return { meta, history, historyUpdated, players, links };
});

export { useGameStore };
export type { GameMeta, GamePlayer, GameHistory, GameHistoryEvent, GameLink };
