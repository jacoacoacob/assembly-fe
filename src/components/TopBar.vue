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
const prefs = usePreferencesStore();
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
                class="button button-dense"
                :disabled="(typeof moveToken.candidateDestTileIndex !== 'number') || boardView !== 'game'"
                @click="playState.commitMove"
            >
                commit move <span class="text-xs font-mono">[enter]</span>
            </button>
            <button
                class="button button-dense"
                :disabled="!isTurnEndable || boardView !== 'game'"
                @click="endTurn"
            >
                end turn <span class="text-xs font-mono">[space]</span>
            </button>
        </div>
    </div>
</template>

