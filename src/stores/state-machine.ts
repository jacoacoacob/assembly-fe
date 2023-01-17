import type { StateEvent, EventHandlers, Handler } from "./events";
import type { StateName } from "./game-state.store";

interface Params<E extends StateEvent<StateName, string>> {
    setup?: () => void;
    teardown?: () => void;
    handlers: EventHandlers<E>
}

interface StateMachine<E extends StateEvent<StateName, string>> {
    setup: () => void;
    teardown: () => void;
    handleEvent: (event: E) => void;
}

function stateMachine<E extends StateEvent<StateName, string>>(params: Params<E>): StateMachine<E> {
    return {
        handleEvent(event) {
            const [,action] = event.type.split(":")
            const handler = params.handlers[event.type as E["type"]] as unknown as Handler<E>;
            if (handler) {
                return handler(event.data);
            }
            console.warn("No handler registerred for current state.");
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
