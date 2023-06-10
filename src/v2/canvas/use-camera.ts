import { computed, readonly, ref, type Ref } from "vue";
import type { TileMap } from "../stores/tile-maps-store";
import type { Entity, Shape } from "./types";

// pixels/second
// const CAMERA_SPEED = 256;
const CAMERA_SPEED = 20;

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

interface Camera {
    x: Ref<number>;
    y: Ref<number>;
    zoom: Ref<number>;
    width: Ref<number>;
    height: Ref<number>;
    move: (delta: number, dirX: number, dirY: number) => void;
    draw: (ctx: CanvasRenderingContext2D) => void;
}

function useCamera(options: CameraOptions): Camera {
    const { canvasX, canvasY, map } = options;

    const x = ref(options.x);
    const y = ref(options.y);

    const zoom = ref(options.zoom);

    const width = ref(options.width);
    const height = ref(options.height);

    const maxX = map.cols * map.tileSize - width.value;
    const maxY = map.rows * map.tileSize - height.value;

    const camera: Camera = {
        x,
        y,
        zoom,
        width,
        height,
        move(delta, dirX, dirY) {
            const newX = x.value + dirX * CAMERA_SPEED * delta;
            const newY = y.value + dirY * CAMERA_SPEED * delta;
            x.value = Math.max(0, Math.min(newX, maxX));
            y.value = Math.max(0, Math.min(newY, maxY));
        },
        draw(ctx) {
            let startCol = Math.floor(x.value / map.tileSize);
            let startRow = Math.floor(y.value / map.tileSize);
            
            let endCol = Math.ceil(startCol + (width.value / map.tileSize));
            let endRow = Math.ceil(startRow + (height.value / map.tileSize));
            
            const offsetX = -x.value + startCol * map.tileSize;
            const offsetY = -y.value + startRow * map.tileSize;

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

                    let destX = Math.round(
                        (col - startCol) * map.tileSize + offsetX
                    );

                    let destY = Math.round(
                        (row - startRow) * map.tileSize + offsetY
                    );

                    if (offsetX) {
                        if (col === startCol) {
                            destX -= offsetX;
                            tileWidth += offsetX;
                        } else if (col === endCol) {
                            destX -= offsetX;
                            tileWidth = offsetX;
                        }
                    }

                    if (offsetY) {
                        if (row === startRow) {
                            destY -= offsetY;
                            tileHeight += offsetY;
                        } else if (row === endRow) {
                            destY -= offsetY;
                            tileHeight = offsetY;
                        }
                    }
 
                    ctx.beginPath();
                    ctx.rect(
                        canvasX + destX,
                        canvasY + destY,
                        tileWidth,
                        tileHeight
                    );
                    ctx.fillStyle = `rgba(0,200,200,${0.1 * row * col})`;
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
