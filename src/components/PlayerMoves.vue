<script setup lang="ts">
import { computed } from 'vue';

import { useMoveTokenStore } from '@/stores-v2/move-token.store';
import { usePlayerMovesStore } from '@/stores-v2/player-moves.store';
import { usePlayState } from '@/stores-v2/states/use-play-state';
import { useScoresStore } from '@/stores-v2/scores.store';
import { usePlayersStore } from '@/stores-v2/players.store';

const playState = usePlayState();
const playerMoves = usePlayerMovesStore();
const scores = useScoresStore();
const players = usePlayersStore();

const currentTilePoints = computed(() => scores.liveTileScores[players.viewedPlayer.id]);
const tileScoresDelta = computed(() => scores.liveTileScoresDelta[players.viewedPlayer.id]);

const isViewingActivePlayer = computed(() => players.activePlayerIndex === players.viewedPlayerIndex);

</script>

<template>
    <div class="text-sm flex justify-between">
        <div v-if="isViewingActivePlayer">
            <div class="text-sm">tile points change</div>
            <div class="text-sm">token movment</div>
        </div>
        <div v-else>
            <div class="text-sm">Net tile points change:</div>
        </div>
        <div v-if="isViewingActivePlayer" class="text-right">
            <div class="font-semibold text-sm">
                {{ tileScoresDelta }}
            </div>
            <div class="font-semibold text-sm">
                <span v-if="scores.currentMoveCost" class="text-slate-500">
                    {{ scores.currentMoveCost }} +
                </span>
                {{ scores.committedMovesCost }}
            </div>
        </div>
        <div v-else>
            <div class="font-semibold text-sm">
                {{ tileScoresDelta }}
            </div>
        </div>
    </div>
    <div v-if="isViewingActivePlayer" class="relative h-full">
        <h4 class="font-semibold">moves</h4>
        <ul
            v-if="playerMoves.committedMoves.length > 0 || playState.currentMove && isViewingActivePlayer"
            class="space-y-2 absolute overflow-scroll h-full w-full"
        >
            <li
                v-if="playState.currentMove"
                class="text-sm flex items-center space-x-1 px-2 py-1 rounded border border-slate-300 text-slate-600"
            >
                <span class="font-semibold">{{ playState.currentMove.kind.split("_").join(" ") }}</span>
                <span>
                    (<span class="font-semibold">{{ playState.currentMove.costDisplay }}</span>)
                </span>
            </li>
            <li
                v-for="move, i in playerMoves.committedMovesDetails"
                :key="i"
                class="text-sm flex items-center space-x-1 px-2 py-1 bg-slate-200 rounded border border-slate-600"
            >
                <span class="font-semibold">{{ move.kind.split("_").join(" ") }}</span>
                <span>
                    (<span class="font-semibold">{{ move.costDisplay }}</span>)
                </span>
                <!-- <span>cost</span>
                <span class="font-semibold">
                    {{ move.costDisplay }}
                </span> -->
            </li>
        </ul>
        <p v-else class="text-sm py-1">
            nothing yet
        </p>
    </div>
</template>