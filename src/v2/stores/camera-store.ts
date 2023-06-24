import { computed, ref} from "vue";
import { defineStore } from "pinia";
import { useBoardStore } from "./board-store";
import { useEntitiesStore } from "./entities-store";

const useCameraStore = defineStore("camera", () => {
    const board = useBoardStore();
    const entities = useEntitiesStore();

    return {};
});

export { useCameraStore };
