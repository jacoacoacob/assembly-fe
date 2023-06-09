import { defineStore } from "pinia";
import { ref } from "vue";

interface PickupOptions {
    spriteId: string;
    mouseCoords?: [number, number];
}

const useMoveStore = defineStore("move", () => {

    const movingSpriteId = ref<string | null>(null);
    const pickupMouseCoords = ref<[number, number] | null>(null);

    function pickup(spriteId: string, mouseCoords?: [number, number]) {
        movingSpriteId.value = spriteId;
        pickupMouseCoords.value = mouseCoords ?? null;
    }

    function drop() {

    }

    function commit() {

    }

    return { pickup, drop, commit };
});

export { useMoveStore };
