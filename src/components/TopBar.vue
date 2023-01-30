<script setup lang="ts">
import { computed } from 'vue';

import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { usePreferencesStore } from '@/stores-v2/preferences.store';
import { usePlayState } from '@/stores-v2/states/use-play-state';

const gameState = useGameStateStore();
const placeTokensState = usePlaceTokensState();
const playState = usePlayState();
const prefs = usePreferencesStore();

const helpMessage = computed(() => {
    switch (gameState.currentState) {
        case "place_tokens": return placeTokensState.helpMessage;
    }
    return "";
});

const isTurnEndable = computed(() => {
    switch (gameState.currentState) {
        case "new_game": return true;
        case "play": return true;
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
                class="button button-dense button-outline"
                :class="{ 'bg-cyan-100': prefs.showHelpMessage }"
                @click="prefs.showHelpMessage = !prefs.showHelpMessage"
            >
                ?
            </button>
            <span v-if="prefs.showHelpMessage && helpMessage.length" class="rounded p-2 bg-cyan-100">
                {{ helpMessage }}
            </span>
        </div>
        <div>
            <button class="button button-dense" @click="endTurn" :disabled="!isTurnEndable">
                end turn
            </button>
        </div>
    </div>
</template>
