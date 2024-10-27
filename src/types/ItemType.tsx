export interface ItemType {
    itemId: number;
    itemName: string;
    description: string;
    unitPrice: number;
    currentStock: number
    categoryId: number;
    categoryName: string;
}

export interface ItemRequestType {
    itemName: string;
    description: string;
    unitPrice?: number;
    currentStock?: number
    categoryId?: number;
   
}