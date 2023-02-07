import { eventHandlers } from "@/utils/event-handlers";
import type { Event } from "../events.types";
import { usePlayerMovesStore } from "../player-moves.store";
import type { CommittedMove } from "../player-moves.store";

type E<Name extends string, Data = {}> = Event<"player_moves", Name, Data>;

type PlayerMovesEvent = E<"commit", CommittedMove>;

function playerMovesEventHandlers() {
    const playerMoves = usePlayerMovesStore();

    return eventHandlers<"player_moves", PlayerMovesEvent>({
        commit(data) {
            playerMoves.committedMoves.unshift(data);
        },
    });
}

type PlayerMovesEventHandlers = ReturnType<typeof playerMovesEventHandlers>;

export { playerMovesEventHandlers };
export type { PlayerMovesEvent, PlayerMovesEventHandlers };
