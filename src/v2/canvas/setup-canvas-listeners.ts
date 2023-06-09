
import { useEntitiesStore } from "../stores/entities-store";
import { useGameStore } from "../stores/game-store";
import { isCollision } from "./collision";
import { getMouseCoords } from "./utils";


function setupCanvasListeners(canvas: HTMLCanvasElement) {
    const game = useGameStore();
    const entities = useEntitiesStore();


    function onMouseUpMouseMove(ev: MouseEvent) {
        const [x, y] = getMouseCoords(ev);
    }


    function onMouseDownMouseMove(ev: MouseEvent) {
        const [x, y] = getMouseCoords(ev);

        if (entities.clickedSprite) {
            const sprite = entities.sprites[entities.clickedSprite];

            if (sprite) {
                sprite.shape.x = x;
                sprite.shape.y = y;
                let didCollide = false;
                entities.spriteIds.forEach((id) => {
                    const entity = entities.sprites[id];
                    if (
                        sprite.id !== entity.id &&
                        isCollision(sprite.shape, entity.shape)
                    ) {
                        didCollide = true;
                        entity.fillStyle = "red";
                    } else {
                        entity.fillStyle = "#fac";
                    }
                });
                if (didCollide) {
                    sprite.fillStyle = "red";
                } else {
                    sprite.fillStyle = "#fac";
                }
            }
        }
    }


    function onMouseDown(ev: MouseEvent) {
        const [x, y] = getMouseCoords(ev);



        entities.spriteIds.forEach((id) => {
            const sprite = entities.sprites[id];
            if (isCollision({ x, y, r: 0, kind: "circle" }, sprite.shape)) {
                console.log(sprite.shape.kind);
            }
        });

        entities.clickedSprite = entities.spriteIds.reduce(
            (accum: string | null, id) => {
                const sprite = entities.sprites[id];
                if (isCollision({ x, y, r: 0, kind: "circle" }, sprite.shape)) {
                    return sprite.id;
                }
                return accum;
            },
            null
        );

        canvas.removeEventListener("mousemove", onMouseUpMouseMove);
        canvas.addEventListener("mousemove", onMouseDownMouseMove);
    }


    function onMouseUp(ev: MouseEvent) {
        const [x, y] = getMouseCoords(ev);

        canvas.removeEventListener("mousemove", onMouseDownMouseMove);
        canvas.addEventListener("mousemove", onMouseUpMouseMove);
    }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseUpMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
}


export { setupCanvasListeners };
