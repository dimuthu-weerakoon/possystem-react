import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, FormEvent } from "react";
import { ItemType } from "../types/ItemType";
import { SaleEntryType } from "../types/SaleEntryType";
import { useNavigate } from "react-router";



const Sale = () => {
  const { isAuthenticated, jwtToken } = useAuth();
  const [items, setItems] = useState<ItemType[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [tempCartItems, setTempCartItems] = useState<SaleEntryType[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemType | undefined>();
  const [paymentStatus, setPaymentStatus] = useState<string>();

  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  const navigate = useNavigate()

  let sLLKR = new Intl.NumberFormat('si-LK', {
    style: 'currency',
    currency: 'LKR',
  });

  const createSale = async () => {
    const saleRequestBody = {
      saleLineItemRequests: tempCartItems.map(({ itemId, quantity }) => ({
        itemId,
        quantity,
      })),
      paymentStatus: paymentStatus
    };



    try {
      const res = await axios.post("http://localhost:8080/sales", saleRequestBody, config);
      console.log(await res.data);
      const refNo = res.data.saleNumber;

      if (refNo) {

        clearCart();
        loadItems();
        navigate(`/invoices/${refNo}`);
      }

    } catch (error) {
      console.error("Error creating sale", error);
    }
  };




  const clearCart = () => {
    setTempCartItems([])
  }

  const addToCart = (e: FormEvent) => {
    e.preventDefault();
    if (selectedItem && quantity > 0) {
      const saleEntry: SaleEntryType = {
        itemId: selectedItem.itemId,
        itemName: selectedItem.itemName,
        quantity,
        unitPrice: selectedItem.unitPrice,
        amount: selectedItem.unitPrice * quantity
      };
      setTempCartItems((prevCart) => [...prevCart, saleEntry]);
      setSelectedItem(undefined);
      setQuantity(1);
    }
  };

  const removeCart = (index: number) => {
    setTempCartItems(tempCartItems.filter((_, i) => i !== index));
  };


  const loadItems = async () => {

    try {
      const res = await axios.get("http://localhost:8080/items", config);
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };



  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated]);

  return (
    <div className=" container m-2">
      <h2 className="font-semibold text-2xl">Make sale</h2>
      <div className="flex flex-row justify-between mt-2 gap-4">

        <form onSubmit={addToCart} className="border w-full border-slate-300 rounded-md p-2 flex flex-row  justify-center gap-4">


          <div className="flex flex-col">
            <label htmlFor="" className="m-1 font-medium">Item/Product</label>
            <select
              className="border border-slate-300 font-medium rounded-md"
              value={selectedItem?.itemId || ""}
              onChange={(e) => {
                const selected = items.find((item) => item.itemId === Number(e.target.value));
                setSelectedItem(selected);
                console.log(selectedItem?.currentStock);
                console.log(selectedItem?.itemName);


              }}
            >
              <option className="rounded-md font-medium border" value="" disabled>
                Select Item
              </option>
              {items.map((item) => (
                <option className="rounded-md font-medium border" key={item.itemId} value={item.itemId}>
                  {`${item.itemName}`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="" className="font-medium m-1">Availble Stocks</label>
            <span className={`${selectedItem?.currentStock === 0 || selectedItem && selectedItem?.currentStock < quantity ? 'text-red-800' : 'text-green-800'} font-medium `}>
              {selectedItem && selectedItem.currentStock == 0 ? (` Out of stock`) :
                selectedItem && selectedItem?.currentStock < quantity ? `Stock Limited` :
                  selectedItem && (selectedItem?.currentStock + ` Stocks`)}</span>
          </div>


          <div className="flex flex-col items-center" >
            <label htmlFor="" className="m-1 font-medium">Quantity</label>
            <input
              className="border border-slate-300 font-medium rounded-md"
              type="number"
              min={0}
              onChange={(e) => setQuantity(Number(e.target.value))}
              value={quantity}
            />
          </div>


          <div className="flex flex-col items-center justify-center m-2 mt-8">
            <button type="submit" className={!selectedItem || selectedItem.currentStock === 0 || selectedItem.currentStock < quantity ?
              `bg-gray-500 p-2 text-gray-300 rounded-md font-semibold text-xl`
              : `bg-purple-500 p-2 font-semibold text-green-800 rounded-md text-xl`}
              disabled={!selectedItem || (selectedItem?.currentStock < quantity || selectedItem?.currentStock === 0)}>
              +
            </button>
          </div>

        </form>


        <div className="w-full">
          {tempCartItems.length > 0 ? (
            <>
              <table className=" text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th className="px-6 py-3">Item Name</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">UnitPrice</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {tempCartItems.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" >{entry.itemName}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" >{entry.quantity}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" >{sLLKR.format(entry.unitPrice)}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" >{sLLKR.format(entry.amount)}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" >
                        <button className="py-1 px-2 rounded-md hover:bg-red-800 hover:text-red-200 bg-red-200 text-red-800" onClick={() => removeCart(index)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-row gap-3">
                <select className="rounded-md font-medium border" onChange={(e) => setPaymentStatus(e.target.value)} >
                  <option value="" selected disabled>Select Payment Status</option>
                  <option value="PAID" className="checked:text-white checked:bg-green-800 bg-green-300 text-green-800 font-medium">PAID</option>
                  <option value="UNPAID" className="checked:text-white checked:bg-yellow-800 bg-yellow-300 text-yellow-800 font-medium">UNPAID</option>
                </select>
                <button type="button" className={tempCartItems.length === 0 || !paymentStatus || paymentStatus === "" ?
                  `py-1 px-2 font-semibold rounded-md bg-gray-200 text-gray-600` :
                  `py-1 px-2 font-semibold rounded-md hover:bg-green-800 hover:text-green-200 bg-green-200 text-green-800`
                } onClick={createSale} disabled={tempCartItems.length === 0 || !paymentStatus || paymentStatus === ""}>
                  Complete Sale
                </button>

              </div>



            </>
          ) : (<div className="flex flex-row justify-center">
            <h4>Add Itmes for Sale</h4>
          </div>)}


        </div>
      </div>
    </div>


  );
};

export default Sale;
