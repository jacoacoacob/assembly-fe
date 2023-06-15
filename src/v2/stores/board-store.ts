import { defineStore } from "pinia";

import { useCamera } from "../canvas/use-camera";
import { reactive, ref } from "vue";
import type { Ref } from "vue";

interface TileMap {
    rows: Ref<number>;
    cols: Ref<number>;
    tileSize: Ref<number>;
    getTileIndex: (row: number, col: number) => number;
    getTileRowCol: (tileIndex: number) => [number, number];
}

function useSquareTileMap(rows: number, cols: number, tileSize?: number): TileMap {
    const _rows = ref(rows);
    const _cols = ref(cols);
    const _tileSize = ref(tileSize ?? 0);

    return {
        rows: _rows,
        cols: _cols,
        tileSize: _tileSize,
        getTileIndex(row, col) {
            return row * _cols.value + col;
        },
        getTileRowCol(tileIndex) {
            return [
                Math.floor(tileIndex / cols),
                tileIndex % _cols.value
            ];
        }
    };
}

const useBoardStore = defineStore("board", () => {
    const hoveredTile = ref(-1);
    const focusedTile = ref(-1);
    
    const tiles = useSquareTileMap(0, 0);
    const tilesCamera = useCamera({
        viewportX: 0,
        viewportY: 0,
        width: tiles.tileSize.value * tiles.cols.value,
        height: tiles.tileSize.value * tiles.rows.value,
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
export type { TileMap };
