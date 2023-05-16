import { ref, type Ref, watch, computed } from "vue";

import { socket } from "@/socket";
import type { ListenEvents, EmitEvents, ListenEmitEvents } from "@/socket";


type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

function lRef<
    E extends keyof ListenEvents,
    T extends ArgsType<ListenEvents[E]>[number]
>(
    event: E,
    value?: T
) {
    const _ref = ref(value) as Ref<T>;

    function listener(data?: T) {
        _ref.value = data as T;
    }

    socket.on(event, listener as any);

    return _ref;
}

function eRef<
    E extends keyof EmitEvents,
    T extends ArgsType<EmitEvents[E]>[number]
>(
    event: E,
    value?: T
) {
    const _ref = ref(value) as Ref<T>;

    watch(_ref, (current) => {
        (socket as any).emit(event, current);
    });

    return _ref;
}

function leRef<
    E extends keyof ListenEmitEvents,
    T extends ArgsType<ListenEmitEvents[E]>[number]
> (
    event: E,
    value?: T
) {
    const _ref = ref(value) as Ref<T>;

    function listener(data?: T) {
        _ref.value = data as any;
    }

    socket.on(event, listener as any);

    const _proxy = computed({
        get() {
            return _ref.value;
        },
        set(value: T) {
            _ref.value = value;
            (socket as any).emit(event, value);
        },
    });

    return _proxy;
}

export { lRef, eRef, leRef };
