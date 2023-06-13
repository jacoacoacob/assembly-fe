import { defineStore } from "pinia";

import { useCamera } from "../canvas/use-camera";
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
    const tiles = useTileMap(6, 9, 100);
    const tilesCamera = useCamera({
        viewportX: 0,
        viewportY: 0,
        width: tiles.tileSize * tiles.cols,
        height: tiles.tileSize * tiles.rows,
        canvasX: 1,
        canvasY: 50,
        map: tiles,
        zoom: 1,
    });

    function _drawBoardTiles(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(
            tilesCamera.canvasX.value,
            tilesCamera.canvasY.value,
            tiles.tileSize * tiles.cols,
            tiles.tileSize * tiles.rows,
        );

        for (let i = 0; i < tilesCamera.frame.value.length; i++) {
            const tile = tilesCamera.frame.value[i];

            ctx.beginPath();
            ctx.rect(
                tilesCamera.canvasX.value + tile.cameraX,
                tilesCamera.canvasY.value + tile.cameraY,
                tile.width,
                tile.height,
            );
            ctx.fillStyle = tile.tileIndex === hoveredTile.value ? "#aaccff" : "#eeeeee";
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    function draw(ctx: CanvasRenderingContext2D) {
        _drawBoardTiles(ctx);
    }

    return { tiles, tilesCamera, draw, hoveredTile };
});

export { useBoardStore };
