<script setup lang="ts">
import { computed, inject, type StyleValue, type Ref } from "vue";

import { useGameStore } from '@/stores/game.store';
import { PLAYER_COLOR_OPTIONS, type PlayerColor } from "@/stores/game";
import type { Player, Token } from '@/stores/game';

const props = defineProps<{ data: Token }>();

const game = useGameStore();

const activeToken = inject<Ref<string>>("board:activeToken")
const onDragStart = inject<(event: DragEvent) => void>("token:dragstart");

const style = computed((): StyleValue => {
    const { tileSize } = game.grid;
    const { tileIndex } = props.data;
    const tileContents = game.board[tileIndex];
    const tileTokenIndex = tileContents.indexOf(props.data.id);
    const left = tileSize / 4 * (tileTokenIndex % 2 === 0 ? 1 : 3) - ((tileSize / 4 - 5));
    const top = tileSize / 4 * (tileTokenIndex < 2 ? 1 : 3) - (tileSize / 4 - 5);
    return {
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
    };
});

const player = computed(() => game.players.find(player => player.id === props.data.player));

const className = computed(() => ({
    [PLAYER_COLOR_OPTIONS[player.value?.color as PlayerColor]]: true,
    "border-dashed border-slate-50": activeToken?.value === props.data.id,
}))

</script>

<template>
    <div
        :id="data.id"
        class="w-8 h-8 rounded-full border border-slate-900 flex justify-center items-center text-white"
        :class="className"
        :style="style"
        draggable="true"
        @dragstart="onDragStart"
    >
        {{ data.value }}
    </div>
</template>