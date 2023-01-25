import type { NewGameEvent } from "./handlers/new-game.handlers";
import type { TokensEvent } from "./handlers/tokens.handlers";

type PlayerColor = "green" | "blue" | "orange" | "red" | "violet";

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
    playerId: Player["id"];
    tileIndex: number;
}

interface Tile {
    capacity: number;
    color?: [number, number, number] | [number, number, number, number];
}

type GameEvent = NewGameEvent | TokensEvent;

interface Game {
    name: string;
    history: GameEvent[];
    players: Player[];
    ts_updated: string;
    grid: Grid;
    tokens: Record<Token["id"], Token>;
    tiles: Tile[];
}

export type { Game, GameEvent, Player, PlayerColor, Grid, Token };
