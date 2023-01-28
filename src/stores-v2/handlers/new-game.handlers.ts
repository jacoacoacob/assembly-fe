import { eventHandlers } from "@/utils/event-handlers";
import type { Game } from "../game-data.types";
import type { Event } from "../events.types";
import { useGameDataStore } from "../game-data.store";
import { useScoresStore } from "../scores.store";

type E<Name extends string, Data = {}> = Event<"new_game", Name, Data>;

type NewGameEvent =
    E<"set_name", Game["name"]> |
    E<"set_tokens", Game["tokens"]> |
    E<"set_grid", Game["grid"]> |
    E<"set_tiles", Game["tiles"]> |
    E<"set_players", Game["players"]>;

function newGameEventHandlers() {
    const gameData = useGameDataStore();
    const scores = useScoresStore();

    return eventHandlers<"new_game", NewGameEvent>({
        set_name(name) {
            gameData.name = name;
        },
        set_tokens(tokens) {
            gameData.tokens = tokens;
        },
        set_grid(grid) {
            gameData.grid = grid;
        },
        set_tiles(tiles) {
            gameData.tiles = tiles;
        },
        set_players(players) {
            gameData.players = players;
            scores.initPoints();
        },
    });
}

type NewGameEventHandlers = ReturnType<typeof newGameEventHandlers>;

export { newGameEventHandlers };
export type { NewGameEvent, NewGameEventHandlers };
