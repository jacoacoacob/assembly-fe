import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Rect, Circle, Entity, Shape } from "../canvas/types";

function randId(len: number) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let rv = "";
    for (let i = 0; i < len; i++) {
        rv += chars[Math.floor(Math.random() * chars.length)];
    }
    return rv;
}

function makeCircle(x: number, y: number, r: number): Entity<Circle> {
    return {
        id: randId(8),
        strokeStyle: "black",
        fillStyle: "#afc",
        boardTileIndex: -1,
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
        id: randId(8),
        strokeStyle: "black",
        fillStyle: "#caf",
        boardTileIndex: -1,
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
        ...Array.from(Array(10)).map((_, i) => makeRect(50 * (i + 1), 20, 40, 40)),
        ...Array.from(Array(10)).map((_, i) => makeRect(50 * (i + 1), 70, 40, 40)),
        ...Array.from(Array(10)).map((_, i) => makeCircle(50 * (i + 1) + 20, 140, 20)),
        ...Array.from(Array(10)).map((_, i) => makeCircle(50 * (i + 1) + 20, 190, 20)),
    ].reduce((accum, sprite) => ({ ...accum, [sprite.id]: sprite }), {}));

    const spriteIds = computed(() => Object.keys(sprites.value));

    const clickedSprite = ref<string | null>(null);

    return { sprites, spriteIds, clickedSprite };
});

export { useEntitiesStore };
