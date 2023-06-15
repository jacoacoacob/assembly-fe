import { defineStore } from "pinia";

import { lRef } from "../composables/use-socket-ref";
import { useGameHistory, type GameHistoryEvents } from "../composables/use-game-history";

interface GamePlayer {
    id: string;
    game_id: string;
    /** the clientId of the client that created this player */
    created_by: string;
    display_name: string;
    created: string;
    updated: string;
}


interface GameHistoryEvent<Type extends keyof GameHistoryEvents> {
    type: Type;
    data: GameHistoryEvents[Type];
    meta: [
        string | null, // clientId
        string | null, // playerId
        number         // serverTimestamp
    ];
}

interface GameHistory {
    game_id: string;
    events: GameHistoryEvent<keyof GameHistoryEvents>[];
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

    const history = useGameHistory();

    const players = lRef("game:players", []);

    const links = lRef("game:links", []);

    return { meta, history, players, links };
});

export { useGameStore };
export type { GameMeta, GamePlayer, GameHistory, GameHistoryEvent, GameLink };
