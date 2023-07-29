export interface IGetFloorplanBoundariesResponse {
    boundaries: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    } | undefined | null;
}