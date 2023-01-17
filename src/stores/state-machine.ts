import { ref, type Ref, type UnwrapRef } from "vue";
import type { Store } from "pinia";

import type { Event, EventHandlers, Handler } from "./events";

interface Context<S extends Store, LocalData> {
    localData: Ref<UnwrapRef<LocalData>>;
    store: S;
}

interface Config<E extends Event<string>, S extends Store, LocalData> {
    localData?: LocalData;
    setup?: (context: Context<S, LocalData>) => void;
    handlers: EventHandlers<E, S, LocalData>;
    teardown?: (context: Context<S, LocalData>) => void;
}

interface State<Event, S extends Store> {
    setup: (store: S) => void;
    handleEvent: (store: S, event: Event) => void;
    teardown: (game: S) => void;
}

type SetState<StateName> = (newState: StateName) => void;

function stateMachine<
    E extends Event<string>,
    S extends Store,
    LocalData = {},
>(config: Config<E, S, LocalData>): State<E, S> {
    const localData = ref<LocalData>(config.localData ?? {} as LocalData);

    return {
        handleEvent(store, event) {
            const handler = config.handlers[event.type as keyof typeof config.handlers] as Handler<typeof event, S, LocalData>;
            return handler({ store, localData }, event)
        },
        setup(store) {
            if (config.setup) {
                config.setup({ store, localData });
            }
        },
        teardown(store) {
            if (config.teardown) {
                config.teardown({ store, localData });
            }
        }
    }
}

export { stateMachine };
export type { SetState, State };
