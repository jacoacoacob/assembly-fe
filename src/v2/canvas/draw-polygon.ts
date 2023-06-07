
interface Polygon {
    nSides: number;
    x: number;
    y: number;
    r: number;
    strokeStyle: string;
    fillStyle: string;
}

function drawPolygon(ctx: CanvasRenderingContext2D, polygon: Polygon) {
    const { nSides, x, y, r, strokeStyle, fillStyle } = polygon;

    ctx.beginPath();
    // moves the 'pen' to the center of the polygon
    ctx.translate(x, y);

    for (let i = 0; i < nSides; i++) {
        // calculate the rotation in radians
        const rotation = ((Math.PI * 2) / nSides) * i;

        const xNext = r * Math.cos(rotation);
        const yNext = r * Math.sin(rotation);

        if (i === 0) {
            ctx.moveTo(xNext, yNext);
        } else {
            ctx.lineTo(xNext, yNext);
        }
    }

    ctx.closePath();
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.fillStyle = fillStyle;
    ctx.fill();

    ctx.resetTransform();
}

export { drawPolygon };
