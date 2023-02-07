import { eventHandlers } from "@/utils/event-handlers";
import { useScoresStore } from "../scores.store";
import type { Event } from "../events.types";
import type { Player } from "../game-data.types";

type E<Name extends string, Data = {}> = Event<"scores", Name, Data>;

type ScoresEvent =
    E<"set_point_totals", Record<Player["id"], number>>;

function scoresEventHandlers() {
    const scores = useScoresStore();

    return eventHandlers<"scores", ScoresEvent>({
        set_point_totals(pointTotals) {
            scores.pointTotals = pointTotals;
        },
    });
}

type ScoresEventHandlers = ReturnType<typeof scoresEventHandlers>;

export { scoresEventHandlers };
export type { ScoresEvent, ScoresEventHandlers };
