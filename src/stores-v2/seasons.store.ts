import { ref } from "vue";
import { defineStore } from "pinia";

type Season = "warm" | "mild" | "cold";

const useSeasonsStore = defineStore("seasons", () => {

    const seasons = ref<Season[]>([
        "warm",
        "warm",
        "mild",
        "mild",
        "cold",
        "cold",
    ]);

    function shift() {
        const tail = seasons.value.shift();
        seasons.value.push(tail as Season);
    }

    return { seasons, shift };
});

export { useSeasonsStore };
export type { Season };
