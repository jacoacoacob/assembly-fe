import { useTilesStore } from "../tiles.store";
import type { Event } from "../events.types";
import { eventHandlers } from "@/utils/event-handlers";

type E<Name extends string, Data = {}> = Event<"tiles", Name, Data>;

type TilesEvent =
    E<"update_degrading_tiles", number[]> |
    E<"set_in_play_tiles", number[]>;

function tilesEventHandlers() {
    const tiles = useTilesStore();

    return eventHandlers<"tiles", TilesEvent>({
        set_in_play_tiles(tileIndeces) {
            tiles.inPlayTiles = tileIndeces;
        },
        update_degrading_tiles(tileIndeces) {
            tiles.degredation.updateDegradingTiles(tileIndeces);
        }
    });
}

type TilesEventHandlers = ReturnType<typeof tilesEventHandlers>;

export { tilesEventHandlers };
export type { TilesEvent, TilesEventHandlers };
