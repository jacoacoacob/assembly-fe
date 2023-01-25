import { defineStore } from "pinia";
import type { EventDomain, EventHandler, Event } from "./events.types";
import type { Game, GameEvent } from "./game-data.types";

import { newGameEventHandlers, type NewGameEventHandlers } from "./handlers/new-game.handlers";
import { tokensEventHandlers, type TokensEventHandlers } from "./handlers/tokens.handlers";
import { saveGameHistory } from "@/api/game-api";
import { useGameDataStore } from "./game-data.store";

type StoreEventHandler = NewGameEventHandlers | TokensEventHandlers;

const useEventsStore = defineStore("events", () => {

    const gameData = useGameDataStore();
    
    const handlers: Record<EventDomain, StoreEventHandler> = {
        new_game: newGameEventHandlers(),
        tokens: tokensEventHandlers(),
    };
    
    function handleEvent<Domain extends EventDomain, E extends Event<Domain, string>>(event: GameEvent) {
        (handlers[event.domain].handleEvent as EventHandler<Domain, E>)(event);
        gameData.history.push(event);
    }

    function loadHistory(history: Game["history"]) {
        gameData.$reset();
        history.forEach(handleEvent);
    }

    function send<E extends GameEvent>(...args: [E["type"], E["data"]]): void;
    function send<E extends GameEvent>(...args: [E["type"], E["data"]][]): void;
    function send<E extends GameEvent>(...args: [E["type"], E["data"]][] | [E["type"], E["data"]]) {
        if (typeof args[0] === "string") {
            const [type, data = {}] = args;
            const [domain, name] = type.split(":");
            const event = { type, data, domain, name } as GameEvent;
            handleEvent(event);
        } else {
            (args as [E["type"], E["data"]][]).forEach(([type, data = {}]) => {
                const [domain, name] = type.split(":");
                const event = { type, data, domain, name } as GameEvent;
                handleEvent(event);
            });
        }
        saveGameHistory(gameData.$state);
    }

    return { send, loadHistory };
});

export { useEventsStore };
