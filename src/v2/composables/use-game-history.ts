import { reactive, watch, nextTick } from "vue";

import { lRef, lmRef } from "./use-socket-ref";
import { socket } from "@/socket";
import { useBoardStore, type PlayerPosition } from "../stores/board-store";
import { useEntitiesStore } from "../stores/entities-store";
import type { Circle, Entity } from "../canvas/types";
import { usePositioning } from "./use-positioning";


interface GameHistoryEvents {
    // "start_game:tile_map_dimensions": [number, number];
    // "start_game:player_positions": PlayerPosition[];
    "start_game": {
        playerPositions: PlayerPosition[];
        tileMapDimensions: [number, number];
    }
}

type GameHistoryEventHandler<Type extends keyof GameHistoryEvents> = (data: GameHistoryEvents[Type]) => void;

type Handlers = {
    [Type in keyof GameHistoryEvents as Type]: GameHistoryEventHandler<Type>;
}

function useGameHistory() {
    const board = useBoardStore();
    const entities = useEntitiesStore();

    const positioning = usePositioning();

    const handlers: Handlers = {
        "start_game": ({ playerPositions, tileMapDimensions }) => {
            const [rows, cols] = tileMapDimensions;
            board.tiles.rows = rows;
            board.tiles.cols = cols;
            entities.sprites = playerPositions.reduce(
                (accum: Record<string, Entity<Circle>>, { playerId, tileIndex }) => {
                    accum[playerId] = {
                        // tileIndex,
                        tileIndex: 0,
                        id: playerId,
                        fillStyle: "",
                        strokeStyle: "",
                        shape: {
                            kind: "circle",
                            x: 0,
                            y: 0,
                            r: 0,
                        },
                    };
                    return accum;
                },
                {}
            );
            nextTick(() => {
                positioning.organizeTiles();
            });
        },

        // "start_game:player_positions": (playerPositions) => {
        //     console.log("Hhhiii", playerPositions.map(({ tileIndex }) => tileIndex))
        //     entities.sprites = playerPositions.reduce(
        //         (accum: Record<string, Entity<Circle>>, { playerId, tileIndex }) => {
        //             const sprite: Entity<Circle> = {
        //                 tileIndex,
        //                 id: playerId,
        //                 fillStyle: "",
        //                 strokeStyle: "",
        //                 shape: {
        //                     kind: "circle",
        //                     x: 0,
        //                     y: 0,
        //                     r: 0,
        //                 },
        //             };

        //             positioning.snapToTile(sprite, tileIndex);                    

        //             return accum;
        //         },
        //         {}
        //     );
        // },
        // "start_game:tile_map_dimensions": ([rows, cols]) => {
        //     board.tiles.rows = rows;
        //     board.tiles.cols = cols;
        // },
    };

    const events = lmRef("game_history:events", []);
    const updated = lRef("game_history:updated", "");

    socket.on("game_history:events:append", (appendedEvents) => {
        events.value.push(...appendedEvents);
    });

    watch(events, (current, old) => {
        const diff = current.length - old.length;
        for (
            let i = current.length - diff;
            i < diff;
            i++
        ) {
            handlers[current[i].type](current[i].data as any);
        }
    });

    return reactive({ events, updated });
}

export { useGameHistory };
export type { GameHistoryEvents };
