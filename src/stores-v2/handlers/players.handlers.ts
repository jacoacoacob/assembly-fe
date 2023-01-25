import { eventHandlers } from "@/utils/event-handlers";
import type { Event } from "../events.types";
import { usePlayersStore } from "../players.store";

type E<Name extends string, Data = {}> = Event<"players", Name, Data>;

type PlayersEvent = E<"next">;

function playersEventHandlers() {
    const players = usePlayersStore();

    return eventHandlers<"players", PlayersEvent>({
        next() {
            players.nextPlayer();
        },
    });
}

type PlayersEventHandlers = ReturnType<typeof playersEventHandlers>;

export { playersEventHandlers };
export type { PlayersEvent, PlayersEventHandlers };
