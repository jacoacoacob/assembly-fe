import { reactive, watch } from "vue";

import { lRef, lmRef } from "./use-socket-ref";
import { socket } from "@/socket";
import { useBoardStore } from "../stores/board-store";

interface GameHistoryEvents {
    "start_game:tiles": [number, number];
    "start_game:players": { playerId: string; tileIndex: number }[];
}

type GameHistoryEventHandler<Type extends keyof GameHistoryEvents> = (data: GameHistoryEvents[Type]) => void;

type Handlers = {
    [Type in keyof GameHistoryEvents as Type]: GameHistoryEventHandler<Type>;
}

function useGameHistory() {
    const board = useBoardStore();

    const handlers: Handlers = {
        "start_game:players": (data) => {
            console.log(data);
        },
        "start_game:tiles": ([rows, cols]) => {
            board.tiles.rows = rows;
            board.tiles.cols = cols;
        },
    };

    const events = lmRef("game_history:events", []);
    const updated = lRef("game_history:updated", "");

    socket.on("game_history:events:append", (appendedEvents) => {
        events.value.push(...appendedEvents);
    });

    watch(events, (current, old) => {
        const diff = current.length - old.length;
        for (
            let i = current.length - diff;
            i < diff;
            i++
        ) {
            handlers[current[i].type](current[i].data as any);
        }
    });

    return reactive({ events, updated });
}

export { useGameHistory };
export type { GameHistoryEvents };
