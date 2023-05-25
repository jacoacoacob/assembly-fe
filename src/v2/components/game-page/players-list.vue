<script setup lang="ts">
import { useGameStore } from '@/v2/stores/game-store';
import { useSessionStore } from '@/v2/stores/session-store';
import PlayersListItem from './players-list-item.vue';

const game = useGameStore();
</script>

<template>
    <div class="space-y-4 p-4 rounded max-w-md bg-slate-100 border border-slate-300">
        <h1 class="text-xl font-bold">Players</h1>
        <ul class="space-y-2">
            <PlayersListItem v-for="player in game.players" :player="player" />
        </ul>
    </div>
</template>