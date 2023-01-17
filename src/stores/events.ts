
interface Event<Type extends string, Data = {}> {
    type: Type;
    data: Data;
}

type Handler<E extends Event<string>> = (payload: E["data"]) => void;

type EventHandlers<Events extends Event<string>> = {
    [E in Events as E["type"]]: Handler<E>;
}

export type { Event, EventHandlers, Handler};
