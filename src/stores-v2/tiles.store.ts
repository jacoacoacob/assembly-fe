import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Token } from "./game-data.types";
import { useGameDataStore } from "./game-data.store";

interface TileTokenGraphNode {
    tileTokenIds: Token["id"][];
    tileTokenValuesSum: number;
}

type TileAdjacencyList = number[][];
type TileDistanceGraph = number[][];

const useTilesStore = defineStore("tiles", () => {
    const gameData = useGameDataStore();

    const inPlayTiles = ref<number[]>([]);

    const tileTokenGraph = computed(() => {
        const graph: TileTokenGraphNode[] = gameData.tiles.map(() => ({
            tileTokenIds: [],
            tileTokenValuesSum: 0,
        }));
        const tokenValues = Object.values(gameData.tokens);
        for (let i = 0; i < tokenValues.length; i++) {
            const token = tokenValues[i];
            if (token.tileIndex > -1) {
                graph[token.tileIndex].tileTokenIds.push(token.id);
                graph[token.tileIndex].tileTokenValuesSum += token.value;
            }
        }
        return graph;
    });

    const tileAdjacencyList = computed((): TileAdjacencyList => {
        const { rows, cols } = gameData.grid;

        function _up(tileIndex: number | null) {
            if (typeof tileIndex === "number") {
                const up = tileIndex - cols;
                if (up > -1) {
                    return up;
                }
            }
            return null;
        }

        function _right(tileIndex: number | null) {
            if (typeof tileIndex === "number") {
                const right = tileIndex + 1;
                if (Math.floor(tileIndex / cols) === Math.floor(right / cols)) {
                    return right;
                }
            }
            return null;
        }

        function _down(tileIndex: number | null) {
            if (typeof tileIndex === "number") {
                const down = tileIndex + cols;
                if (down < rows * cols) {
                    return down;
                }
            }
            return null;
        }

        function _left(tileIndex: number | null) {
            if (typeof tileIndex === "number") {
                const left = tileIndex - 1;
                if (Math.floor(tileIndex / cols) === Math.floor(left / cols)) {
                    return left;
                }
            }
            return null;
        }

        return gameData.tiles.map((_, tileIndex) => 
            [
                _up(tileIndex),
                _up(_right(tileIndex)),
                _right(tileIndex),
                _down(_right(tileIndex)),
                _down(tileIndex),
                _down(_left(tileIndex)),
                _left(tileIndex),
                _up(_left(tileIndex))
            ].filter((neighbor) => typeof neighbor === "number") as number[]
        );
    })


    const tileDistanceGraph = computed((): TileDistanceGraph => {
        const graph: TileDistanceGraph = tileAdjacencyList.value.map(
            (_, _i, arr) => arr.map((_) => 0)
        );

        function traverse(tileIndex: number) {
            const queue = [tileIndex];
            const visited = [tileIndex];
            let distance = 1;
            while (queue.length > 0) {
                const current = queue.shift() as number;
                const neighbors = tileAdjacencyList.value[current].filter(
                    (neighbor) => !visited.includes(neighbor)
                );
                if (neighbors.length) {
                    neighbors.forEach((neighbor) => {
                        if (!visited.includes(neighbor)) {
                            visited.push(neighbor);
                            graph[tileIndex][neighbor] = distance;
                            queue.push(neighbor);
                        }
                    });
                    distance += 1;
                }
            }
        }


        traverse(0);

        console.log(graph)

        // function traverse(startTileIndex: number) {

        //     const visited: number[] = [startTileIndex];

            // function visitNeighbors(tileIndex: number, distance: number) {
            //     // if (visited.includes(tileIndex)) {
            //     //     return;
            //     // }
            //     distance += 1;
            //     tileAdjacencyList.value[tileIndex].forEach((neighbor) => {
            //         console.log({tileIndex, neighbor, distance, visited: visited.includes(neighbor)})
            //         if (!visited.includes(neighbor)) {
            //             visited.push(neighbor);
            //             graph[tileIndex][neighbor] = distance;
            //             visitNeighbors(neighbor, distance);
            //         }
            //     });
            // }
            
            // visitNeighbors(startTileIndex, 0);
        // }


        // traverse(0)

        // graph.forEach((_, tileIndex) => {
        //     traverse(tileIndex);
        // });

        return graph;
    });

    const openTiles = computed(() =>
        inPlayTiles.value.reduce((accum: number[], tileIndex) => {
            const tile = gameData.tiles[tileIndex];
            const { tileTokenIds, tileTokenValuesSum } = tileTokenGraph.value[tileIndex];
            if (tileTokenIds.length < 4 && tileTokenValuesSum < tile.capacity) {
                accum.push(tileIndex);
            }
            return accum;
        }, [])
    );

    return { openTiles, inPlayTiles, tileTokenGraph, tileAdjacencyList, tileDistanceGraph };
});

export { useTilesStore };
