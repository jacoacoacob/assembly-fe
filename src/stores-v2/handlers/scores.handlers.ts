import { eventHandlers } from "@/utils/event-handlers";
import { useScoresStore } from "../scores.store";
import type { Event } from "../events.types";
import type { Player } from "../game-data.types";

type E<Name extends string, Data = {}> = Event<"scores", Name, Data>;

type ScoresEvent =
    E<"set_initial_round_tile_scores", Record<Player["id"], number>> |
    E<"set_point_totals", Record<Player["id"], number>>;

function scoresEventHandlers() {
    const scores = useScoresStore();

    return eventHandlers<"scores", ScoresEvent>({
        set_point_totals(pointTotals) {
            scores.pointTotals = pointTotals;
        },
        set_initial_round_tile_scores(points) {
            scores.setRoundInitialTileScores(points);
        }
    });
}

type ScoresEventHandlers = ReturnType<typeof scoresEventHandlers>;

export { scoresEventHandlers };
export type { ScoresEvent, ScoresEventHandlers };
