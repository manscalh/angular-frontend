import { Injectable } from "@angular/core";

interface PreservedSearchCircularityState {
    searchValue?: string;
    currentPage?: number;
    perPage?: number;
}

@Injectable({
    providedIn: "root",
})
export class PreserveSearchCircularityService {
    private lastSearch: PreservedSearchCircularityState;

    get searchState(): PreservedSearchCircularityState {
        return this.lastSearch;
    }

    set searchState(lastSearch: PreservedSearchCircularityState) {
        this.lastSearch = lastSearch;
    }

    constructor() {}
}