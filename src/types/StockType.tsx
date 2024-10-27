

export interface StockType {
    stockId: number;
    batchNumber: string;
    userId: number;
    username: string;
    receivedAt: string;
    stockLineItemReponses: []
}


export interface StockRequestType {
    itemId: number;
    quantity: number;
    unitPrice: number;
}

export interface StockEntryType {
    itemId: number;
    itemName:string;
    quantity: number;
    unitPrice: number;
    amount:number;
}