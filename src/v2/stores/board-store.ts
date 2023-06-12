import { defineStore } from "pinia";

import { useCamera } from "../canvas/use-camera";


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
    const tiles = useTileMap(6, 9, 100);
    const tilesCamera = useCamera({
        x: 0,
        y: 0,
        width: tiles.tileSize * tiles.cols,
        height: tiles.tileSize * tiles.rows,
        canvasX: 150,
        canvasY: 120,
        map: tiles,
        zoom: 1,
    });

    function _drawBoardTiles(ctx: CanvasRenderingContext2D) {
        const frameTiles = tilesCamera.getFrame();

        ctx.clearRect(
            tilesCamera.canvasX.value,
            tilesCamera.canvasY.value,
            tiles.tileSize * tiles.cols,
            tiles.tileSize * tiles.rows,
        );

        for (let i = 0; i < frameTiles.length; i++) {
            const tile = frameTiles[i];

            ctx.beginPath();
            ctx.rect(
                tilesCamera.canvasX.value + tile.cameraX,
                tilesCamera.canvasY.value + tile.cameraY,
                tile.width,
                tile.height,
            );
            const alpha = (1 / ((tiles.cols * tiles.rows)) * (tile.tileIndex + 1));
            // ctx.fillStyle = `rgba(0,200,200,${alpha})`;
            // ctx.fillStyle = `rgba(0,200,100,${alpha})`;
            // ctx.fillStyle = `rgba(250,200,100,${alpha})`;
            ctx.fillStyle = "#eee"
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    function draw(ctx: CanvasRenderingContext2D) {
        _drawBoardTiles(ctx);
    }

    return { tiles, tilesCamera, draw };
});

export { useBoardStore };
