import { Injectable } from "@angular/core";

interface PreservedSearchProductState {
    searchValue?: string;
    currentPage?: number;
    perPage?: number;
}

@Injectable({
    providedIn: "root",
})
export class PreserveSearchProductService {
    private lastSearch: PreservedSearchProductState;

    get searchState(): PreservedSearchProductState {
        return this.lastSearch;
    }

    set searchState(lastSearch: PreservedSearchProductState) {
        this.lastSearch = lastSearch;
    }

    constructor() {}
}