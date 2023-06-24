
interface Component<Kind extends string, Value> {
    kind: Kind;
    value: Value;
}


type Position = Component<"position", { x: number; y: number }>;

function position(x?: number, y?: number): Position {
    return {
        kind: "position",
        value: {
            x: x ?? 0,
            y: y ?? 0,
        },
    };
}


type Radius = Component<"radius", number>;

function radius(value?: number): Radius {
    return {
        kind: "radius",
        value: value ?? 0,
    };
}


type Dimension = Component<"dimension", { width: number; height: number }>;

function dimension(width?: number, height?: number): Dimension {
    return {
        kind: "dimension",
        value: {
            width: width ?? 0,
            height: height ?? 0,
        },
    };
}


type Velocity = Component<"velocity", { dx: number; dy: number }>;

function veloctiy(dx?: number, dy?: number): Velocity {
    return {
        kind: "velocity",
        value: {
            dx: dx ?? 0,
            dy: dy ?? 0,
        },
    };
}


type Margin = Component<"margin", number>;

function margin(value?: number): Margin {
    return {
        kind: "margin",
        value: value ?? 0,
    };
}


type FillStyle = Component<"fillStyle", string>;

function fillStyle(value?: string): FillStyle {
    return {
        kind: "fillStyle",
        value: value ?? "black",
    };
}


type StrokeStyle = Component<"strokeStyle", string>;

function strokeStyle(value?: string): StrokeStyle {
    return {
        kind: "strokeStyle",
        value: value ?? "black",
    };
}


type Components = (
    Dimension |
    FillStyle |
    Position |
    StrokeStyle |
    Radius |
    Velocity
);


export {
    dimension,
    fillStyle,
    position,
    strokeStyle,
    radius,
    veloctiy,
};

export type {
    Component,
    Components,
    Dimension,
    FillStyle,
    Position,
    Radius,
    Velocity,
};
