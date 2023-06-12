import { computed, reactive, ref, type Ref } from "vue";
import type { TileMap } from "../stores/tile-maps-store";

// pixels/second
const CAMERA_SPEED = 10;

interface CameraOptions {
    canvasX: number;
    canvasY: number;
    x: number;
    y: number;
    zoom: number;
    width: number,
    height: number,
    map: TileMap,
}

interface Tile {
    tileIndex: number;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    cameraX: number;
    cameraY: number;
}

interface Camera {
    x: Ref<number>;
    y: Ref<number>;
    canvasX: Ref<number>;
    canvasY: Ref<number>;
    zoom: Ref<number>;
    width: Ref<number>;
    height: Ref<number>;
    move: (delta: number, dirX: number, dirY: number) => void;
    getFrame: () => Tile[];
    draw: (ctx: CanvasRenderingContext2D) => void;
}

function useCamera(options: CameraOptions): Camera {
    const { map } = options;

    const x = ref(options.x);
    const y = ref(options.y);

    const canvasX = ref(options.canvasX);
    const canvasY = ref(options.canvasY);

    const zoom = ref(options.zoom);

    const width = ref(options.width);
    const height = ref(options.height);

    const maxX = computed(() => Math.ceil(map.cols * map.tileSize - width.value))
    const maxY = computed(() => map.rows * map.tileSize - height.value);

    const camera: Camera = {
        x,
        y,
        canvasX,
        canvasY,
        zoom,
        width,
        height,
        move(delta, dirX, dirY) {
            const newX = x.value + dirX * CAMERA_SPEED * delta;
            const newY = y.value + dirY * CAMERA_SPEED * delta;
            x.value = Math.max(0, Math.min(newX, maxX.value));
            y.value = Math.max(0, Math.min(newY, maxY.value));
        },
        getFrame() {
            let startCol = Math.floor(x.value / map.tileSize);
            let startRow = Math.floor(y.value / map.tileSize);
            
            let endCol = Math.floor(startCol + (width.value / map.tileSize));
            let endRow = Math.floor(startRow + (height.value / map.tileSize));
            
            const offsetX = -x.value + startCol * map.tileSize;
            const offsetY = -y.value + startRow * map.tileSize;
            
            if (offsetX) {
                endCol += 1;
            }

            if (offsetY) {
                endRow += 1;
            }

            const tiles: Tile[] = [];

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
        },
        draw(ctx) {
            let startCol = Math.floor(x.value / map.tileSize);
            let startRow = Math.floor(y.value / map.tileSize);
            
            let endCol = Math.ceil(startCol + (width.value / map.tileSize));
            let endRow = Math.ceil(startRow + (height.value / map.tileSize));
            
            const offsetX = -x.value + startCol * map.tileSize;
            const offsetY = -y.value + startRow * map.tileSize;

            ctx.clearRect(x.value, y.value, width.value, height.value);

            if (offsetX) {
                endCol += 1;
            }

            if (offsetY) {
                endRow += 1;
            }

            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol; col <= endCol; col++) {
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
                        } else if (col === endCol) {
                            cameraX -= offsetX;
                            tileWidth = offsetX;
                        }
                    }

                    if (offsetY) {
                        if (row === startRow) {
                            cameraY -= offsetY;
                            tileHeight += offsetY;
                        } else if (row === endRow) {
                            cameraY -= offsetY;
                            tileHeight = offsetY;
                        }
                    }
 
                    ctx.beginPath();
                    ctx.rect(
                        canvasX.value + cameraX,
                        canvasY.value + cameraY,
                        tileWidth,
                        tileHeight
                    );
                    ctx.fillStyle = `rgba(0,200,200,${0.05 * row * col})`;
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        },
    };

    return camera;
}

export { useCamera };
export type { Camera };
