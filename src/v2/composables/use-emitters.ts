import { socket, emit, emitWithAck, type EmitEvents, type Ack } from "@/socket";
import { ACK_TIMEOUT_DEFAULT, type ArgsType } from "./use-socket-ref";
import { ref, reactive, readonly,  } from "vue";
import type { Socket } from "socket.io-client";


function useEmit<E extends keyof EmitEvents,T extends ArgsType<EmitEvents[E]>>(event: E) {
    return (data: T[0]) => {
        (socket as any).emit(event, data);
    }
}

function useEmitWithAck<
    E extends keyof EmitEvents,
    T extends ArgsType<EmitEvents[E]>
>(event: E) {
    const error = ref<Error | null>(null);
    const message = ref("");
    const status = ref<"idle" | "pending" | "success" | "fail">("idle");

    const _acknowledgement: Ack<true> = (error_, payload) => {
        if (error_) {
            error.value = error_;
            status.value = "fail";
        } else {
            const { success, message: message_ } = payload;
            status.value = success ? "success" : "fail";
            message.value = message_ ?? "";
        }
    };

    function send(data: T[0]) {
        status.value = "pending";
        (socket as Socket)
            .timeout(ACK_TIMEOUT_DEFAULT)
            .emit(event, data, _acknowledgement);
    }

    function reset() {
        error.value = null;
        message.value = ""
        status.value = "idle";
    }

    return readonly(reactive({
        error,
        message,
        status,
        send,
        reset,
    }));
}

export { useEmit, useEmitWithAck };
