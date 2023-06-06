import { socket, type EmitEvents, type Ack } from "@/socket";
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

    // const _acknowledgement: Ack<true> = (error_, payload) => {
    //     if (error_) {
    //         error.value = error_;
    //         status.value = "fail";
    //     } else {
    //         const { success, message: message_ } = payload;
    //         status.value = success ? "success" : "fail";
    //         message.value = message_ ?? "";
    //     }
    // };

    // function emit(data: T[0]) {
    //     reset();
    //     status.value = "pending";
    //     (socket as Socket)
    //         .timeout(ACK_TIMEOUT_DEFAULT)
    //         .emit(event, data, _acknowledgement);
    // }

    function emit(data: T[0]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const _acknowledgement: Ack<true> = (error_, payload) => {
                if (error_) {
                    error.value = error_;
                    status.value = "fail";
                    reject(error_);
                } else {
                    const { success, message: message_ } = payload;
                    status.value = success ? "success" : "fail";
                    message.value = message_ ?? "";
                    if (success) {
                        resolve(true);
                    } else {
                        reject(new Error(message_));
                    }
                }
            };
            reset();
            status.value = "pending";
            (socket as Socket)
                .timeout(ACK_TIMEOUT_DEFAULT)
                .emit(event, data, _acknowledgement);
        });
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
        emit,
        reset,
    }));
}

export { useEmit, useEmitWithAck };
