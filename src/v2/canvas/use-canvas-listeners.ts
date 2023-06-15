
import type { Ref } from "vue";
import { useMouseStore } from "../stores/mouse-store";
import { getMouseCoords } from "./utils";


function useCanvasListeners(canvas: Ref<HTMLCanvasElement  | undefined>) {
    const mouse = useMouseStore();

    function onMouseUpMouseMove(ev: MouseEvent) {
        mouse.handleMouseUpMouseMove(getMouseCoords(ev));
    }

    function onMouseDownMouseMove(ev: MouseEvent) {
        mouse.handleMouseDownMouseMove(getMouseCoords(ev));
    }

    function onMouseDown(ev: MouseEvent) {
        mouse.handleMouseDown(getMouseCoords(ev));

        if (canvas.value) {
            canvas.value.removeEventListener("mousemove", onMouseUpMouseMove);
            canvas.value.addEventListener("mousemove", onMouseDownMouseMove);
        }
    }


    function onMouseUp(ev: MouseEvent) {
        mouse.handleMouseUp(getMouseCoords(ev));

        if (canvas.value) {
            canvas.value.removeEventListener("mousemove", onMouseDownMouseMove);
            canvas.value.addEventListener("mousemove", onMouseUpMouseMove);
        }
    }

    return {
        setup() {
            if (canvas.value) {
                canvas.value.addEventListener("mousedown", onMouseDown);
                canvas.value.addEventListener("mousemove", onMouseUpMouseMove);
                canvas.value.addEventListener("mouseup", onMouseUp);
            }
        },
        teardown() {
            if (canvas.value) {
                canvas.value.removeEventListener("mousemove", onMouseDownMouseMove);
                canvas.value.removeEventListener("mousedown", onMouseDown);
                canvas.value.removeEventListener("mousemove", onMouseUpMouseMove);
                canvas.value.removeEventListener("mouseup", onMouseUp);
            }
        },
    };
}


export { useCanvasListeners };
