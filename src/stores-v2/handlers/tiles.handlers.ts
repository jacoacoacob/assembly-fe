import { useTilesStore } from "../tiles.store";
import type { Event } from "../events.types";
import { eventHandlers } from "@/utils/event-handlers";

type E<Name extends string, Data = {}> = Event<"tiles", Name, Data>;

type TilesEvent =
    E<"record_degrading_tiles"> |
    E<"set_in_play_tiles", number[]>;

function tilesEventHandlers() {
    const tiles = useTilesStore();

    return eventHandlers<"tiles", TilesEvent>({
        set_in_play_tiles(tileIndeces) {
            tiles.inPlayTiles = tileIndeces;
        },
        record_degrading_tiles() {
            tiles.degredation.tick(
                tiles.tileTokenGraph.reduce((accum: number[], { tilePlayerIds }, tileIndex) => {
                    if (tilePlayerIds.length === 1) {
                        accum.push(tileIndex);
                    }
                    return accum;
                }, [])
            )
        }
    });
}

type TilesEventHandlers = ReturnType<typeof tilesEventHandlers>;

export { tilesEventHandlers };
export type { TilesEvent, TilesEventHandlers };
