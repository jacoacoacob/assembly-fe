
type EventDomain = "game_data" | "tokens" | "tiles" | "players" | "scores" | "game_state";

interface Event<Domain extends EventDomain, Name extends string, Data = any> {
    domain: Domain;
    name: Name;
    type: `${Domain}:${Name}`;
    data: Data;
}

type EventHandler<Domain extends EventDomain, E extends Event<Domain, string>> = (data: E["data"]) => void;

type EventHandlers<Domain extends EventDomain, Events extends Event<Domain, string>> = {
    [A in Events as A["name"]]: EventHandler<Domain, A>;
}

export type { Event, EventDomain, EventHandler, EventHandlers };
