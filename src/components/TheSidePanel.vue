<script setup lang="ts">
import { useGameDataStore } from '@/stores/game-data-store';
import { useGameStateStore } from '@/stores/game-state-store';
import { PLAYER_COLOR_OPTIONS } from '@/stores/game-data-store-types';
import TokenReserve from './TokenReserve.vue';
import SidePanelPlaceTokensActions from './SidePanelPlaceTokensActions.vue';
import { usePlayerDataStore } from '@/stores/player-data-store';
import { computed } from 'vue';

const gameData = useGameDataStore();
const gameState = useGameStateStore();
const playerData = usePlayerDataStore();

</script>

<template>
    <div class="bg-slate-100 border-2 border-slate-500 p-4 space-y-8 flex flex-col">
        <div>
            <h1 class="font-bold text-xl">
                <span
                    class="inline-block w-4 h-4 rounded-full"
                    :class="PLAYER_COLOR_OPTIONS[playerData.viewedPlayer.color]"
                ></span>
                {{ playerData.viewedPlayer.name}}
            </h1>
        </div>
        <div class="flex-1 space-y-2">
            <h3 class="font-bold">Token Reserve</h3>
            <div v-if="playerData.viewedPlayer">
                <TokenReserve :playerId="playerData.viewedPlayer.id" />
            </div>
        </div>
        <div class="flex justify-end">
            <SidePanelPlaceTokensActions v-if="gameState.currentState === 'place_tokens'" />
            <template v-else-if="gameState.currentState === 'play_game'">
                
            </template>
        </div>
    </div>
</template>