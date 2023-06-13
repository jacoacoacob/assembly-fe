import { defineStore } from "pinia";

import { useCamera, type CameraFrameTile } from "../canvas/use-camera";
import { computed, reactive, ref } from "vue";


interface TileMap {
    rows: number;
    cols: number;
    tileSize: number;
    getTileIndex: (row: number, col: number) => number;
    getTileRowCol: (tileIndex: number) => [number, number];
}

function useTileMap(rows: number, cols: number, tileSize: number): TileMap {
    return reactive({
        rows,
        cols,
        tileSize,
        getTileIndex(row, col) {
            return row * cols + col;
        },
        getTileRowCol(tileIndex) {
            return [
                Math.floor(tileIndex / cols),
                tileIndex % cols
            ];
        }
    });
}

const useBoardStore = defineStore("board", () => {
    const hoveredTile = ref(-1);
    const focusedTile = ref(-1);
    const tiles = useTileMap(6, 9, 100);
    const tilesCamera = useCamera({
        viewportX: 0,
        viewportY: 0,
        width: tiles.tileSize * tiles.cols,
        height: tiles.tileSize * tiles.rows,
        tilePadding: 8,
        canvasX: 1,
        canvasY: 50,
        map: tiles,
        zoom: 1,
    });

    function _isFocused(tileIndex: number) {
        return tileIndex === focusedTile.value;
    }

    function _isHovered(tileIndex: number) {
        return tileIndex === hoveredTile.value;
    }

    function _drawTile(ctx: CanvasRenderingContext2D, tile: CameraFrameTile) {
        const isFocused = _isFocused(tile.tileIndex);
        const isHovered = _isHovered(tile.tileIndex);
        ctx.beginPath();
        ctx.rect(
            tilesCamera.canvasX.value + tile.cameraX,
            tilesCamera.canvasY.value + tile.cameraY,
            tile.width,
            tile.height,
        );
        ctx.fillStyle = isHovered ? "#aaccff" : "#eeeeee";
        ctx.strokeStyle = isFocused ? "blue" : "black";
        ctx.lineWidth = isFocused ? 4 : 1;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    function _drawBoardTiles(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(
            tilesCamera.canvasX.value - 4,
            tilesCamera.canvasY.value - 4,
            tiles.tileSize * tiles.cols + 6,
            tiles.tileSize * tiles.rows + 6,
        );

        const deferred: CameraFrameTile[] = [];

        for (let i = 0; i < tilesCamera.frame.value.length; i++) {
            const tile = tilesCamera.frame.value[i];

            if (_isFocused(tile.tileIndex)) {
                deferred.push(tile);
                continue;
            }

            _drawTile(ctx, tile);
        }

        for (let i = 0; i < deferred.length; i++) {
            _drawTile(ctx, deferred[i]);
        }
    }

    function draw(ctx: CanvasRenderingContext2D) {
        _drawBoardTiles(ctx);
    }

    return {
        tiles,
        tilesCamera,
        draw,
        hoveredTile,
        focusedTile,
    };
});

export { useBoardStore };
