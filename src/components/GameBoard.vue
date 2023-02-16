<script setup lang="ts">
import { computed, inject, type StyleValue } from 'vue';
import GridTile from './GridTile.vue';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { useSeasonsStore } from "@/stores-v2/seasons.store";
import type { Season } from "@/stores-v2/seasons.store";

const gameData = useGameDataStore();
const gameState = useGameStateStore();
const seasons = useSeasonsStore();

const boardStyle = inject<{ board: StyleValue, tile: StyleValue }>("boardStyle");

const className = computed(() => ({
    "border-2": gameState.currentState === "place_tokens",
}));

const seasonColors: Record<Season, string> = {
    warm: "bg-green-200",
    cold: "bg-blue-200",
    mild: "bg-orange-200",
};

</script>

<template>
    <div
        class="relative flex flex-wrap box-content bg-slate-100 border-2 border-slate-500 select-none"
        :class="className"
        :style="boardStyle?.board"
    >   
        <div class="absolute h-full w-full">
            <div
                v-for="season, i in seasons.current"
                :key="i"
                :class="`${seasonColors[season]}`"
                class="flex-1 h-1/6"
            ></div>
        </div>
        <GridTile
            v-for="tile, i in gameData.tiles"
            :key="i"
            :tileIndex="i"
            :tile="tile"
            :style="boardStyle?.tile"
        />
    </div>
</template>