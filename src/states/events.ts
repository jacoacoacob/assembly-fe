import type { StateName } from "@/stores/game-state-store";

interface Event<Type extends string, Data = any> {
    type: Type;
    data: Data;
}

type Handler<E extends Event<string>> = (payload: E["data"]) => void;

type EventHandlers<Events extends Event<string>> = {
    [E in Events as E["type"]]: Handler<E>;
}


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
interface NSEvent<Namespace extends StateName, Action extends string, Data = any> {
    namespace: Namespace;
    action: Action;
    type: `${Namespace}:${Action}`;
    data: Data
}

type NSHandler<Namespace extends StateName, E extends NSEvent<Namespace, string>> = (payload: E["data"]) => void;

type NSEventHandlers<Namespace extends StateName, NSEvents extends NSEvent<Namespace, string>> = {
    [E in NSEvents as E["action"]]: NSHandler<Namespace, E>;
}

type InitialStateNSEvents = NSEvent<"initial", "do_this", { name: string }> | NSEvent<"initial", "hi", null>;

const handlers: NSEventHandlers<"initial", InitialStateNSEvents> = {
    do_this(data) {
        data.name;
    },
    hi() {

    }
}

function nsEvent<Namespace extends StateName>(namespace: Namespace) {
    return <Action extends string, Data>(action: Action, data: Data): NSEvent<Namespace, Action, Data> => ({
        namespace,
        action,
        data,
        type: `${namespace}:${action}`,
    })
}

const initialStateEvent = nsEvent("initial");

const e = initialStateEvent("sd", {});

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

export { nsEvent };
export type { Event, EventHandlers, Handler};
