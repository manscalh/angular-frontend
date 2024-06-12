import { Injectable } from "@angular/core";

interface PreservedSearchCompanyState {
    searchValue?: string;
    currentPage?: number;
    perPage?: number;
}

@Injectable({
    providedIn: "root",
})
export class PreserveSearchCompanyService {
    private lastSearch: PreservedSearchCompanyState;

    get searchState(): PreservedSearchCompanyState {
        return this.lastSearch;
    }

    set searchState(lastSearch: PreservedSearchCompanyState) {
        this.lastSearch = lastSearch;
    }

    constructor() {}
}