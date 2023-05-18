import { ref, unref, type Ref, readonly, type WatchSource, watch  } from "vue";

import { socket, type ListenEvents, type EmitEvents } from "@/socket";

type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

/**
 * Creates a read-only ref bound to a socket event listener for the provided event type
 */
function lRef<
    E extends keyof ListenEvents,
    T extends ArgsType<ListenEvents[E]>
>(
    event: E,
    initialValue: T[number]
) {
    const _ref = ref(unref(initialValue)) as Ref<T[number]>;

    function listener(data?: T) {
        _ref.value = data as T[number];
    }

    socket.on(event, listener as any);

    return readonly(_ref);
}

interface ERefOptions<
    E extends keyof EmitEvents,
    T extends ArgsType<EmitEvents[E]>
> {
    event: E;
    initialValue: T[number];
    watch?: {
        source: WatchSource<T[number]>;
        immediate?: boolean;
    }
}

function eRef<
    E extends keyof EmitEvents,
    T extends ArgsType<EmitEvents[E]>
>(options: ERefOptions<E, T>) {
    const { event, initialValue, watch: watch_ } = options;

    const _ref = ref(unref(initialValue)) as Ref<T[number]>;

    function doEmit() {
        (socket as any).emit(event, _ref.value);
    }

    if (watch_) {
        watch(watch_.source, (current) => {
            _ref.value = current;
        }, { immediate: watch_.immediate });
    }

    return { _ref, doEmit };
}

export { eRef, lRef };
