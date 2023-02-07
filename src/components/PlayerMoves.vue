<script setup lang="ts">
import { computed, ref } from 'vue';

import { useMoveTokenStore } from '@/stores-v2/move-token.store';
import { usePlayerMovesStore } from '@/stores-v2/player-moves.store';
import { usePlayState } from '@/stores-v2/states/use-play-state';
import { useMoveDetail } from "@/composables/use-move-details";

const playState = usePlayState();
const moveToken = useMoveTokenStore();
const playerMoves = usePlayerMovesStore();

const withDetails = ref<number[]>([]);
</script>

<template>
    <div>
        <h4 class="font-semibold">your score</h4>
    </div>
    <div class="relative h-full">
        <h4  class="font-semibold">moves</h4>
        <ul class="space-y-2 absolute overflow-scroll h-full w-full">
            <li
                v-if="playState.currentMove"
                class="text-sm flex items-center space-x-1 px-2 py-1  rounded border border-slate-300 text-slate-600"
            >
                <span class="font-semibold">{{ playState.currentMove.kind.split("_").join(" ") }}</span>
                <span>for</span>
                <span class="font-semibold">
                    {{ playState.currentMove.costDisplay }}
                </span>
            </li>
            <li
                v-for="move, i in playerMoves.committedMovesDetails"
                :key="i"
                class="text-sm flex items-center space-x-1 px-2 py-1 bg-slate-200 rounded border border-slate-600"
            >
                <span class="font-semibold">{{ move.kind.split("_").join(" ") }}</span>
                <span>for</span>
                <span class="font-semibold">
                    {{ move.costDisplay }}
                </span>
            </li>
        </ul>
    </div>
</template>