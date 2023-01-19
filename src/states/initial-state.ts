import { stateMachine } from "./state-machine";
import { useGameDataStore } from "../stores/game-data-store";
import type { SetState } from "../stores/game-state-store";
import type { NSEvent } from "./events"
import type { Game } from "../stores/data-store-types";

type Event<Action extends string, Data = {}> = NSEvent<"initial", Action, Data>;

type InitialStateEvent =
    Event<"set_players", Game["players"]> |
    Event<"set_name", Game["name"]> |
    Event<"set_tokens", Game["tokens"]> |
    Event<"set_grid", Game["grid"]> |
    Event<"set_tiles", Game["tiles"]> |
    Event<"finish">;

function createInitialState(setState: SetState) {
    const gameData = useGameDataStore();

    return stateMachine<"initial", InitialStateEvent>({
        handlers: {
            finish() {
                setState("setup_board");
            },
            set_name(name) {
                gameData.name = name;
            },
            set_players(players) {
                gameData.players = players;
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
        },
    });
}

type InitialState = ReturnType<typeof createInitialState>;

export { createInitialState };
export type { InitialStateEvent, InitialState };
