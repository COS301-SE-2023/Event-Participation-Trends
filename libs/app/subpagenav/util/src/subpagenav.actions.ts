export class SetSubPageNav {
    static readonly type = '[SubPageNav] SetSubPageNav';
    constructor(public currentPage: string, public prevPage: string) { }
}