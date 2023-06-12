import { defineStore } from "pinia";

import { useCamera } from "../canvas/use-camera";
import { computed, ref } from "vue";


interface TileMap {
    rows: number;
    cols: number;
    tileSize: number;
    getTileIndex: (row: number, col: number) => number;
    getTileRowCol: (tileIndex: number) => [number, number];
}

function useTileMap(rows: number, cols: number, tileSize: number): TileMap {
    return {
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
    }
}

const useBoardStore = defineStore("board", () => {
    const hoveredTile = ref(-1);
    const tiles = useTileMap(6, 9, 100);
    const tilesCamera = useCamera({
        viewportX: 0,
        viewportY: 0,
        width: tiles.tileSize * tiles.cols,
        height: tiles.tileSize * tiles.rows,
        // width: tiles.tileSize * 6,
        // height: tiles.tileSize * 4,
        // canvasX: 150,
        canvasX: 1,
        canvasY: 50,
        map: tiles,
        zoom: 1,
    });

    const tileCameraFrame = computed(() => tilesCamera.frame());

    function _drawBoardTiles(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(
            tilesCamera.canvasX.value,
            tilesCamera.canvasY.value,
            tiles.tileSize * tiles.cols,
            tiles.tileSize * tiles.rows,
        );

        for (let i = 0; i < tileCameraFrame.value.length; i++) {
            const tile = tileCameraFrame.value[i];

            ctx.beginPath();
            ctx.rect(
                tilesCamera.canvasX.value + tile.cameraX,
                tilesCamera.canvasY.value + tile.cameraY,
                tile.width,
                tile.height,
            );
            const alpha = (1 / (tiles.cols * tiles.rows)) * (tile.tileIndex + 1);
            // ctx.fillStyle = `rgba(0,200,200,${alpha})`;
            // ctx.fillStyle = `rgba(0,200,100,${alpha})`;
            // ctx.fillStyle = `rgba(250,200,100,${alpha})`;
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
