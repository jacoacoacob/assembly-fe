import type { StateName } from "./game-state.store";

// interface Event<State extends StateName, Action extends string, Data = {}> {
interface StateEvent<State extends StateName, Action extends string, Data = {}> {
    type: `${State}:${Action}`;
    action: Action;
    data: Data;
}


type Handler<E extends StateEvent<StateName, string>> = (payload: E["data"]) => void;

type EventHandlers<Events extends StateEvent<StateName, string>> = {
    [E in Events as E["type"]]: Handler<E>;
}

export type { StateEvent, EventHandlers, Handler};
