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

export class SetSearchedCategories {
    static readonly type = '[Comparingevents] SetSearchedCategories';
    constructor(public searchedCategories: string[]) {}
}