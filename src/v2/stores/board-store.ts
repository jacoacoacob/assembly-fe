import { defineStore } from "pinia";

import { useCamera } from "../canvas/use-camera";
import { reactive, ref } from "vue";

interface TileMap {
    rows: number;
    cols: number;
    tileSize: number;
    getTileIndex: (row: number, col: number) => number;
    getTileRowCol: (tileIndex: number) => [number, number];
}

function useSquareTileMap(rows: number, cols: number, tileSize?: number): TileMap {
    return reactive({
        rows,
        cols,
        tileSize: tileSize ?? 0,
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
    
    const tiles = useSquareTileMap(6, 9);
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

    return {
        tiles,
        tilesCamera,
        hoveredTile,
        focusedTile,
    };
});

export { useBoardStore };
