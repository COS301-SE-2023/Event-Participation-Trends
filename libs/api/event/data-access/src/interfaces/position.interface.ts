
export interface IPosition {
    id: number | undefined | null,
    x: number | undefined | null,
    y: number | undefined | null,
    timestamp: Date | undefined | null,
}

export class Position{
    id: number | undefined | null;
    x: number | undefined | null;
    y: number | undefined | null;
    timestamp: Date | undefined | null;
}