import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Token } from "./game-data.types";
import { useGameDataStore } from "./game-data.store";
import { sum } from "@/utils/sum";
import { useTokensStore } from "./tokens.store";

const useTilesStore = defineStore("tiles", () => {
    const gameData = useGameDataStore();
    const tokens = useTokensStore();

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
            if (tileTokenValues.length < 4) {
                const tileTokenValuesSum = sum(tileTokenValues)
                const draggedToken = gameData.tokens[tokens.draggedTokenId];
                if (draggedToken && draggedToken.tileIndex !== tileIndex) {
                    if (tileTokenValuesSum + draggedToken.value <= tile.capacity) {
                        accum.push(tileIndex);
                    }
                } else if (tileTokenValuesSum < tile.capacity) {
                    accum.push(tileIndex);
                }
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
