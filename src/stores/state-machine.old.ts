// import { computed, type ComputedRef, type ToRefs } from "vue";

// import type { Event, EventHandlers, Handler } from "./events";
// import type { GameDataStore } from "./game-data.store";

// interface Context<LocalData> {
//     // data: ToRefs<LocalData>;
//     data: LocalData;
//     game: GameDataStore;
// }

// interface Config<E extends Event<string>, LocalData> {
//     data: LocalData;
//     setup?: (context: Context<LocalData>) => void;
//     handlers: EventHandlers<E, LocalData>;
//     teardown?: (context: Context<LocalData>) => void;
// }

// interface State<Event, LocalData = {}> {
//     data: ComputedRef<LocalData>;
//     setup: (game: GameDataStore) => void;
//     handleEvent: (store: GameDataStore, event: Event) => void;
//     teardown: (game: GameDataStore) => void;
// }

// type SetState<StateName> = (newState: StateName) => void;

// function stateMachine<
//     E extends Event<string>,
//     LocalData,
// >(config: Config<E, LocalData>): State<E, LocalData> {
//     // const data = config.data ? config.data() : {} as ToRefs<LocalData>;
//     // const data = config.data ? config.data() : {} as LocalData;
//     const data = config.data;

//     return {
//         data: computed(() => data),
//         handleEvent(game, event) {
//             const handler = config.handlers[event.type as keyof typeof config.handlers] as Handler<typeof event, LocalData>;
//             return handler({ game, data }, event)
//         },
//         setup(game) {
//             if (config.setup) {
//                 config.setup({ game, data });
//             }
//         },
//         teardown(game) {
//             if (config.teardown) {
//                 config.teardown({ game, data });
//             }
//         }
//     }
// }

// export { stateMachine };
// export type { SetState, State };

export {}