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

    const _currentIndex = ref(0);

    const current = computed(() => frames[_currentIndex.value])

    function next() {
        if (_currentIndex.value < frames.length - 1) {
            _currentIndex.value += 1;
        } else {
            _currentIndex.value = 0;
        }
    }

    return { current, next };
});

export { useSeasonsStore };
export type { Season };
