export class SetError {
    static readonly type = '[Error] Set Error';
    constructor(public readonly error: string | null) {}
}