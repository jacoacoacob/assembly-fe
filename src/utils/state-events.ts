import type { StateName } from "@/stores/game-state-store";

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

export type { NSEvent, NSHandler, NSEventHandlers };
