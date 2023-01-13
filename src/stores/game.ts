import { defineStore } from "pinia";
import { ref } from "vue";

interface GameEvent {

}

const useGame = defineStore("game", () => {

    const history = ref<GameEvent[]>([]);



    return { };
});

export { useGame };
