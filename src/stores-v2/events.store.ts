import { defineStore } from "pinia";
import type { EventDomain, EventHandler, Event } from "./events.types";
import type { Game, GameEvent } from "./game-data.types";

import { newGameEventHandlers, type NewGameEventHandlers } from "./handlers/new-game.handlers";
import { tokensEventHandlers, type TokensEventHandlers } from "./handlers/tokens.handlers";
import { saveGameHistory } from "@/api/game-api";
import { useGameDataStore } from "./game-data.store";
import { playersEventHandlers, type PlayersEventHandlers } from "./handlers/players.handlers";
import { gameStateEventHandlers, type GameStateEventHandlers } from "./handlers/game-state.handlers";
import { tilesEventHandlers, type TilesEventHandlers } from "./handlers/tiles.handlers";
import { scoresEventHandlers, type ScoresEventHandlers } from "./handlers/scores.handlers";

type StoreEventHandler =
    NewGameEventHandlers |
    TokensEventHandlers |
    PlayersEventHandlers |
    GameStateEventHandlers |
    ScoresEventHandlers |
    TilesEventHandlers;

const useEventsStore = defineStore("events", () => {

    const gameData = useGameDataStore();
    
    const handlers: Record<EventDomain, StoreEventHandler> = {
        new_game: newGameEventHandlers(),
        tokens: tokensEventHandlers(),
        players: playersEventHandlers(),
        tiles: tilesEventHandlers(),
        game_state: gameStateEventHandlers(),
        scores: scoresEventHandlers(),
    };
    
    function handleEvent<Domain extends EventDomain, E extends Event<Domain, string>>(event: GameEvent) {
        (handlers[event.domain].handleEvent as EventHandler<Domain, E>)(event);
        gameData.history.push(event);
    }

    function loadHistory(history: Game["history"]) {
        gameData.$reset();
        history.forEach(handleEvent);
    }

    function send<E extends GameEvent>(type: E["type"], data?: E["data"]) {
        const [domain, name] = type.split(":");
        const event = { domain, name, type, data } as GameEvent;
        handleEvent(event);
        saveGameHistory(gameData.$state);
    }

    if (import.meta.env.DEV) {
        (window as any).sendEvent = send;
    }

    function sendMany<Event extends GameEvent>(...args: ([Event["type"], Event["data"]] | [Event["type"]])[]) {
        const events = args.map(([type, data]) => {
            const [domain, name] = type.split(":");
            return { domain, name, type, data } as GameEvent;
        });
        events.forEach(handleEvent);
        saveGameHistory(gameData.$state);
    }

    return { send, sendMany, loadHistory };
});

export { useEventsStore };
