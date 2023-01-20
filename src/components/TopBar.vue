<script setup lang="ts">
import { PLAYER_COLOR_OPTIONS } from '@/stores/data-store-types';

import { usePlayerStore } from "@/stores/player-store";

const playerStore = usePlayerStore();

</script>

<template>
    <div class="flex justify-between items-center">
        <h1>Hi</h1>
        <ul class="flex space-x-4">
            <li v-for="player, i in playerStore.players" :key="player.id">
                <button
                    class="button button-dense button-outline mb-1 flex items-center space-x-1 w-full"
                    @click="() => playerStore.setViewedPlayer(i)"
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
                    v-if="player.id === playerStore.viewedPlayer.id"
                    class="border-2 rounded-full border-slate-900 "
                ></div>
            </li>
        </ul>
    </div>
</template>
