import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Rect, Circle, Entity } from "../canvas/types";


function makeCircle(x: number, y: number, r: number): Entity<Circle> {
    return {
        id: crypto.randomUUID(),
        strokeStyle: "black",
        fillStyle: "#fac",
        shape: {
            kind: "circle",
            x,
            y,
            r,
        },
    };
}

function makeRect(x: number, y: number, w: number, h: number): Entity<Rect> {
    return {
        id: crypto.randomUUID(),
        strokeStyle: "black",
        fillStyle: "#fac",
        shape: {
            kind: "rect",
            x,
            y,
            w,
            h,
        },
    };
}

const useEntitiesStore = defineStore("entities", () => {
    const sprites = ref<Record<string, Entity<Circle | Rect>>>([
        makeRect(150, 140, 40, 40),
        makeRect(20, 20, 40, 40),
        makeCircle(240, 290, 20),
        makeCircle(320, 350, 20),
    ].reduce((accum, sprite) => ({ ...accum, [sprite.id]: sprite }), {}));

    const spriteIds = computed(() => Object.keys(sprites.value));

    const clickedSprite = ref<string | null>(null);

    return { sprites, spriteIds, clickedSprite };
});

export { useEntitiesStore };
