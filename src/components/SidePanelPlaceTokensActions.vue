<script setup lang="ts">
import { computed } from 'vue';
import { useBoardDataStore } from '@/stores/board-data-store';
import { useGameDataStore } from '@/stores/game-data-store';
import { useGameStateStore } from '@/stores/game-state-store';
import { usePlayerDataStore } from '@/stores/player-data-store';
import { selectRandomFrom } from '@/utils/rand';
import { usePlaceTokensStore } from '@/stores/place-tokens-store';

const gameState = useGameStateStore();
const placeTokens = usePlaceTokensStore();
const gameData = useGameDataStore();
const boardData = useBoardDataStore();
const playerData = usePlayerDataStore();

const isTurnEndable = computed(() => {
    const candidateToken = gameData.tokens[placeTokens.candidateToken];
    return (
        Boolean(candidateToken) &&
        candidateToken.player === playerData.activePlayer.id &&
        candidateToken.tileIndex > -1
    );
});

function endTurn() {
    gameState.pushEvent("place_tokens:end_turn");
    playerData.setViewedPlayer(playerData.activePlayerIndex);
            if (!boardData.playerHasMove(playerData.activePlayer.id)) {
                gameState.pushEvent(
                    "place_tokens:add_in_play_tiles",
                    selectRandomFrom(
                        gameData.tiles
                            .map((_, i) => i)
                            .filter((i) => !placeTokens.openTiles.includes(i)),
                        2
                    )
                );
            }
}
</script>

<template>
    <button class="button button-dense" @click="endTurn" :disabled="!isTurnEndable">
        End Turn
    </button>
</template>