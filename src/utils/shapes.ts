
interface Circle {
    x: number;
    y: number;
    r: number;
}

function isCircleCollision(c1: Circle, c2: Circle) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    return distance < c1.r + c2.r;
}

export { isCircleCollision };
export type { Circle };
