import { useBoardStore } from "../stores/board-store";
import type { CameraFrameTile } from "./use-camera";

function useAnimationLoop(ctx: CanvasRenderingContext2D) {

    const board = useBoardStore();

    function _isFocused(tileIndex: number) {
        return tileIndex === board.focusedTile;
    }

    function _isHovered(tileIndex: number) {
        return tileIndex === board.hoveredTile;
    }

    function _drawTile(tile: CameraFrameTile) {
        const isFocused = _isFocused(tile.tileIndex);
        const isHovered = _isHovered(tile.tileIndex);
        ctx.beginPath();
        ctx.save();
        ctx.rect(
            board.tilesCamera.canvasX + tile.cameraX,
            board.tilesCamera.canvasY + tile.cameraY,
            tile.width,
            tile.height,
        );
        ctx.fillStyle = isHovered ? "rgba(0, 200, 100, 0.2)" : "#fafafa";
        ctx.strokeStyle = isFocused ? "rgba(0, 200, 200, 1)" : "#333333";
        ctx.lineWidth = isFocused ? 4 : 1;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
        if (board.tokenTileIndex === tile.tileIndex) {
            ctx.beginPath();
            ctx.arc(
                board.tilesCamera.canvasX + tile.cameraX + (tile.width / 2),
                board.tilesCamera.canvasY + tile.cameraY + (tile.height / 2),
                board.tiles.tileSize / 3,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = "orange";
            ctx.strokeStyle = "black";
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    function _drawBoardTiles() {
        ctx.clearRect(
            board.tilesCamera.canvasX - 6,
            board.tilesCamera.canvasY - 6,
            board.tilesCamera.paddedTileSize * board.tiles.cols + 6,
            board.tilesCamera.paddedTileSize * board.tiles.rows + 6,
        );

        const deferred: CameraFrameTile[] = [];

        for (let i = 0; i < board.tilesCamera.frame.length; i++) {
            const tile = board.tilesCamera.frame[i];

            if (_isFocused(tile.tileIndex)) {
                deferred.push(tile);
                continue;
            }

            _drawTile(tile);
        }

        for (let i = 0; i < deferred.length; i++) {
            _drawTile(deferred[i]);
        }
    }

    function animate() {
        _drawBoardTiles();
        window.requestAnimationFrame(animate);
    }

    return { animate };
}

export { useAnimationLoop };
