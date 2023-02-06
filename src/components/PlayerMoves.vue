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
    <div class="relative h-full">
        <ul class="space-y-2 absolute overflow-scroll h-full w-full">
            <li v-if="playState.currentMove" class="text-sm flex items-start space-x-4">
                <div>
                        {{ playState.currentMove.kind }}
                    </div>
                    <div>
                        {{ playState.currentMove.costDisplay }} points
                    </div>
            </li>
            <li v-for="move, i in playerMoves.committedMovesDetails" class="text-sm flex items-start space-x-4">
                <button
                    role="checkbox"
                    class="button button-dense"
                    :class="{ 'bg-cyan-200': withDetails.includes(i) }"
                    @click="withDetails.includes(i) ? withDetails.splice(withDetails.indexOf(i), 1) : withDetails.push(i)"
                >
                    ?
                </button>
                <div v-if="withDetails.includes(i)">
                    {{ move.detail }}
                </div>
                <div v-else>
                    <div>
                        {{ move.kind }}
                    </div>
                    <div>
                        {{ move.costDisplay }} points
                    </div>
                </div>

            </li>
        </ul>
    </div>
</template>