interface IEventScreenViewStateModel {
    currentTime: Date | undefined | null;
    startTime: Date | undefined | null;
    endTime: Date | undefined | null;
}

export class SetEventScreenViewState {
    static readonly type = '[EventScreenView] SetEventScreenViewState';
    constructor(public newState: IEventScreenViewStateModel) {}
}

export class SetEventScreenViewTime {
    static readonly type = '[EventScreenView] SetEventScreenViewTime';
    constructor(public currentTime: Date | undefined | null) {}
}

export class SetEventScreenViewStartTime {
    static readonly type = '[EventScreenView] SetEventScreenViewStartTime';
    constructor(public startTime: Date | undefined | null) {}
}

export class SetEventScreenViewEndTime {
    static readonly type = '[EventScreenView] SetEventScreenViewEndTime';
    constructor(public endTime: Date | undefined | null) {}
}