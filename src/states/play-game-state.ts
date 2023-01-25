import { stateMachine } from "@/utils/state-machine";
import { useGameStateStore } from "@/stores/game-state-store";
import type { SetState } from "@/stores/game-state-store";
import type { NSEvent } from "@/utils/state-events";
import { usePlayGameStore } from "@/stores/play-game-store";
import { useGameDataStore } from "@/stores/game-data-store";

type Event<Action extends string, Data = {}> = NSEvent<"play_game", Action, Data>;

type PlayGameEvent =
    Event<"finish">;

function createPlayGameState(setState: SetState) {
    const playGame = usePlayGameStore();
    const gameData = useGameDataStore();

    return stateMachine<"play_game", PlayGameEvent>({
        handlers: {
            finish() {},

        }
    });
}

export { createPlayGameState };
