interface IEventScreenViewStateModel {
    currentTime: string;
}

export class SetEventScreenViewState {
    static readonly type = '[EventScreenView] SetEventScreenViewState';
    constructor(public newState: IEventScreenViewStateModel) {}
}

export class SetEventScreenViewTime {
    static readonly type = '[EventScreenView] SetEventScreenViewTime';
    constructor(public newTime: any) {}
}