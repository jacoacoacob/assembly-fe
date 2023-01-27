<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

import { listGames } from "@/api/game-api";

const games = ref<string[]>([]);

onMounted(() => {
    games.value = listGames();
});
</script>

<template>
    <h1 class="font-bold text-2xl">Saved Games</h1>
    <ul>
        <li v-for="gameName in games">
            <RouterLink :to="{ name: 'game', params: { name: gameName }}" class="">
                {{ gameName }}
            </RouterLink>
        </li>
    </ul>
</template>
