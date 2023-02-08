<script setup lang="ts">
import { onMounted, ref, provide } from 'vue';

import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import TopBar from '@/components/TopBar.vue';

import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { usePlayState } from '@/stores-v2/states/use-play-state';
import TheRules from '@/components/TheRules.vue';
import { useMoveTokenStore } from '@/stores-v2/move-token.store';

const placeTokensState = usePlaceTokensState();
const playState = usePlayState();
const gameState = useGameStateStore();
const players = usePlayersStore();
const moveToken = useMoveTokenStore();

const boardView = ref<"rules" | "game">("game");

provide("boardView", boardView);

function onWindowKeydown(event: KeyboardEvent) {
    if (boardView.value === "game") {
        const { currentState } = gameState;
        if (event.code === "Space") {
            if (moveToken.canCommit) {
                switch (currentState) {
                    case "play": return playState.commitMove();
                }
            } else {
                switch (currentState) {
                    case "place_tokens": return placeTokensState.endTurn();
                    case "play": return playState.endTurn();
                }
            }
        }
    }
}

onMounted(() => {
    players.viewActivePlayer();
    window.addEventListener("keydown", onWindowKeydown);
    return () => {
        window.removeEventListener("keydown", onWindowKeydown);
    }
});

</script>

<template>
    <div class="px-8 w-full space-x-6 flex">
        <div class="space-y-6 ">
            <TopBar />
            <TheBoard v-if="boardView === 'game'" />
            <TheRules v-if="boardView === 'rules'" />
        </div>
        <TheSidePanel class="flex-1 w-full" />
    </div>
</template>