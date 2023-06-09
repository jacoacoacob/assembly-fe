
type Coords = [number, number];

function getMouseCoords(ev: MouseEvent): Coords {
    return [ev.offsetX, ev.offsetY]
}

export { getMouseCoords };
export type { Coords };
