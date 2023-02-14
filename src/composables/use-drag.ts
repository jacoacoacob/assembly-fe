import { useGameDataStore } from "@/stores-v2/game-data.store";
import type { Token } from "@/stores-v2/game-data.types";
import { useGameStateStore } from "@/stores-v2/game-state.store";
import { useMoveTokenStore } from "@/stores-v2/move-token.store";
import { usePlaceTokensState } from "@/stores-v2/states/use-place-tokens-state";
import { usePlayState } from "@/stores-v2/states/use-play-state";
import { useTilesStore } from "@/stores-v2/tiles.store";

function getTileIndex(event: DragEvent) {
    let current = event.target as HTMLElement;
    while (current.parentElement) {
        if (current.dataset.tileIndex) {
            return Number.parseInt(current.dataset.tileIndex);
        }
        current = current.parentElement;
    }
    return null;
}

function useDrag() {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const moveToken = useMoveTokenStore();
    const tiles = useTilesStore();

    const placeTokensState = usePlaceTokensState();
    const playState = usePlayState();

    function getToken(event: DragEvent): Token | undefined {
        const tokenId = event.dataTransfer?.getData("text");
        return gameData.tokens[tokenId ?? ""];
    }

    function onReserveDragEnter(event: DragEvent) {
        event.preventDefault();
    }

    function onReserveDragOver(event: DragEvent) {
        event.preventDefault();
        moveToken.hoveredTileIndex = -1;
    }

    function onReserveDrop(event: DragEvent) {
        event.preventDefault();
        const token = getToken(event);
        if (token) {
            switch (gameState.currentState) {
                case "place_tokens": return placeTokensState.dropToken();
                case "play": return playState.dropToken();
            }
        }
    }

    function onTileDragEnter(event: DragEvent) {
        event.preventDefault();
        const tileIndex = getTileIndex(event);
        if (typeof tileIndex === "number") {
            moveToken.hoveredTileIndex = tileIndex;
        }
    }

    function onTileDragExit(event: DragEvent) {
        event.preventDefault();
        moveToken.hoveredTileIndex = null;
    }

    function onTileDragOver(event: DragEvent) {
        event.preventDefault();
    }

    function onTileDrop(event: DragEvent) {
        const hoveredTileIndex = moveToken.hoveredTileIndex ?? 0
        if (hoveredTileIndex > -1 && !tiles.inPlayTiles.includes(hoveredTileIndex)) {
            return;
        }
        event.preventDefault();
        switch (gameState.currentState) {
            case "place_tokens": return placeTokensState.dropToken();
            case "play": return playState.dropToken();
        }
    }

    function onTokenDragStart(event: DragEvent) {
        const tokenId = (event.target as HTMLElement).id;
        event.dataTransfer?.setData("text", tokenId);
        switch (gameState.currentState) {
            case "place_tokens": return placeTokensState.pickupToken(tokenId);
            case "play": return playState.pickupToken(tokenId);
        }
    }

    function onTokenDragEnd(event: DragEvent) {
        // ... moveToken.candidateId = ""; ? ? ?
    }

    return {
        onReserveDragEnter,
        onReserveDragOver,
        onReserveDrop,
        onTileDragEnter,
        onTileDragExit,
        onTileDragOver,
        onTileDrop,
        onTokenDragEnd,
        onTokenDragStart,
    };
}

export { useDrag };
