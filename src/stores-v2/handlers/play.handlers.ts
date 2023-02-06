import { eventHandlers } from "@/utils/event-handlers";
import { usePlayState, type CommittedMove } from "../states/use-play-state";
import type { Event } from "../events.types";

type E<Name extends string, Data = {}> = Event<"play", Name, Data>;

type PlayEvent = E<"moved_token", CommittedMove>;

function playEventHandlers() {
    const playState = usePlayState();

    return eventHandlers<"play", PlayEvent>({
        moved_token(data) {
            playState.committedMoves.push(data);
        },
    });
}

type PlayEventHandlers = ReturnType<typeof playEventHandlers>;

export { playEventHandlers };
export type { PlayEvent, PlayEventHandlers };
