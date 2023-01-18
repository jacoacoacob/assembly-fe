import { stateMachine } from "./state-machine";
import { useGameDataStore } from "../stores/data-store";
import type { SetState } from "../stores/state-store";
import type { Event } from "./events"
import type { Game, Player, Token } from "../stores/data-store-types";
import { randId } from "@/utils/rand";

type InitialStateEvent =
    Event<"set_players", Game["players"]> |
    Event<"set_name", Game["name"]> |
    Event<"set_tokens", Game["tokens"]> |
    Event<"finish", null>;

function createInitialState(setState: SetState) {
    const gameData = useGameDataStore();

    function generateToken(playerId: string, value: number, tileIndex: number): Token {
        const token: Token = { value, player: playerId, tileIndex, id: randId(8) };
        if (gameData.tokens[token.id]) {
            return generateToken(playerId, value, tileIndex);
        }
        return token;
    }

    return stateMachine<InitialStateEvent>({
        handlers: {
            finish(data) {
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
            }
            // create_game({ players, name }, isReplay) {
            //     if (!isReplay) {
            //         gameData.$patch({ players, name });
            //         const tokenValues = Array.from(Array(4)).map((_, i) => i + 1);
            //         gameData.tokens = players.reduce((accum: Record<Token["id"], Token>, player) => {
            //             for (let i = 0; i < 4; i++) {
            //                 tokenValues.forEach(tokenValue => {
            //                     const token = generateToken(player.id, tokenValue, -1);
            //                     accum[token.id] = token;
            //                 });
            //             }
            //             return accum;
            //         }, {});
            //     }
            //     setState("setup_board");
            // }
        }
    })
}

type InitialState = ReturnType<typeof createInitialState>;

export { createInitialState };
export type { InitialStateEvent, InitialState };
