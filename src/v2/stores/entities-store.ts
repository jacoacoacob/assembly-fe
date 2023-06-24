import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Circle, Entity, Rect } from "../canvas/types";
import { useBoardStore } from "./board-store";

interface Node {
    spriteIds: string[];
}

const useEntitiesStore = defineStore("entities", () => {
    const board = useBoardStore();

    const sprites = ref<Record<string, Entity<Circle>>>({});

    const spriteIds = computed(() => Object.keys(sprites.value));

    const tileSpriteGraph = computed((): Node[] => {
        const nTiles = board.tiles.cols * board.tiles.rows;
        const graph: Node[] = Array.from(Array(nTiles)).map(() => ({
            spriteIds: [],
        }));
        for (let i = 0; i < spriteIds.value.length; i++) {
            const sprite = sprites.value[spriteIds.value[i]];
            graph[sprite.tileIndex].spriteIds.push(sprite.id);
        }
        return graph;
    });
    
    return {
        sprites,
        spriteIds,
        tileSpriteGraph,
    };
});

export { useEntitiesStore };
