<script setup lang="ts">
import { computed, inject, type StyleValue, type Ref } from "vue";

import { useGameDataStore } from '@/stores/game-data-store';
import { PLAYER_COLOR_OPTIONS, type PlayerColor } from "@/stores/data-store-types";
import type { Player, Token } from '@/stores/data-store-types';

const props = defineProps<{ data: Token; isUnavailable?: boolean }>();

const gameData = useGameDataStore();

const activeToken = inject<Ref<string>>("board:activeToken")
const onDragStart = inject<(event: DragEvent) => void>("token:dragstart");

const style = computed((): StyleValue => {
    const { tileSize } = gameData.grid;
    const { tileIndex } = props.data;
    if (tileIndex > -1) {
        const tileContents = gameData.board[tileIndex];
        const tileTokenIndex = tileContents.indexOf(props.data.id);
        const left = tileSize / 4 * (tileTokenIndex % 2 === 0 ? 1 : 3) - ((tileSize / 4 - 5));
        const top = tileSize / 4 * (tileTokenIndex < 2 ? 1 : 3) - (tileSize / 4 - 5);
        return {
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
        };
    }
    return {}
});

const player = computed(() => gameData.players.find(player => player.id === props.data.player));

const className = computed(() => ({
    [PLAYER_COLOR_OPTIONS[player.value?.color as PlayerColor]]: true,
    "border-dashed border-slate-50": activeToken?.value === props.data.id,
    "bg-transparent text-slate-600": props.isUnavailable,
}))

</script>

<template>
    <div
        :id="data.id"
        class="w-8 h-8 rounded-full border border-slate-600 flex justify-center items-center text-white"
        :class="className"
        :style="style"
        :draggable="!isUnavailable"
        @dragstart="onDragStart"
    >
        {{ data.value }}
    </div>
</template>