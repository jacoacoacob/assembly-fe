import { randId } from "@/utils/rand";
import type { GameDataStore } from "./game-data.store";
import type { GameEvent } from "./game-data-event-handlers";

const PLAYER_COLOR_OPTIONS = {
    red: "bg-red-400",
    blue: "bg-blue-400",
    green: "bg-green-500",
    orange: "bg-orange-400",
};

type PlayerColor = keyof typeof PLAYER_COLOR_OPTIONS;

interface Player {
    id: string;
    name: string;
    color: PlayerColor,
}

interface Grid {
    rows: number;
    cols: number;
    tileSize: number;
}

interface Token {
    id: string;
    value: number;
    player: Player["id"];
    tileIndex: number;
}

interface Tile {
    threshold: number;
    color?: [number, number, number] | [number, number, number, number];
}

interface Game {
    name: string;
    history: GameEvent[];
    players: Player[];
    ts_updated: string;
    grid: Grid;
    tokens: Record<Token["id"], Token>;
    tiles: Tile[];
}

function isGame(data: unknown): data is Game {
    if (
        Object.prototype.hasOwnProperty.call(data, "name") &&
        Object.prototype.hasOwnProperty.call(data, "history") &&
        Object.prototype.hasOwnProperty.call(data, "players")
    ) {
        const { name, ts_updated, history, players } = data as Game;
        return (
            typeof name === "string" &&
            typeof ts_updated === "string" &&
            Array.isArray(history) &&
            Array.isArray(players)
        )
    }
    return false;
}

export { isGame, PLAYER_COLOR_OPTIONS };
export type { Game, GameEvent, PlayerColor, Player, Token };