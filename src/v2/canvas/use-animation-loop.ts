import type { ComputedRef } from "vue";
import { useBoardStore } from "../stores/board-store";
import type { CameraFrameTile } from "./use-camera";
import { useEntitiesStore } from "../stores/entities-store";
import { useGameStore } from "../stores/game-store";

function useAnimationLoop(_ctx: ComputedRef<CanvasRenderingContext2D | null | undefined>) {

    const game = useGameStore();
    const board = useBoardStore();
    const entities = useEntitiesStore();

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
        const [tiles] = board.tilesCamera.frame;
        
        const deferredTiles: CameraFrameTile[] = [];

        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];

            if (_isFocused(tile.tileIndex)) {
                deferredTiles.push(tile);
                continue;
            }

            _drawTile(tile);
        }

        for (let i = 0; i < deferredTiles.length; i++) {
            _drawTile(deferredTiles[i]);
        }
    }

    function _drawPlayers() {
        const ctx = _ctx.value!;

        for (let i = 0; i < entities.spriteIds.length; i++) {
            const sprite = entities.sprites[entities.spriteIds[i]];
            ctx.beginPath();
            ctx.arc(sprite.shape.x, sprite.shape.y, sprite.shape.r, 0, Math.PI * 2);
            ctx.fillStyle = "#468";
            ctx.strokeStyle = "black";
            ctx.fill();
            ctx.stroke();
            const player = game.players.find((player) => player.id === sprite.id);
            if (player) {
                const displayName = player.display_name.slice(0, 2);
                const textMeasure = ctx.measureText(displayName);
                ctx.strokeStyle = "white";
                ctx.font = "16px Arial";
                ctx.strokeText(
                    displayName,
                    sprite.shape.x - (textMeasure.width / 2),
                    sprite.shape.y + 4
                );
            }
            ctx.closePath();
        }
    }

    function _clearCanvas() {
        const ctx = _ctx.value!;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    let animationHandle: number;

    function run() {
        _clearCanvas();
        _drawBoardTiles();
        _drawPlayers();
        animationHandle = window.requestAnimationFrame(run);
    }

    function stop() {
        window.cancelAnimationFrame(animationHandle);
    }

    return { run, stop };
}

export { useAnimationLoop };
