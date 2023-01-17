import type { Store } from "pinia";
import type { Ref, UnwrapRef } from "vue";


interface Event<Type extends string, Data = {}> {
    type: Type;
    data: Data;
}

interface EventContext<S extends Store, LocalData,> {
    store: S;
    localData: Ref<UnwrapRef<LocalData>>;
}

type Handler<
    E extends Event<string>,
    S extends Store,
    LocalData
> = (context: EventContext<S, LocalData>, payload: E["data"]) => void; 


type EventHandlers<
    Events extends Event<string>,
    S extends Store,
    LocalData,
> = {
    [E in Events as E["type"]]: Handler<E, S, LocalData>;
}


export type { Event, EventHandlers, Handler};
