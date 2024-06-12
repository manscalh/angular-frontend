export interface IChart {
    Id?: string;
    Chart_name?: string;
    ValueYears?: IValueYears[];
}

export interface IValueYears {
    name?: string,
    y?: number,
    drilldown?: string,
    color?: string,
    dataLabels?: {},
    valueMonths?: IValueMonths[]
}

export interface IValueMonths{
    id: string,
    name?: string,
    y?: number
    drilldown?: string,
    color?: string,
    dataLabels?: {}
}
