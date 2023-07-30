interface IEventScreenViewStateModel {
    currentTime: Date | undefined | null;
    startTime: Date | undefined | null;
    endTime: Date | undefined | null;
    usersDetectedPerHour: {time: string, detected: number}[] | undefined | null;
}

export class SetEventScreenViewState {
    static readonly type = '[EventScreenView] SetEventScreenViewState';
    constructor(public newState: IEventScreenViewStateModel) {}
}

export class SetCurrentTime {
    static readonly type = '[EventScreenView] SetCurrentTime';
    constructor(public currentTime: Date | undefined | null) {}
}

export class SetStartTime {
    static readonly type = '[EventScreenView] SetStartTime';
    constructor(public startTime: Date | undefined | null) {}
}

export class SetEndTime {
    static readonly type = '[EventScreenView] SetEndTime';
    constructor(public endTime: Date | undefined | null) {}
}

export class UpdateUsersDetectedPerHour {
    static readonly type = '[EventScreenView] UpdateUsersDetectedPerHour';
    constructor(public usersDetectedPerHour: {time: string, detected: number}[] | undefined | null) {}
}