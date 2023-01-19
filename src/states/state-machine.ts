
import type { NSEvent, NSHandler, NSEventHandlers } from "./events";
import type { StateName } from "@/stores/game-state-store";

interface Params<S extends StateName, E extends NSEvent<S, string>> {
    setup?: () => void;
    teardown?: () => void;
    handlers: NSEventHandlers<S, E>
}

interface StateMachine<S extends StateName, E extends NSEvent<S, string>> {
    setup: () => void;
    teardown: () => void;
    handleEvent: (event: E) => void;
}

function stateMachine<S extends StateName, E extends NSEvent<S, string>>(params: Params<S, E>): StateMachine<S, E> {
    return {
        handleEvent(event) {
            const handler = params.handlers[event.action as E["action"]] as unknown as NSHandler<S, E>;
            if (handler) {
                return handler(event.data);
            }
            console.warn("No handler registerred for current state.", event);
        },
        setup() {
            if (params.setup) {
                params.setup();
            }
        },
        teardown() {
            if (params.teardown) {
                params.teardown();
            }
        }
    }
}

export { stateMachine };
export type { StateMachine };
