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


    type EventArgs<E extends GameEvent> = [E["type"], E["data"]] | [boolean, E["type"], E["data"]];

    function send<E extends GameEvent>(...eventArgs: EventArgs<E>): void;
    function send<E extends GameEvent>(...eventArgs: EventArgs<E>[]): void;
    function send<E extends GameEvent>(...eventArgs: EventArgs<E> | EventArgs<E>[]) {

        function buildGameEvent(args: EventArgs<E> | EventArgs<E>[]): GameEvent | null {
            if (typeof args[0] === "boolean") {
                if (args[0] === true) {
                    const [, type, data = {}] = args;
                    const [domain, name] = (type as string).split(":");
                    return { domain, name, type, data } as GameEvent;
                }
                return null;
            } else {
                const [type, data = {}] = args;
                const [domain, name] = (type as string).split(":");
                return { domain, name, type, data } as GameEvent;
            }
        }

        if (Array.isArray(eventArgs[0])) {
            const events = (eventArgs as EventArgs<E>[]).reduce((accum: GameEvent[], args) => {
                const event = buildGameEvent(args);
                if (event) {
                    accum.push(event);
                }
                return accum;
            }, []);
            events.forEach(handleEvent);
        } else {
            const event = buildGameEvent(eventArgs);
            if (event) {
                handleEvent(event);
            }
        }
        saveGameHistory(gameData.$state);
    }

    return { send, loadHistory };
});

export { useEventsStore };
