// import { defineStore } from "pinia";

// import { useGameDataStore } from "./game-data-store";
// import { useGameStateStore, type StateName } from "./game-state-store";

// interface PlayerActionData {

// }

// const actions: Record<StateName, string[]> = {
//     play_game: [
//         "remove_token",
//         "add_token",
//         "move_token",
//     ],
//     initial: [],
//     setup_board: [
//         "place_token"
//     ]
// }

// interface StateAction<S extends StateName, Action extends string> {
//     state: S;
//     action: Action;
// }



// type PlayGameAction<Action extends string> = StateAction<"play_game", Action>;
// type PlayGameActions =
//     PlayGameAction<"remove_token"> |
//     PlayGameAction<"add_token"> |
//     PlayGameAction<"move_token">;



// const usePlayerActionStore = defineStore("player-action", () => {

//     const gameData = useGameDataStore();
//     const gameState = useGameStateStore();



//     return {};
// });

// export { usePlayerActionStore };

export {};
