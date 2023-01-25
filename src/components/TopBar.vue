<script setup lang="ts">
import { usePlaceTokensActions } from '@/composables/use-place-tokens-actions';
import { useGameDataStore } from '@/stores/game-data-store';
import { PLAYER_COLOR_OPTIONS } from '@/stores/game-data-store-types';
import { useGameStateStore } from '@/stores/game-state-store';
import { usePlaceTokensStore } from '@/stores/place-tokens-store';

import { usePlayersDataStore } from "@/stores/players-data-store";
import { computed } from 'vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const playersData = usePlayersDataStore();

const placeTokens = usePlaceTokensStore();
const placeTokensActions = usePlaceTokensActions();

const isTurnEndable = computed(() => {
    switch (gameState.currentState) {
        case "initial": return true;
        case "place_tokens": return placeTokens.isTurnEndable;
        case "play_game": return true;
    }
});

function endTurn() {
    switch (gameState.currentState) {
        case "initial": return;
        case "play_game": return;
        case "place_tokens": return placeTokensActions.endTurn();
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
                    :class="{ 'ring ring-slate-800 font-bold': i === playersData.activePlayerIndex }"
                    @click="() => playersData.setViewedPlayer(i)"
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
                    v-if="player.id === playersData.viewedPlayer.id"
                    class="border-2 rounded-full border-slate-900 "
                ></div>
            </li>
        </ul>
    </div>
</template>
