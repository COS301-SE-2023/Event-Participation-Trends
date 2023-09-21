
export interface IImageUploadRequest {
    eventId: string | undefined | null,
    imgBase64: string | undefined | null;
    imageObj: string | undefined | null;
    imageScale: number | undefined | null;
    imageType: string | undefined | null;
}