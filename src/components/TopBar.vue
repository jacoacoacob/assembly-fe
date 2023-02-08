<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';

import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { usePreferencesStore } from '@/stores-v2/preferences.store';
import { usePlayState } from '@/stores-v2/states/use-play-state';
import { useMoveTokenStore } from '@/stores-v2/move-token.store';

const gameState = useGameStateStore();
const placeTokensState = usePlaceTokensState();
const playState = usePlayState();
const moveToken = useMoveTokenStore();

const boardView = inject<Ref<"rules" | "game">>("boardView");

const isTurnEndable = computed(() => {
    switch (gameState.currentState) {
        case "new_game": return true;
        case "play": return playState.isTurnEndable;
        case "place_tokens": return placeTokensState.isTurnEndable;
    }
});

function endTurn() {
    switch (gameState.currentState) {
        case "new_game": return;
        case "place_tokens": return placeTokensState.endTurn();
        case "play": return playState.endTurn();
    }
}

function commitOrEndTurn() {
    if (moveToken.canCommit) {
        moveToken.commit();
    } else if (isTurnEndable) {
        endTurn();
    }
}
</script>

<template>
    <div class="flex justify-between items-center">
        <div class="space-x-2">
            <button
                class="button button-dense button-text"
                :class="{
                    'bg-slate-900 text-white': boardView === 'game',
                }"
                @click="boardView = 'game'"
            >
                Board
            </button>
            <button
                class="button button-dense button-text"
                :class="{
                    'bg-slate-900 text-white': boardView === 'rules',
                }"
                @click="boardView = 'rules'"
            >
                Rules
            </button>

        </div>
        <div class="space-x-4">
            <button
                v-if="gameState.currentState === 'play'"
                class="button button-shadow button-dense"
                :class="{
                    'shadow-green-500 active:shadow-green-500': moveToken.canCommit,
                    'shadow-orange-400 active:shadow-orange-400': isTurnEndable,
                }"
                :disabled="(!moveToken.canCommit && !isTurnEndable) || boardView !== 'game'"
                @click="commitOrEndTurn "
            >
                <template v-if="moveToken.canCommit">
                    commit move
                    <span class="text-xs font-mono">[space]</span>
                </template>
                <template v-else-if="isTurnEndable">
                    finish turn
                    <span class="text-xs font-mono">[space]</span>
                </template>
                <template v-else>
                    make a move
                </template>
            </button>
            <button
                v-else
                class="button button-shadow button-dense"
                :disabled="!isTurnEndable || boardView !== 'game'"
                @click="endTurn"
            >
                <template v-if="isTurnEndable">
                    finish turn <span class="text-xs font-mono">[space]</span>
                </template>
                <template v-else>
                    place a token on the board
                </template>
            </button>
        </div>
    </div>
</template>

