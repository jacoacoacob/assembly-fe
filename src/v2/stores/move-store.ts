import { defineStore } from "pinia";
import { ref } from "vue";



const useMoveStore = defineStore("move", () => {

    const movingSpriteId = ref<string | null>(null);

    function pickup(spriteId: string) {
        movingSpriteId.value = spriteId;
    }

    function drop() {
        movingSpriteId.value = null;
    }

    function commit() {

    }

    return { pickup, drop, commit, movingSpriteId };
});

export { useMoveStore };
