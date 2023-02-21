import { defineStore } from "pinia";
import { ref } from "vue";

const useRoundsStore = defineStore("rounds", () => {
    const currentRound = ref(0);

    return { currentRound };
});

export { useRoundsStore };
