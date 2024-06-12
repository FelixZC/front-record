// src/complexFunction.ts
export function complexFunction(input: number): string {
    if (input > 0) {
        if (input % 2 === 0) {
            return 'positive even';
        } else {
            return 'positive odd';
        }
    } else if (input < 0) {
        return 'negative';
    } else {
        return 'zero';
    }
}