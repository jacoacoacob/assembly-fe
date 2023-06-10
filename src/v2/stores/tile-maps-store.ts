import { defineStore } from "pinia";
import { useCamera } from "../canvas/use-camera";

interface TileMap {
    rows: number;
    cols: number;
    tileSize: number;
    getTileIndex: (row: number, col: number) => number;
    getTileRowCol: (tileIndex: number) => [number, number];
}

function makeTileMap(rows: number, cols: number, tileSize: number): TileMap {
    const _maxTileIndex = (rows * cols) - 1;
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

const useTileMapsStore = defineStore("tile-maps", () => {
    const boardTiles = makeTileMap(6, 9, 100);
    const boardCamera = useCamera({
        canvasX: 200,
        canvasY: 200,
        x: 0,
        y: 0,
        zoom: 2,
        width: 300,
        height: 200,
        map: boardTiles,
    });

    const tokenSupplyTiles = makeTileMap(4, 4, 40);

    return { boardCamera };
});

export { useTileMapsStore };
export type { TileMap };
