import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Token } from "./game-data.types";
import { useGameDataStore } from "./game-data.store";
import { sum } from "@/utils/sum";

const useTilesStore = defineStore("tiles", () => {
    const gameData = useGameDataStore();

    const candidateTileIndex = ref<number>(-1);

    const inPlayTiles = ref<number[]>([]);

    const tileTokenGraph = computed(() => {
        const graph: Token["id"][][] = gameData.tiles.map(() => []);
        const tokenValues = Object.values(gameData.tokens);
        for (let i = 0; i < tokenValues.length; i++) {
            const token = tokenValues[i];
            if (token.tileIndex > -1) {
                graph[token.tileIndex].push(token.id);
            }
        }
        return graph;
    })

    const openTiles = computed(() =>
        gameData.tiles.reduce((accum: number[], tile, tileIndex) => {
            const tileTokenValues = tileTokenGraph.value[tileIndex].map(
                (tokenId) => gameData.tokens[tokenId].value
            );
            if (tileTokenValues.length < 4 && sum(tileTokenValues) < tile.capacity) {
                accum.push(tileIndex);
            }
            return accum;
        }, [])
    );

    function isValidMove(tileIndex: number, tokenId: string) {
        if (openTiles.value.includes(tileIndex)) {
            const tile = gameData.tiles[tileIndex];
            const token = gameData.tokens[tokenId];
            const tileTokenValues = tileTokenGraph.value[tileIndex].map((tokenId) => gameData.tokens[tokenId].value);
            return sum(tileTokenValues) + token.value <= tile.capacity;
        }
        return false;
    }

    const openInPlayTiles = computed(() =>
        inPlayTiles.value.filter((tileIndex) => openTiles.value.includes(tileIndex))
    );

    return { openTiles, inPlayTiles, openInPlayTiles, isValidMove, tileTokenGraph, candidateTileIndex };
});

export { useTilesStore };
