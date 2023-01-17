import type { GameDataStore } from "./game-data.store";
// import type { Ref } from "vue";
import type { StateName } from "./game-state.store";
import type { Player } from "./game-data";

type Event<Type extends string, Data = {}> = {
    type: Type;
    data: Data;
}


type GameEvent =
    Event<"start_game", { players: Player[], name: string; }> |
    Event<"move_token", { tokenId: string; tileIndex: number }>;

type GameEventHandlers = {
    [E in GameEvent as E["type"]]: (
        context: {
            game: GameDataStore;
            setState: (newState: StateName) => void;
        },
        payload: E["data"]
    ) => void;
}


function createHandlers(): GameEventHandlers {
    return {
        start_game({ game, setState }, { players, name }) {
            game.$patch({ players, name });
            setState("board_setup");
        },
        move_token(store) {

        },
    }
}

export {};
