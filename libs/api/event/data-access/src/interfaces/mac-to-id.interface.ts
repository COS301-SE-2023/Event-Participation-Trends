
export interface IMacToId{
    mac: string | undefined | null, 
    id: number | undefined | null,
}

export class MacToId implements IMacToId{
    mac: string | undefined | null; 
    id: number | undefined | null;
}