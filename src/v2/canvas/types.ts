
interface Circle {
    kind: "circle";
    x: number;
    y: number;
    r: number;
}

interface Rect {
    kind: "rect";
    x: number;
    y: number;
    w: number;
    h: number;
}

type Shape = Circle | Rect;

type Slim<S extends Shape> = Omit<S, "kind">;

interface Entity<S extends Shape> {
    id: string;
    strokeStyle: string;
    fillStyle: string;
    boardTileIndex: number; 
    shape: S;
}

export type { Circle, Entity, Rect, Shape, Slim };
