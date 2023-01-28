<script setup lang="ts">
import { computed } from 'vue';

import TokenReserve from './TokenReserve.vue';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore, PLAYER_COLOR_OPTIONS } from '@/stores-v2/players.store';
import { useScoresStore } from '@/stores-v2/scores.store';
import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const players = usePlayersStore();
const scores = useScoresStore();
const placeTokensState = usePlaceTokensState();

const earnedPoints = computed(() => scores.earnedPoints[players.viewedPlayer.id]);
const reservePoints = computed(() => scores.reservePoints[players.viewedPlayer.id]);
const totalPoints = computed(() => earnedPoints.value + reservePoints.value);

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
    <div class="bg-slate-100 border-2 border-slate-500 p-4 space-y-6 flex flex-col" v-if="players.viewedPlayer">
        <div class="space-y-1">
            <h2 class="flex items-center space-x-1 font-bold text-xl">
                <span
                    class="inline-block w-4 h-4 rounded-full"
                    :class="PLAYER_COLOR_OPTIONS[players.viewedPlayer.color]"
                ></span>
                <span>
                    {{ players.viewedPlayer.name}}
                </span>
            </h2>
        </div>

        <div class="space-y-2">
            <h3 class="font-semibold text-lg">Reserve</h3>
            <div v-if="players.viewedPlayer">
                <TokenReserve :playerId="players.viewedPlayer.id" />
            </div>
        </div>
  
        <div class="space-y-1 flex-1">
            <h3 class="font-semibold text-lg">Points</h3>
            <div class="flex text">
                <div class="mr-4">
                    <div>Earned</div>
                    <div>Reserve</div>
                    <div class="font-semibold">Total</div>
                </div>
                <div>
                    <div>{{ earnedPoints }}</div>
                    <div>{{ reservePoints }}</div>
                    <div class="font-semibold">{{ totalPoints }}</div>
                </div>
            </div>
        </div>

        <div>
            <button class="button button-dense" @click="endTurn" :disabled="!isTurnEndable">
                end turn
            </button>
        </div>
    </div>
</template>