
import { useMouseStore } from "../stores/mouse-store";
import { getMouseCoords } from "./utils";


function setupCanvasListeners(canvas: HTMLCanvasElement) {
    const mouse = useMouseStore();

    function onMouseUpMouseMove(ev: MouseEvent) {
        mouse.handleMouseUpMouseMove(getMouseCoords(ev));
    }

    function onMouseDownMouseMove(ev: MouseEvent) {
        mouse.handleMouseDownMouseMove(getMouseCoords(ev));
    }


    function onMouseDown(ev: MouseEvent) {
        mouse.handleMouseDown(getMouseCoords(ev));

        canvas.removeEventListener("mousemove", onMouseUpMouseMove);
        canvas.addEventListener("mousemove", onMouseDownMouseMove);
    }


    function onMouseUp(ev: MouseEvent) {
        mouse.handleMouseUp(getMouseCoords(ev));

        canvas.removeEventListener("mousemove", onMouseDownMouseMove);
        canvas.addEventListener("mousemove", onMouseUpMouseMove);
    }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseUpMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
}


export { setupCanvasListeners };
