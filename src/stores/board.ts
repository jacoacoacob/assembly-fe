import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const useBoardStore = defineStore('board', () => {
    const rows = ref(0);
    const cols = ref(0);
    const tileSize = ref(0);


    return { }
});

export { useBoardStore };
