<script setup lang="ts">
import { provide, onMounted } from 'vue';

import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import TopBar from '@/components/TopBar.vue';

import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { useTokensStore } from '@/stores-v2/tokens.store';
import { useEventsStore } from '@/stores-v2/events.store';
import { useTilesStore } from '@/stores-v2/tiles.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { usePlayState } from '@/stores-v2/states/use-play-state';

const gameData = useGameDataStore();
const placeTokensState = usePlaceTokensState();
const playState = usePlayState();
const gameState = useGameStateStore();
const events = useEventsStore();
const tokens = useTokensStore();
const tiles = useTilesStore();
const players = usePlayersStore();


provide("token:dragstart", (event: DragEvent) => {
    const tokenId = (event.target as HTMLDivElement).id;
    if (event.dataTransfer) {
        event.dataTransfer.setData("text", tokenId);
        if (gameState.currentState === "place_tokens") {
            placeTokensState.startMove(tokenId);
        }
        if (gameState.currentState === "play") {
            
        }
        tokens.draggedTokenId = tokenId;
    }
});

provide("token:dragend", (event: DragEvent) => {
    const tokenId = event.dataTransfer?.getData("text");
    const token = gameData.tokens[tokenId ?? ""];
    if (
        token &&
        token.tileIndex === -1 &&
        tokens.candidateTokenId === token.id
    ) {
        events.send("tokens:set_candidate_token_id", "");
    }
    tokens.draggedTokenId = "";
});

function findTileIndex(element: HTMLElement) {
    let current = element;
    while (current.parentElement) {
        if (current.dataset.tileIndex) {
            return Number.parseInt(current.dataset.tileIndex);
        }
        current = current.parentElement;
    }
    return null;
}


provide("tile:dragexit", (event: DragEvent) => {
    event.preventDefault();
    tiles.candidateTileIndex = -1;
});

provide("tile:dragenter", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target);
    if (tileIndex) {
        tiles.candidateTileIndex = tileIndex;
    }
});

provide("tile:dragover", (event: DragEvent) => {
    event.preventDefault();
});

provide("tile:drop", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target);
    const tokenId = event.dataTransfer?.getData("text");
    if (typeof tileIndex === "number" && tokenId && tiles.isValidMove(tileIndex, tokenId)) {
        if (gameState.currentState === "place_tokens") {
            placeTokensState.endMove(tokenId, tileIndex);
        }
    }
    tiles.candidateTileIndex = -1;
});

function onWindowKeydown(event: KeyboardEvent) {
    if (event.code === "Space") {
        if (gameState.currentState === "place_tokens") {
            if (placeTokensState.isTurnEndable) {
                placeTokensState.endTurn();
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
    <div class="px-8 w-full space-y-4">
        <TopBar />
        <div class="flex space-x-8">
            <TheBoard />
            <TheSidePanel class="flex-1 w-full" />
        </div>
        <p class="flex-1">
            <!-- Move a token from your reserve to an open tile on the board. -->
        </p>
    </div>
</template>