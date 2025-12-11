namespace Math {
    /**
     * Linear interpolation between two values.
     * @param start Starting value
     * @param end Ending value
     * @param t Fraction between the start and end points, where 0 is start and 1 is end. Allows extrapolation for values outside of [0, 1]
     * @param extrapolate If true, allows extrapolated values outside of the range [start, end]
     */
    export function lerp(start: number, end: number, t: number, extrapolate: boolean = true): number {
        if (extrapolate)
            return start * (1 - t) + end * t
        else
            return Math.clamp(Math.min(start, end), Math.max(start, end), start * (1 - t) + end * t)
    }
}

enum Axis {
    //% block="x"
    X,
    //% block="y"
    Y
}

namespace controller {
    /**
     * Returns a number [-1, 1] for the input on a given axis on a given controller
     * @param axis X or Y axis
     * @param player Which controller
     */
    export function getAxis(axis: Axis, player: Controller): number {
        if (!player) {
            return 0
        }
        switch (axis) {
            case Axis.Y:
                if (player.up.isPressed())
                    return player.down.isPressed() ? 0 : -1
                else
                    return player.down.isPressed() ? 1 : 0
                break
            case Axis.X:
                if (player.left.isPressed())
                    return player.right.isPressed() ? 0 : -1
                else
                    return player.right.isPressed() ? 1 : 0
                break
        }
        return 0
    }

    export function getXAxis(player: number): number {
        if (player < 1 || player > 2)
            return 0
        return getAxis(Axis.X, player == 1 ? player1 : player2)
    }
}