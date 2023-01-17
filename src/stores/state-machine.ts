import type { Event, EventHandlers, Handler } from "./events";

interface Params<E extends Event<string>> {
    setup?: () => void;
    teardown?: () => void;
    handlers: EventHandlers<E>
}

interface StateMachine<E extends Event<string>> {
    setup: () => void;
    teardown: () => void;
    handleEvent: (event: E) => void;
}

function stateMachine<E extends Event<string>>(params: Params<E>): StateMachine<E> {
    return {
        handleEvent(event) {
            const handler = params.handlers[event.type as E["type"]] as Handler<E>;
            return handler(event.data);
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
