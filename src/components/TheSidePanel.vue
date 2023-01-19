<script setup lang="ts">
import { useGameDataStore } from '@/stores/game-data-store';
import { useGameStateStore } from '@/stores/game-state-store';
import { PLAYER_COLOR_OPTIONS } from '@/stores/data-store-types';
import TokenReserve from './TokenReserve.vue';
import { ref, computed } from 'vue';

const gameData = useGameDataStore();
const gameState = useGameStateStore();

const viewedPlayerIndex = ref(0);

const viewedPlayer = computed(() => {
    if (gameData.players.length) {
        const player = gameData.players[viewedPlayerIndex.value];
        return {
            id: player.id,
        }
    }
    return null;
});

</script>

<template>
    <div class="bg-slate-100 border border-slate-500 p-4 space-y-8 flex flex-col">
        <ul class="space-y-2">
            <li v-for="player, i in gameData.players" :key="player.id" class="flex items-center space-x-2">
                <span class="inline-block w-4 h-4 rounded-full" :class="PLAYER_COLOR_OPTIONS[player.color]"></span>
                <button class="button button-dense" @click="viewedPlayerIndex = i">
                    {{ player.name }} {{ gameData.reserveTokenIds[player.id].length }}
                </button>
            </li>
        </ul>
        <div class="flex-1 space-y-2">
            <h3 class="font-bold">Token Reserve</h3>
            <div v-if="viewedPlayer">
                <TokenReserve :playerId="viewedPlayer.id" />
            </div>
        </div>

    </div>
</template>