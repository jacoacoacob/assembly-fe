import { computed, ref } from "vue";
import { defineStore } from "pinia";

type Season = "warm" | "mild" | "cold";

const frames: [Season, Season, Season, Season, Season, Season][] = [
    [
        "warm",
        "warm",
        "mild",
        "mild",
        "cold",
        "cold",
    ],
    [
        "warm",
        "warm",
        "warm",
        "mild",
        "mild",
        "cold",
    ],
    [
        "warm",
        "warm",
        "warm",
        "warm",
        "mild",
        "mild",
    ],
    [
        "warm",
        "warm",
        "warm",
        "mild",
        "mild",
        "cold",
    ],
    [
        "warm",
        "warm",
        "mild",
        "mild",
        "cold",
        "cold",
    ],
    [
        "warm",
        "mild",
        "mild",
        "cold",
        "cold",
        "cold",
    ],
    [
        "mild",
        "mild",
        "cold",
        "cold",
        "cold",
        "cold",
    ],
    [
        "warm",
        "mild",
        "mild",
        "cold",
        "cold",
        "cold",
    ],
    [
        "warm",
        "warm",
        "mild",
        "mild",
        "cold",
        "cold",
    ],
    [
        "warm",
        "mild",
        "mild",
        "mild",
        "mild",
        "cold",
    ],
    [
        "mild",
        "mild",
        "mild",
        "mild",
        "mild",
        "mild",
    ],
    [
        "cold",
        "mild",
        "mild",
        "mild",
        "mild",
        "warm",
    ],
    [
        "cold",
        "cold",
        "mild",
        "mild",
        "warm",
        "warm",
    ],
    [
        "cold",
        "cold",
        "cold",
        "mild",
        "mild",
        "warm",
    ],
    [
        "cold",
        "cold",
        "cold",
        "cold",
        "mild",
        "mild",
    ],
    [
        "cold",
        "cold",
        "cold",
        "mild",
        "mild",
        "warm",
    ],
    [
        "cold",
        "cold",
        "mild",
        "mild",
        "warm",
        "warm",
    ],
    [
        "cold",
        "mild",
        "mild",
        "warm",
        "warm",
        "warm",
    ],
    [
        "mild",
        "mild",
        "warm",
        "warm",
        "warm",
        "warm",
    ],
    [
        "cold",
        "mild",
        "mild",
        "warm",
        "warm",
        "warm",
    ],
    [
        "cold",
        "cold",
        "mild",
        "mild",
        "warm",
        "warm",
    ],
    [
        "cold",
        "mild",
        "mild",
        "mild",
        "mild",
        "warm",
    ],
    [
        "mild",
        "mild",
        "mild",
        "mild",
        "mild",
        "mild",
    ],
    [
        "warm",
        "mild",
        "mild",
        "mild",
        "mild",
        "cold",
    ],
]

const useSeasonsStore = defineStore("seasons", () => {

    const currentIndex = ref(0);

    const current = computed(() => frames[currentIndex.value])

    function next() {
        if (currentIndex.value < frames.length - 1) {
            currentIndex.value += 1;
        } else {
            currentIndex.value = 0;
        }
    }

    return { current, currentIndex, next };
});

export { useSeasonsStore };
export type { Season };
