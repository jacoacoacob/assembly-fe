import { eventHandlers } from "@/utils/event-handlers";
import { useGameStateStore, type GameState } from "../game-state.store";
import type { Event } from "../events.types";

type E<Name extends string, Data = {}> = Event<"game_state", Name, Data>;

type GameStateEvent = E<"set_state", GameState>;

function gameStateEventHandlers() {
    const gameState = useGameStateStore();

    return eventHandlers<"game_state", GameStateEvent>({
        set_state(newState) {
            gameState.currentState = newState;
        },
    });
}

type GameStateEventHandlers = ReturnType<typeof gameStateEventHandlers>;

export { gameStateEventHandlers };
export type { GameStateEvent, GameStateEventHandlers };
