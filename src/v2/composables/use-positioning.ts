import type { Circle, Entity } from "../canvas/types";
import { useBoardStore } from "../stores/board-store";
import { useEntitiesStore } from "../stores/entities-store";

function usePositioning() {
    const board = useBoardStore();
    const entities = useEntitiesStore();

    function organizeTile(tileIndex: number) {
        const cameraFrameTile = board.tilesCamera.getFrameTile(tileIndex);
        if (cameraFrameTile) {
            let [row, col] = board.tiles.getTileRowCol(tileIndex);
            const { spriteIds } = entities.tileSpriteGraph[tileIndex];
            const { paddedTileSize } = board.tilesCamera;
            spriteIds.forEach((spriteId, i) => {
                const sprite = entities.sprites[spriteId];
                const xModifier = i % 2 === 0 ? 2 : 20;
                const yModifier = i < 2 ? 2 : 20;
                sprite.shape.r = Math.floor(board.tiles.tileSize / 5);
                sprite.shape.x = (col * paddedTileSize) + (paddedTileSize / xModifier) + board.tilesCamera.canvasX + sprite.shape.r + paddedTileSize * 0.04;
                sprite.shape.y = (row * paddedTileSize) + (paddedTileSize / yModifier) + board.tilesCamera.canvasY + sprite.shape.r + paddedTileSize * 0.04;
            });
        }
    }

    function organizeTiles() {
        for (let i = 0; i < board.tiles.rows * board.tiles.cols; i++) {
            organizeTile(i);
        }
    }

    return {
        organizeTile,
        organizeTiles,
    };
}

export { usePositioning };
