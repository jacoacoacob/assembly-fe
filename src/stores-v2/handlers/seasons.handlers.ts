import { useSeasonsStore } from "../seasons.store";
import type { Event } from "../events.types";
import { eventHandlers } from "@/utils/event-handlers";

type E<Name extends string, Data = {}> = Event<"seasons", Name, Data>;

type SeasonsEvent = E<"next">;

function seasonsEventHandlers() {
    const seasons = useSeasonsStore();

    return eventHandlers<"seasons", SeasonsEvent>({
        next() {
            seasons.next();
        },
    });
}

type SeasonsEventHandlers = ReturnType<typeof seasonsEventHandlers>;

export { seasonsEventHandlers };
export type { SeasonsEvent, SeasonsEventHandlers };
