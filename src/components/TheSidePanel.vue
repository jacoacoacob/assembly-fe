<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useGameDataStore } from '@/stores/game-data.store';
import { useGameStateStore } from '@/stores/game-state.store';

const gameData = useGameDataStore();
const gameState = useGameStateStore();


</script>

<template>
    <div class="bg-slate-100 border border-slate-500 p-2 space-y-2 flex flex-col">
        <div class="flex justify-end">
            <button class="button button-dense text-sm">Menu</button>
        </div>
        <div class="flex flex-1 bg-slate-300">
            
        </div>
    </div>
</template>