<script setup lang="ts">
import { provide, ref } from 'vue';
import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import { useGameStateStore } from '@/stores/game-state-store';
import { useBoard } from '@/composables/use-board';
import TopBar from '@/components/TopBar.vue';
import { usePlayerStore } from '@/stores/player-store';
import { useGameDataStore } from "@/stores/game-data-store";
import { useBoardSetupStore } from '@/stores/board-setup-store';
import { randFromRange } from '@/utils/rand';


const boardSetup = useBoardSetupStore();
const gameData = useGameDataStore()
const gameState = useGameStateStore();
const playerStore = usePlayerStore();

const board = useBoard();

const activeToken = ref<string>("");
const hoveredTile = ref<number>(-1);

provide("board:activeToken", activeToken);
provide("board:hoveredTile", hoveredTile);

provide("token:dragstart", (event: DragEvent) => {
    const tokenId = (event.target as HTMLDivElement).id;
    if (event.dataTransfer) {
        event.dataTransfer.setData("text", tokenId);
        activeToken.value = tokenId;
    }
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

// function isTileDroppable(tileIndex: number) {
//     return board.openTileIndices.value.includes(tileIndex);
// }

provide("board:dragleave", (event: DragEvent) => {
    event.preventDefault();
    hoveredTile.value = -1;
});

provide("tile:dragenter", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target);
    if (tileIndex && board.isTileOpen(tileIndex, activeToken.value)) {
        hoveredTile.value = tileIndex;
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
    if (typeof tileIndex === "number" && tokenId && board.isTileOpen(tileIndex, tokenId)) {
        if (gameState.currentState === "setup_board") {

            function playerHasMove() {
                const playerTokens = boardSetup.stagedTokens[playerStore.activePlayer.id]
                    .map((tokenId) => gameData.tokens[tokenId])
                    .filter((token) => token.tileIndex === -1);

                return playerTokens.some(
                    (token) => board.openTileIndices.value.some(
                        (tileIndex) => board.isTileOpen(tileIndex, token.id)
                    )
                );
            }

            gameState.pushEvent("setup_board:move_token", { tileIndex, tokenId });
            gameState.pushEvent("setup_board:end_turn");
            playerStore.setViewedPlayer(playerStore.activePlayerIndex);
            // if new active player has no open tiles available, open up a random one
            if (!playerHasMove()) {
                const indices = gameData.tiles
                    .map((_, i) => i)
                    .filter((i) => !boardSetup.openTileIndices.includes(i));
                gameState.pushEvent(
                    "setup_board:add_open_tile",
                    {
                        tileIndex: indices[randFromRange(0, indices.length)]
                    }
                )

            }
        }
    }
    activeToken.value = "";
    hoveredTile.value = -1;
});
</script>

<template>
    <div class="px-8 w-full space-y-4">
        <TopBar />
        <div class="flex space-x-8">
            <TheBoard />
            <TheSidePanel class="flex-1 w-full" />
        </div>
    </div>
</template>