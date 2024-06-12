import { Injectable } from "@angular/core";

interface PreservedSearchUserState {
    searchValue?: string;
    currentPage?: number;
    perPage?: number;
}

@Injectable({
    providedIn: "root",
})
export class PreserveSearchUserService {
    private lastSearch: PreservedSearchUserState;

    get searchState(): PreservedSearchUserState {
        return this.lastSearch;
    }

    set searchState(lastSearch: PreservedSearchUserState) {
        this.lastSearch = lastSearch;
    }

    constructor() {}
}