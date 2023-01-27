<script setup lang="ts">
// import { useGameDataStore } from '@/stores/game-data-store';
// import { useGameStateStore } from '@/stores/game-state-store';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { PLAYER_COLOR_OPTIONS } from '@/stores/game-data-store-types';
import TokenReserve from './TokenReserve.vue';
// import { usePlayersDataStore } from '@/stores/players-data-store';

// const gameData = useGameDataStore();
// const gameState = useGameStateStore();
// const playersData = usePlayersDataStore();

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const players = usePlayersStore();

</script>

<template>
    <div class="bg-slate-100 border-2 border-slate-500 p-4 space-y-8 flex flex-col" v-if="players.viewedPlayer">
        <div>
            <h1 class="font-bold text-xl">
                <span
                    class="inline-block w-4 h-4 rounded-full"
                    :class="PLAYER_COLOR_OPTIONS[players.viewedPlayer.color]"
                ></span>
                {{ players.viewedPlayer.name}}
            </h1>
        </div>
        <div class="flex-1 space-y-2">
            <h3 class="font-bold">Token Reserve</h3>
            <div v-if="players.viewedPlayer">
                <TokenReserve :playerId="players.viewedPlayer.id" />
            </div>
        </div>
     
    </div>
</template>