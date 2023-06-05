<script setup lang="ts">
import { useGameStore } from "../stores/game-store";
import GameSetup from "../components/game-page/game-setup.vue";

const game = useGameStore();
</script>

<template>
    <div class="w-full px-4 flex flex-col">
        <div class="flex-1">
            <GameSetup v-if="game.meta.phase === 'setup'" />
        </div>
    </div>
</template>