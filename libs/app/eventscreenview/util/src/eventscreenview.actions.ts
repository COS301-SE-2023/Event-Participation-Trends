interface IEventScreenViewStateModel {
    currentTime: string | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
}

export class SetEventScreenViewState {
    static readonly type = '[EventScreenView] SetEventScreenViewState';
    constructor(public newState: IEventScreenViewStateModel) {}
}

export class SetEventScreenViewTime {
    static readonly type = '[EventScreenView] SetEventScreenViewTime';
    constructor(public newTime: string) {}
}

export class SetEventScreenViewStartTime {
    static readonly type = '[EventScreenView] SetEventScreenViewStartTime';
    constructor(public startTime: string | undefined) {}
}

export class SetEventScreenViewEndTime {
    static readonly type = '[EventScreenView] SetEventScreenViewEndTime';
    constructor(public endTime: string | undefined) {}
}