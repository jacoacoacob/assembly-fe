<script setup lang="ts">
import { useGameDataStore } from '@/stores/game-data-store';
import { useGameStateStore } from '@/stores/game-state-store';
import { PLAYER_COLOR_OPTIONS } from '@/stores/data-store-types';
import TokenReserve from './TokenReserve.vue';
import { usePlayerStore } from '@/stores/player-store';
import { computed } from 'vue';

const gameData = useGameDataStore();
const playerStore = usePlayerStore();

</script>

<template>
    <div class="bg-slate-100 border border-slate-500 p-4 space-y-8 flex flex-col">
        <div>
            <h1 class="font-bold text-xl">
                <span
                    class="inline-block w-4 h-4 rounded-full"
                    :class="PLAYER_COLOR_OPTIONS[playerStore.viewedPlayer.color]"
                ></span>
                {{ playerStore.viewedPlayer.name}}
            </h1>
        </div>
        <div class="flex-1 space-y-2">
            <h3 class="font-bold">Token Reserve</h3>
            <div v-if="playerStore.viewedPlayer">
                <TokenReserve :playerId="playerStore.viewedPlayer.id" />
            </div>
        </div>
        
    </div>
</template>