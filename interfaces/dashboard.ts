// Generated by https://quicktype.io

export interface DashboardSummaryResponse {
    ok:   boolean;
    data: Data;
}

export interface Data {
    numberOfOrders:   number;
    paidOrders:       number;
    unPaidOrders:     number;
    numberofClients:  number;
    numberofProducts: number;
    noStockProducts:  number;
    lowStockProducts: number;
}
