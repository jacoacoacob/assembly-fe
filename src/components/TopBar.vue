<script setup lang="ts">
import { PLAYER_COLOR_OPTIONS } from '@/stores/game-data-store-types';

import { usePlayerDataStore } from "@/stores/player-data-store";

const playerData = usePlayerDataStore();

</script>

<template>
    <div class="flex justify-between items-center">
        <button class="button button-dense" title="help">
            ?
        </button>
        <ul class="flex space-x-4">
            <li v-for="player, i in playerData.players" :key="player.id">
                <button
                    class="button button-dense button-outline mb-1 flex items-center space-x-1 w-full"
                    :class="{ 'ring ring-slate-800 font-bold': i === playerData.activePlayerIndex }"
                    @click="() => playerData.setViewedPlayer(i)"
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
                    v-if="player.id === playerData.viewedPlayer.id"
                    class="border-2 rounded-full border-slate-900 "
                ></div>
            </li>
        </ul>
    </div>
</template>
