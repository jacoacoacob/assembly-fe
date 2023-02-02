import { useGameDataStore } from "@/stores-v2/game-data.store";
import type { Token } from "@/stores-v2/game-data.types";
import { useMoveTokenStore } from "@/stores-v2/move-token.store";

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
    const gameData = useGameDataStore();
    const moveToken = useMoveTokenStore();

    function getToken(event: DragEvent): Token | undefined {
        const tokenId = event.dataTransfer?.getData("text");
        return gameData.tokens[tokenId ?? ""];
    }


    function onReserveDragEnter(event: DragEvent) {
        event.preventDefault();
    }

    function onReserveDragOver(event: DragEvent) {
        event.preventDefault();
        moveToken.hoverTile(-1);
    }

    function onReserveDrop(event: DragEvent) {
        event.preventDefault();
        const token = getToken(event);
        if (token) {
            moveToken.drop();
        }
    }

    function onTileDragEnter(event: DragEvent) {
        event.preventDefault();
        const tileIndex = getTileIndex(event);
        if (tileIndex) {
            moveToken.hoverTile(tileIndex);
        }
    }

    function onTileDragExit(event: DragEvent) {
        event.preventDefault();
        moveToken.hoverTile(null);
    }

    function onTileDragOver(event: DragEvent) {
        event.preventDefault();
    }

    function onTileDrop(event: DragEvent) {
        event.preventDefault();
        // const token = getToken(event);
        if (moveToken.isHoveredTileValidMove) {
            moveToken.drop();
        }
    }

    function onTokenDragStart(event: DragEvent) {

    }

    function onTokenDragEnd(event: DragEvent) {

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
