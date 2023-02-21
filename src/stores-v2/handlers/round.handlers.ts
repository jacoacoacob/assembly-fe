import { eventHandlers } from "@/utils/event-handlers";
import type { Event } from "../events.types";
import { useRoundsStore } from "../rounds.store";

type E<Name extends string, Data = {}> = Event<"rounds", Name, Data>;

type RoundsEvent = E<"next">;

function roundsEventHandlers() {
    const rounds = useRoundsStore();

    return eventHandlers<"rounds", RoundsEvent>({
        next() {
            rounds.currentRound += 1;
        },
    });
}

type RoundsEventHandlers = ReturnType<typeof roundsEventHandlers>;

export { roundsEventHandlers };
export type { RoundsEvent, RoundsEventHandlers };
