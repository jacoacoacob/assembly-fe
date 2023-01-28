<script setup lang="ts">
import { computed } from 'vue';

import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { PLAYER_COLOR_OPTIONS } from '@/stores/game-data-store-types';

const gameData = useGameDataStore();
const gameState = useGameStateStore();
const players = usePlayersStore();
const placeTokensState = usePlaceTokensState();

const isTurnEndable = computed(() => {
    switch (gameState.currentState) {
        case "new_game": return true;
        case "play": return true;
        case "place_tokens": return placeTokensState.isTurnEndable;
    }
});

function endTurn() {
    switch (gameState.currentState) {
        case "new_game": return;
        case "place_tokens": return placeTokensState.endTurn();
        case "play": return;
    }
}

</script>

<template>
    <div class="flex justify-between items-center">
        <div class="space-x-4">
            <button class="button button-dense" @click="endTurn" :disabled="!isTurnEndable">
                End Turn
            </button>
        </div>
        <ul class="flex space-x-4">
            <li v-for="player, i in gameData.players" :key="player.id">
                <button
                    class="button button-dense button-outline mb-1 flex items-center space-x-1 w-full"
                    :class="{ 'ring ring-slate-800 font-bold': i === players.activePlayerIndex }"
                    @click="() => players.setViewedPlayer(i)"
                >
                    <span
                        class="w-4 h-4 rounded-full"
                        :class="PLAYER_COLOR_OPTIONS[player.color]"
                    ></span>
                    <span>
                        {{ player.name }}
                    </span>
                </button>
                <div
                    v-if="player.id === players.viewedPlayer.id"
                    class="border-2 rounded-full border-slate-900 "
                ></div>
            </li>
        </ul>
    </div>
</template>
