<script setup lang="ts">
import { onMounted, ref, provide, computed, watch, watchEffect, type StyleValue } from 'vue';

import GameBoard from '@/components/GameBoard.vue';
import SettingsDialog from '@/components/SettingsDialog.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import TopBar from '@/components/TopBar.vue';
import GameRules from '@/components/GameRules.vue';

import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { usePlayState } from '@/stores-v2/states/use-play-state';
import { useMoveTokenStore } from '@/stores-v2/move-token.store';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useTilesStore } from '@/stores-v2/tiles.store';
import { useKonamiCode } from "@/composables/use-konami-code";
import { useSettingsStore } from '@/stores-v2/settings.store';

const placeTokensState = usePlaceTokensState();
const gameData = useGameDataStore();
const playState = usePlayState();
const gameState = useGameStateStore();
const players = usePlayersStore();
const moveToken = useMoveTokenStore();

const konami = useKonamiCode();

const boardView = ref<"rules" | "game">("game");

provide("boardView", boardView);

provide("boardStyle", computed(() => {
    const tileMargin = 3;
    const { rows, cols, tileSize } = gameData.grid;

    const board: StyleValue = {
        width: `${cols * tileSize + (tileMargin * 2 * cols)}px`,
        height: `${rows * tileSize + (tileMargin * 2 * rows)}px`
    };

    const tile: StyleValue = {
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        margin: `${tileMargin}px`
    };

    return { board, tile };
}));

function onWindowKeydown(event: KeyboardEvent) {
    konami.recordKeyPress(event.code);
    if (boardView.value === "game") {
        const { currentState } = gameState;
        if (event.code === "Space") {
            if (currentState === "place_tokens") {
                return placeTokensState.endTurn();
            }
            if (currentState === "play") {
                switch (moveToken.canCommit) {
                    case true: return playState.commitMove();
                    case false: return playState.endTurn();
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

/*

- When a tile becomes overloaded (tokenValueSum > tileCapacity), the first player with tokens in it during
the round must either move their tokens elsewhere on the board or remove them entirely until they either
have no more tokens remaining on the tile or the tile becomes not overloaded. Removing a token from the
board because of being caught in an overloaded tile WILL NOT result in token value points back to the
player who removed it.

- During their turn, if a player's points are at or below 0, they must remove tokens from the board until
their points raise above 0 before they can end their turn. If they run out of onboard tokens before 
bringing their points above 0, they are elliminated and the game ends. Everyone loses.

- If no player gets all of their tokens onto the board before X rounds ellapse, the game ends. Everyone
loses.

*/
</script>

<template>
    <div class="px-4 xl:px-8 w-full space-x-6 flex justify-center">
        <div class="space-y-6">
            <TopBar />
            <GameBoard v-if="boardView === 'game'" />
            <GameRules v-if="boardView === 'rules'" />
        </div>
        <TheSidePanel class="flex-1 w-full" />
    </div>
    <SettingsDialog :open="konami.didKonami.value" @close="konami.reset" />
</template>