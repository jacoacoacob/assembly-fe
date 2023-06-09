import { ref } from "vue";


function useMouse() {
    const downCoords = ref<[number, number]>([-1, -1]);

    return {
        onMouseDown(x: number, y: number) {
            downCoords.value = [x, y];
        },
        onMouseUp() {
            downCoords.value = [-1, -1];
        },
        onMouseMove() {

        },
    };
}

export { useMouse };
