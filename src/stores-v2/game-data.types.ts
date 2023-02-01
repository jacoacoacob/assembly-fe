import type { GameDataEvent } from "./handlers/game.handlers";
import type { PlayersEvent } from "./handlers/players.handlers";
import type { GameStateEvent } from "./handlers/game-state.handlers";
import type { TokensEvent } from "./handlers/tokens.handlers";
import type { TilesEvent } from "./handlers/tiles.handlers";
import type { ScoresEvent } from "./handlers/scores.handlers";

type PlayerColor = "green" | "blue" | "orange" | "red" | "violet";

interface Player {
    id: string;
    name: string;
    color: PlayerColor,
}

interface Token {
    id: string;
    value: number;
    playerId: Player["id"];
    tileIndex: number;
}

interface Grid {
    rows: number;
    cols: number;
    tileSize: number;
}


interface Tile {
    capacity: number;
    color?: [number, number, number] | [number, number, number, number];
}

type GameEvent =
    GameDataEvent |
    TokensEvent |
    PlayersEvent |
    GameStateEvent |
    TilesEvent |
    ScoresEvent;

interface Game {
    name: string;
    history: GameEvent[];
    players: Player[];
    ts_updated: string;
    grid: Grid;
    tokens: Record<Token["id"], Token>;
    tiles: Tile[];
}

export type { Game, GameEvent, Player, PlayerColor, Grid, Token, Tile };
