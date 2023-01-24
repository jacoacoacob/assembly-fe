<script setup lang="ts">
import { useGameDataStore } from '@/stores/game-data-store';
import { useGameStateStore } from '@/stores/game-state-store';
import { PLAYER_COLOR_OPTIONS } from '@/stores/game-data-store-types';
import TokenReserve from './TokenReserve.vue';
import { usePlayersDataStore } from '@/stores/players-data-store';

const gameData = useGameDataStore();
const gameState = useGameStateStore();
const playersData = usePlayersDataStore();

</script>

<template>
    <div class="bg-slate-100 border-2 border-slate-500 p-4 space-y-8 flex flex-col" v-if="playersData.viewedPlayer">
        <div>
            <h1 class="font-bold text-xl">
                <span
                    class="inline-block w-4 h-4 rounded-full"
                    :class="PLAYER_COLOR_OPTIONS[playersData.viewedPlayer.color]"
                ></span>
                {{ playersData.viewedPlayer.name}}
            </h1>
        </div>
        <div class="flex-1 space-y-2">
            <h3 class="font-bold">Token Reserve</h3>
            <div v-if="playersData.viewedPlayer">
                <TokenReserve :playerId="playersData.viewedPlayer.id" />
            </div>
        </div>
     
    </div>
</template>