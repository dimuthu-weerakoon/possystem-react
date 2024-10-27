import axios from "axios";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { InvoiceType, InvoiceLineTypes } from "../types/InvoiceType";


const SingleInvoice = () => {

  const { isAuthenticated, jwtToken } = useAuth()
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  const [invoice, setInvoice] = useState<InvoiceType>();

  const { refNo } = useParams()


  const fetchInvoice = async () => {

    const res = await axios.get(`http://localhost:8080/invoices/${refNo}`, config)

    const data = await res.data;
    console.log(data);
    setInvoice(data)

  }
  let sLLKR = new Intl.NumberFormat('si-LK', {
    style: 'currency',
    currency: 'LKR',
  });
  useEffect(() => {
    if (isAuthenticated) {
      fetchInvoice()
    }

  }, [isAuthenticated])
  return (
    <div className="flex flex-col w-full">

      <div className="flex flex-row justify-between bg-slate-200 p-3">
        <h2 className="text-2xl font-bold">Comapny/Shop Name</h2>
        <div>
          <div><h4 className="font-medium text-slate-600">Issued on:</h4><span className="font-normal">{invoice ? new Date(invoice.issuedAt).toLocaleDateString("si-LK") : ""}</span></div>
          <div><h4 className="font-medium text-slate-600">Invoice #:</h4><span className="font-normal">{invoice?.invoiceNumber}</span> </div>
          <div><h4 className="font-medium text-slate-600">Ref No #:</h4> <span className="font-normal">{invoice?.refNumber}</span></div>
        </div>
      </div>
      <hr />
      <div className="flex flex-col items-center justify-center ">

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">ITEM</th>
              <th className="px-6 py-3">QTY</th>
              <th className="px-6 py-3">Unit Price</th>
              <th className="px-6 py-3">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              invoice?.invoiceLineItemResponses?.map((invLine: InvoiceLineTypes, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{invLine.itemName}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{invLine.quantity}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{sLLKR.format(invLine.unitPrice)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{sLLKR.format(invLine.totalAmount)}</td>
                </tr>
              ))

            }
            <tr>
              <td></td>
              <td></td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-xl">Sub Total: </td>
              <td className="px-6 py-4 font-medium text-2xl text-gray-900 whitespace-nowrap" >{invoice && sLLKR.format(invoice?.subTotal)}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td><div className="-rotate-12 mt-8">{invoice?.paymentStatus === "PAID" ?
                <span className="rounded-md opacity-50 text-green-600 border border-green-600 p-4 text-4xl bg-green-200 ">
                  {invoice.paymentStatus}</span> :
                <span className="rounded-md text-yellow-600 border border-yellow-600 p-4 text-4xl bg-yellow-200" >
                  {invoice?.paymentStatus}</span>}
              </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
    </div>
  )
}

export default SingleInvoice