import { defineStore } from "pinia";
import { ref } from "vue";

const PLAYER_COLOR_OPTIONS = {
    red: "bg-red-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
    orange: "bg-orange-400",
};

type PlayerColor = keyof typeof PLAYER_COLOR_OPTIONS;

interface Player {
    name: string;
    color: PlayerColor,
}

interface GameEvent {

}

interface Game {
    name: string;
    history: GameEvent[];
    players: Player[];
}


function isGame(data: unknown): data is Game {
    if (
        Object.prototype.hasOwnProperty.call(data, "name") &&
        Object.prototype.hasOwnProperty.call(data, "history") &&
        Object.prototype.hasOwnProperty.call(data, "players")
    ) {
        const { name, history, players } = data as Game;
        return (
            typeof name === "string" &&
            Array.isArray(history) &&
            Array.isArray(players)
        )
    }
    return false;
}

const useGameStore = defineStore("game", () => {
    const name = ref<Game["name"]>("");
    const history = ref<Game["history"]>([])
    const players = ref<Game["players"]>([]);

    return { name, history, players };
});

export { useGameStore, isGame, PLAYER_COLOR_OPTIONS };
export type { Game };
