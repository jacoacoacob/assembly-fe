<script setup lang="ts">
import { useGameStore } from '@/v2/stores/game-store';
import { useSessionStore } from '@/v2/stores/session-store';
import PlayersListItem from './players-list-item.vue';

const game = useGameStore();
const session = useSessionStore();
</script>

<template>
    <div>
        <h1 class="text-lg font-bold">Players</h1>
        <ul class="space-y-2">
            <PlayersListItem v-for="player in game.players" :data="player" />
        </ul>
    </div>
</template>