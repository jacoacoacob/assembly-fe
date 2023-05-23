import { ref, unref, type Ref, readonly, type WatchSource, watch  } from "vue";

import { socket } from "@/socket";
import type { ListenEvents, EmitEvents, Ack, AckPayload } from "@/socket";
import type { Socket } from "socket.io-client";

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
    initialValue: T[0];
    ackTimeout?: number;
    watch?: {
        source: WatchSource<T[0]>;
        immediate?: boolean;
    }
}

const ACK_TIMEOUT_DEFAULT = 5000;

function eRef<
    E extends keyof EmitEvents,
    T extends ArgsType<EmitEvents[E]>
>(options: ERefOptions<E, T>) {
    const { event, initialValue, ackTimeout, watch: watch_ } = options;

    const data = ref(unref(initialValue)) as Ref<T[0]>;

    if (watch_) {
        watch(watch_.source, (current) => {
            data.value = current;
        }, { immediate: watch_.immediate });
    }

    function emit() {
        (socket as any).emit(event, data.value);
    }

    function emitWithAck(): Promise<AckPayload> {
        return new Promise((resolve, reject) => {
            const acknowledgement: Ack<true> = (error, payload) => {
                if (error) {
                    reject(error);
                }
                resolve(payload)
            };

            (socket as Socket)
                .timeout(ackTimeout ?? ACK_TIMEOUT_DEFAULT)
                .emit(event, data.value, acknowledgement);
        });
    }

    return { data, emit, emitWithAck };
}

type ERef = ReturnType<typeof eRef>;

export { eRef, lRef, ACK_TIMEOUT_DEFAULT };
export type { ERef, ArgsType };
