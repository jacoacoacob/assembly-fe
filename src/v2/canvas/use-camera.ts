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
    frame: ComputedRef<CameraFrameTile[]>;
    move: (delta: number, dirX: number, dirY: number) => void;
    /** Returns the tileIndex of tile in tileMap layer */
    getTileIndex: (x: number, y: number) => number;
    /** Resizes the camera's tileMap tileSize */
    resizeTile: (size: number) => void;
}

function useCamera(options: CameraOptions): Camera {
    const { map } = options;

    const viewportX = ref(options.viewportX);
    const viewportY = ref(options.viewportY);

    const canvasX = ref(options.canvasX);
    const canvasY = ref(options.canvasY);

    const zoom = ref(options.zoom);

    const width = ref(options.width);
    const height = ref(options.height);

    const tilePadding = ref(options.tilePadding);

    const maxX = computed(() => Math.ceil(map.cols * map.tileSize - width.value))
    const maxY = computed(() => map.rows * map.tileSize - height.value);

    const frame = computed(() => {
        let startCol = Math.floor(viewportX.value / map.tileSize);
        let startRow = Math.floor(viewportY.value / map.tileSize);
        
        let endCol = Math.floor(startCol + (width.value / map.tileSize));
        let endRow = Math.floor(startRow + (height.value / map.tileSize));
        
        const offsetX = -viewportX.value + startCol * map.tileSize;
        const offsetY = -viewportY.value + startRow * map.tileSize;
        
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
                    (col - startCol) * map.tileSize + offsetX
                );

                let cameraY = Math.round(
                    (row - startRow) * map.tileSize + offsetY
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
                    cameraX,
                    cameraY,
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

            const translatedX = x + viewportX.value - canvasX.value;
            const translatedY = y + viewportY.value - canvasY.value;
            
            if (
                translatedX % map.tileSize === 0 ||
                translatedY % map.tileSize === 0
            ) {
                return -2;
            }

            const col = Math.floor(translatedX / map.tileSize);
            const row = Math.floor(translatedY / map.tileSize);

            return Math.floor(row * map.cols + col);
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
