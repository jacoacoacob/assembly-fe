<script setup lang="ts">
import { useGameStore } from '@/v2/stores/game-store';

import GLAddPlayer from "./GLAddPlayer.vue"
import PlayersListItem from "./GLPlayersListItem.vue";

const game = useGameStore();

</script>

<template>
    <div class="space-y-4 p-4 rounded max-w-md bg-slate-100 border border-slate-300">
        <h1 class="text-xl font-bold">Players</h1>
        <GLAddPlayer v-if="game.meta.phase === 'setup'" />
        <div class="flex">
            <div class="font-bold w-20">
                Claimed
            </div>
            <div class="flex-1 flex justify-between">
                <div class="font-bold">
                    Name
                </div>
                <div class="font-bold">
                    Actions
                </div>
            </div>
        </div>
        <ul class="space-y-4">
            <PlayersListItem v-for="player in game.players" :player="player" />
        </ul>
    </div>
</template>