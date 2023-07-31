export class SetCompareEventsState {
  static readonly type = '[Comparingevents] SetCompareEventsState';
  constructor(public newState: any) {}
}

export class UpdateCategories {
  static readonly type = '[Comparingevents] UpdateCategories';
  constructor(public categories: string[]) {}
}
export class GetAllCategories {
  static readonly type = '[Comparingevents] GetAllCategories';
}

export class SetSelectedCategory {
    static readonly type = '[Comparingevents] SetSelectedCategory';
    constructor(public newCategory: string) {}
}

export class GetManagedEventCategories {
    static readonly type = '[Comparingevents] GetManagedEventCategories';
}

export class GetRole {
    static readonly type = '[Comparingevents] GetRole';
}

export class SetRole {
    static readonly type = '[Comparingevents] SetRole';
    constructor(public newRole: string) {}
}