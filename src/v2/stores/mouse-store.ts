import { defineStore } from "pinia";
import { ref } from "vue";
import type { Coords } from "../canvas/utils";
import { useEntitiesStore } from "./entities-store";
import { isCollision, type Circle } from "../canvas/collision";
import type { Entity, Shape } from "../canvas/types";
import { useMoveStore } from "./move-store";


const useMouseStore = defineStore("mouse", () => {

    const entities = useEntitiesStore();
    const move = useMoveStore();

    const mouseDownCoords = ref<Coords | null>(null);
    const mouseMoveOffset = ref<Coords>([0, 0]);

    function handleMouseDown([x, y]: Coords) {
        const clickPoint: Circle = { x, y, r: 0, kind: "circle" };

        const clickedSprite = entities.spriteIds.reduce(
            (accum: Entity<Shape> | null, spriteId) => {
                const sprite = entities.sprites[spriteId];
                if (isCollision(clickPoint, sprite.shape)) {
                    return sprite;
                }
                return accum;
            },
            null
        );

        if (clickedSprite) {
            mouseDownCoords.value = [x, y];
            mouseMoveOffset.value = [
                clickedSprite.shape.x - x,
                clickedSprite.shape.y - y,
            ];
            move.pickup(clickedSprite.id);
        }
    }

    function handleMouseDownMouseMove([x, y]: Coords) {
        if (move.movingSpriteId) {
            const [offsetX, offsetY] = mouseMoveOffset.value;
           
            const sprite = entities.sprites[move.movingSpriteId];
            sprite.shape.x = x + offsetX;
            sprite.shape.y = y + offsetY;
            
            for (let i = 0; i < entities.spriteIds.length; i++) {
                const otherSprite = entities.sprites[entities.spriteIds[i]];
                
                if (otherSprite.id === sprite.id) {
                    continue;
                }

                if (isCollision(sprite.shape, otherSprite.shape)) {
                    console.log("Collision!");
                }
            }
        }
    }

    function handleMouseUp([x, y]: Coords) {
        move.drop();
    }


    return {
        handleMouseDown,
        handleMouseDownMouseMove,
        handleMouseUp,
    };
});

export { useMouseStore };
