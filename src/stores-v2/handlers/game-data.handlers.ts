import { eventHandlers } from "@/utils/event-handlers";
import type { Game } from "../game-data.types";
import type { Event } from "../events.types";
import { useGameDataStore } from "../game-data.store";
import { useScoresStore } from "../scores.store";
import { useScoring } from "../../composables/use-scoring";

type E<Name extends string, Data = {}> = Event<"game_data", Name, Data>;

type GameDataEvent =
    E<"set_name", Game["name"]> |
    E<"set_tokens", Game["tokens"]> |
    E<"set_grid", Game["grid"]> |
    E<"set_tiles", Game["tiles"]> |
    E<"set_players", Game["players"]> |
    E<"move_token", { tokenId: string; tileIndex: number }>;

function gameDataEventHandlers() {
    const gameData = useGameDataStore();
    const scores = useScoresStore();
    const scoring = useScoring();

    return eventHandlers<"game_data", GameDataEvent>({
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
            scores.points = scoring.initPlayerPoints();
        },
        move_token({ tokenId, tileIndex }) {
            gameData.moveToken(tokenId, tileIndex);
        }
    });
}

type GameDataEventHandlers = ReturnType<typeof gameDataEventHandlers>;

export { gameDataEventHandlers };
export type { GameDataEvent, GameDataEventHandlers };
