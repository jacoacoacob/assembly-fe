import { eventHandlers } from "@/utils/event-handlers";
import type { Event } from "../events.types";
import { usePlayersStore } from "../players.store";
import { useTokensStore } from "../tokens.store";

type E<Name extends string, Data = {}> = Event<"players", Name, Data>;

type PlayersEvent = E<"next">;

function playersEventHandlers() {
    const players = usePlayersStore();
    const tokens = useTokensStore();

    return eventHandlers<"players", PlayersEvent>({
        next() {
            players.nextPlayer();
            tokens.candidateTokenId = "";
        },
    });
}

type PlayersEventHandlers = ReturnType<typeof playersEventHandlers>;

export { playersEventHandlers };
export type { PlayersEvent, PlayersEventHandlers };
