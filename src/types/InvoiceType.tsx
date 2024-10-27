export interface InvoiceType {
     invoiceId:number;
     invoiceNumber:string;
     paymentStatus:string;
     issuedAt:string;
     refNumber:string;
     invoiceLineItemResponses:[];
     subTotal:number;
}


export interface InvoiceLineTypes {
     itemName:string;
     quantity:number;
     unitPrice:number;
     totalAmount:number;
}