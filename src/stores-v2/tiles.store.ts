import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Game, Tile, Token } from "./game-data.types";
import { useGameDataStore } from "./game-data.store";
import { useMoveTokenStore } from "./move-token.store";
import { useMoveValidationStore } from "./move-validation.store";

interface TileTokenGraphNode {
    tileTokenIds: Token["id"][];
    tileTokenValuesSum: number;
}

type TileTokenGraph = TileTokenGraphNode[];
type TileAdjacencyList = number[][];
type TileDistanceGraph = number[][];

function makeTileTokenGraph(tiles: Game["tiles"], tokens: Game["tokens"]): TileTokenGraph {
    const graph: TileTokenGraphNode[] = tiles.map(() => ({
        tileTokenIds: [],
        tileTokenValuesSum: 0,
    }));
    const tokenValues = Object.values(tokens);
    for (let i = 0; i < tokenValues.length; i++) {
        const token = tokenValues[i];
        if (token.tileIndex > -1) {
            graph[token.tileIndex].tileTokenIds.push(token.id);
            graph[token.tileIndex].tileTokenValuesSum += token.value;
        }
    }
    return graph;
}

const useTilesStore = defineStore("tiles", () => {
    const gameData = useGameDataStore();
    const moveToken = useMoveTokenStore();
    const validation = useMoveValidationStore();

    const inPlayTiles = ref<number[]>([]);



    const tileTokenGraph = computed(() => makeTileTokenGraph(gameData.tiles, gameData.tokens));

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
    });

    const tileDistanceGraph = computed((): TileDistanceGraph => {
        const { cols } = gameData.grid;
        return gameData.tiles.map((_, tileIndex, arr) => {
            const node: number[] = [];
            const tileCol = tileIndex % cols;
            const tileRow = Math.floor(tileIndex / cols);
            for (let neighbor = 0; neighbor < arr.length; neighbor++) {
                const neighborCol = neighbor % cols;
                const neighborRow = Math.floor(neighbor / cols);
                const distCols = Math.abs(tileCol - neighborCol);
                const distRows = Math.abs(tileRow - neighborRow);
                if (distRows === distCols) {
                    node[neighbor] = distRows;
                } else if (distRows > distCols) {
                    node[neighbor] = Math.abs(distRows - distCols) + distCols;
                } else if (distRows < distCols) {
                    node[neighbor] = Math.abs(distRows - distCols) + distRows;
                }
            }
            return node;
        });
    });

    const openInPlayTiles = computed(() =>
        inPlayTiles.value.reduce((accum: number[], tileIndex) => {
            const tile = gameData.tiles[tileIndex];
            const { tileTokenIds, tileTokenValuesSum } = tileTokenGraph.value[tileIndex];
            if (moveToken.candidateId) {
                if (validation.isValidMove(moveToken.candidateId, tileIndex)) {
                    accum.push(tileIndex);
                }
            } else if (tileTokenIds.length < 4 && tileTokenValuesSum < tile.capacity) {
                accum.push(tileIndex);
            }
            return accum;
        }, [])
    );

    return { openInPlayTiles, inPlayTiles, tileTokenGraph, tileAdjacencyList, tileDistanceGraph };
});

export { useTilesStore, makeTileTokenGraph };
export type { TileTokenGraph };
