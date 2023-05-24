import { defineStore } from "pinia";

import { lRef } from "../composables/use-socket-ref";
import { emitWithAck, socket } from "@/socket";

interface GamePlayer {
    id: string;
    game_id: string;
    client_id: string;
    display_name: string;
    created: string;
    updated: string;
}

interface GameHistoryEvent {
    type: string;
    data: unknown;
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

    const history = lRef("game:history", []);

    const players = lRef("game:players", []);

    async function removePlayer(playerId: string) {
        try {
            const { message  } = await emitWithAck("game:remove_player", { playerId });
            if (typeof message === "string") {
                console.log("[gameStore.removePlayer]", message);
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    return { meta, history, players, removePlayer };
});

export { useGameStore };
export type { GameMeta, GamePlayer, GameHistoryEvent };
