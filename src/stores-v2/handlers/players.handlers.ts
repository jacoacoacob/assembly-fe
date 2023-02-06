import { eventHandlers } from "@/utils/event-handlers";
import type { Event } from "../events.types";
import { usePlayerMovesStore } from "../player-moves.store";
import { usePlayersStore } from "../players.store";

type E<Name extends string, Data = {}> = Event<"players", Name, Data>;

type PlayersEvent = E<"next">;

function playersEventHandlers() {
    const players = usePlayersStore();
    const playerMoves = usePlayerMovesStore();

    return eventHandlers<"players", PlayersEvent>({
        next() {
            playerMoves.committedMoves = [];
            players.nextPlayer();
        },
    });
}

type PlayersEventHandlers = ReturnType<typeof playersEventHandlers>;

export { playersEventHandlers };
export type { PlayersEvent, PlayersEventHandlers };
