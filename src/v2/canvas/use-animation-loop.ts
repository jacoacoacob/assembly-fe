import type { ComputedRef } from "vue";
import { useBoardStore } from "../stores/board-store";
import type { CameraFrameTile } from "./use-camera";

function useAnimationLoop(_ctx: ComputedRef<CanvasRenderingContext2D | null | undefined>) {

    const board = useBoardStore();

    function _isFocused(tileIndex: number) {
        return tileIndex === board.focusedTile;
    }

    function _isHovered(tileIndex: number) {
        return tileIndex === board.hoveredTile;
    }

    function _drawTile(tile: CameraFrameTile) {
        const ctx = _ctx.value!;
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
    }

    function _drawBoardTiles() {
        const ctx = _ctx.value!;
        ctx.clearRect(
            board.tilesCamera.canvasX - 6,
            board.tilesCamera.canvasY - 6,
            board.tilesCamera.paddedTileSize * board.tiles.cols + 6,
            board.tilesCamera.paddedTileSize * board.tiles.rows + 6,
        );

        const deferred: CameraFrameTile[] = [];

        // console.log(board.tilesCamera.frame.map((tile) => tile.tileIndex))

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

    let animationHandle: number;

    function run() {
        _drawBoardTiles();
        animationHandle = window.requestAnimationFrame(run);
    }

    function stop() {
        window.cancelAnimationFrame(animationHandle);
    }

    return { run, stop };
}

export { useAnimationLoop };
