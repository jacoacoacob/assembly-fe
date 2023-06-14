import { computed, reactive, ref, type ComputedRef, type Ref } from "vue";
import type { TileMap } from "../stores/tile-maps-store";
import { isCollision, type Circle, type Rect } from "./collision";

// pixels/second
const CAMERA_SPEED = 10;

interface CameraOptions {
    canvasX: number;
    canvasY: number;
    viewportX: number;
    viewportY: number;
    zoom: number;
    width: number,
    height: number,
    tilePadding: number;
    map: TileMap,
}

interface CameraFrameTile {
    tileIndex: number;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    cameraX: number;
    cameraY: number;
}

interface Camera {
    viewportX: Ref<number>;
    viewportY: Ref<number>;
    canvasX: Ref<number>;
    canvasY: Ref<number>;
    zoom: Ref<number>;
    width: Ref<number>;
    height: Ref<number>;
    tilePadding: Ref<number>;
    paddedTileSize: ComputedRef<number>;
    frame: ComputedRef<CameraFrameTile[]>;
    move: (delta: number, dirX: number, dirY: number) => void;
    /** Returns the tileIndex of tile in tileMap layer */
    getTileIndex: (x: number, y: number) => number;
    getFrameTile: (tileIndex: number) => CameraFrameTile | null;
    /** Resizes the camera's tileMap tileSize */
    resizeTile: (size: number) => void;
}

function useCamera(options: CameraOptions): Camera {
    const { map } = options;

    const viewportX = ref(options.viewportX);
    const viewportY = ref(options.viewportY);

    const canvasX = ref(options.canvasX);
    const canvasY = ref(options.canvasY);

    const tilePadding = ref(options.tilePadding);

    const paddedTileSize = computed(() => tilePadding.value + map.tileSize);

    const zoom = ref(options.zoom);

    const _width = ref(0);
    const _height = ref(0);

    const width = computed({
        get() {
            return _width.value;
        },
        set(value) {
            _width.value = value + tilePadding.value * map.cols
        },
    });

    const height = computed({
        get() {
            return _height.value;
        },
        set(value) {
            _height.value = value + tilePadding.value * map.rows;
        },
    });

    width.value = options.width;
    height.value = options.height;

    const maxX = computed(() =>  map.cols * paddedTileSize.value - width.value);
    const maxY = computed(() =>  map.rows * paddedTileSize.value - height.value);

    const frame = computed(() => {
        let startCol = Math.floor(viewportX.value / paddedTileSize.value);
        let startRow = Math.floor(viewportY.value / paddedTileSize.value);
        
        let endCol = Math.floor(startCol + (width.value / paddedTileSize.value));
        let endRow = Math.floor(startRow + (height.value / paddedTileSize.value));
        
        const offsetX = -viewportX.value + startCol * paddedTileSize.value;
        const offsetY = -viewportY.value + startRow * paddedTileSize.value;
        
        if (offsetX) {
            endCol += 1;
        }

        if (offsetY) {
            endRow += 1;
        }

        const tiles: CameraFrameTile[] = [];

        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                let tileWidth = map.tileSize;
                let tileHeight = map.tileSize;

                let cameraX = Math.round(
                    (col - startCol) * paddedTileSize.value + offsetX
                );

                let cameraY = Math.round(
                    (row - startRow) * paddedTileSize.value + offsetY
                );

                if (offsetX) {
                    if (col === startCol) {
                        cameraX -= offsetX;
                        tileWidth += offsetX;
                    } else if (col + 1 === endCol) {
                        cameraX -= offsetX;
                        tileWidth = offsetX;
                    }
                }

                if (offsetY) {
                    if (row === startRow) {
                        cameraY -= offsetY;
                        tileHeight += offsetY;
                    } else if (row + 1 === endRow) {
                        cameraY -= offsetY;
                        tileHeight = offsetY;
                    }
                }

                tiles.push({
                    offsetX,
                    offsetY,
                    cameraX: cameraX + tilePadding.value / 2,
                    cameraY: cameraY + tilePadding.value / 2,
                    width: tileWidth,
                    height: tileHeight,
                    tileIndex: map.getTileIndex(row, col),
                });
            }
        }

        return tiles;
    });

    const camera: Camera = {
        viewportX,
        viewportY,
        canvasX,
        canvasY,
        zoom,
        width,
        height,
        tilePadding,
        paddedTileSize,
        frame,
        move(delta, dirX, dirY) {
            const newX = viewportX.value + dirX * CAMERA_SPEED * delta;
            const newY = viewportY.value + dirY * CAMERA_SPEED * delta;
            viewportX.value = Math.max(0, Math.min(newX, maxX.value));
            viewportY.value = Math.max(0, Math.min(newY, maxY.value));
        },
        getTileIndex(x, y) {
            const cameraRect: Rect = {
                x: canvasX.value,
                y: canvasY.value,
                w: width.value,
                h: height.value,
                kind: "rect",
            };

            const point: Circle = {
                x,
                y,
                r: 0,
                kind: "circle",
            }

            if (!isCollision(cameraRect, point)) {
                return -1;
            }

            const translatedX = x + viewportX.value - canvasX.value + (tilePadding.value / 2);
            const translatedY = y + viewportY.value - canvasY.value + (tilePadding.value / 2);

            const xRemainder = translatedX % paddedTileSize.value;
            const yRemainder = translatedY % paddedTileSize.value;

            if (
                (xRemainder > 0 && xRemainder <= tilePadding.value) ||
                (yRemainder > 0 && yRemainder <= tilePadding.value) ||
                translatedX % paddedTileSize.value === 0 ||
                translatedY % paddedTileSize.value === 0
            ) {
                return -2;
            }

            const col = Math.floor(translatedX / paddedTileSize.value);
            const row = Math.floor(translatedY / paddedTileSize.value);

            return Math.floor(row * map.cols + col);
        },
        getFrameTile(tileIndex) {
            return frame.value.find((tile) => tile.tileIndex === tileIndex) ?? null;
        },
        resizeTile(size) {
            map.tileSize = size;
            width.value = map.cols * map.tileSize;
            height.value = map.rows * map.tileSize;
        },
    };

    return camera;
}

export { useCamera };
export type { Camera, CameraFrameTile };
