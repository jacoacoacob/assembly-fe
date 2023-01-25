import { defineStore } from "pinia";
import type { EventDomain } from "./events.types";
import type { Game, GameEvent } from "./game-data.types";

import { newGameEventHandlers, type NewGameEventHandlers } from "./handlers/new-game.handlers";
import { saveGameHistory } from "@/api/game-api";
import { useGameDataStore } from "./game-data.store";

type StoreEventHandler = NewGameEventHandlers;

const useEventsStore = defineStore("events", () => {

    const gameData = useGameDataStore();
    
    const handlers: Record<EventDomain, StoreEventHandler> = {
        new_game: newGameEventHandlers(),
    };
    
    function handleEvent(event: GameEvent) {
        handlers[event.domain].handleEvent(event);
        gameData.history.push(event);
    }

    function loadHistory(history: Game["history"]) {
        gameData.$reset();
        history.forEach(handleEvent);
    }

    function pushEvent<E extends GameEvent>(type: E["type"], data: E["data"] = {}) {
        const [domain, name] = type.split(":");
        const event = { type, data, domain, name } as GameEvent;
        handleEvent(event);
        saveGameHistory(gameData.$state);
    }

    return { pushEvent, loadHistory };
});

export { useEventsStore };
