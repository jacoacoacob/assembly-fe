<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

import { listGames } from "@/api/game-api";
import type { GameList } from "@/api/game-api";

const games = ref<GameList>([]);

onMounted(() => {
    games.value = listGames().sort((a, b) => {
        const aUpdated =  new Date(a.ts_updated);
        const bUpdated = new Date(b.ts_updated);
        if (aUpdated > bUpdated) return -1;
        if (aUpdated < bUpdated) return 1;
        return 0;
    });
});
</script>

<template>
    <h1 class="font-bold text-2xl">Saved Games</h1>
    <ul>
        <li v-for="game in games">
            <RouterLink :to="{ name: 'game', params: { name: game.name }}" class="">
                {{ game.name }}
            </RouterLink>
        </li>
    </ul>
</template>
