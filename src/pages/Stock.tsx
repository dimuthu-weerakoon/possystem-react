import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, FormEvent } from "react";
import { ItemType } from "../types/ItemType";
import { StockEntryType } from "../types/StockType";
import { useNavigate } from "react-router";


const Stock = () => {
  const { isAuthenticated, jwtToken } = useAuth();
  const [items, setItems] = useState<ItemType[]>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [tempCartItems, setTempCartItems] = useState<StockEntryType[]>([]);
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

  const createStock = async () => {
    const stockRequestBody = {
      stockLineItemRequests: tempCartItems.map(({ itemId, quantity, unitPrice }) => ({
        itemId,
        quantity,
        unitPrice
      })),
      paymentStatus: paymentStatus

    };



    try {
      const res = await axios.post("http://localhost:8080/stocks", stockRequestBody, config);
      console.log(await res.data);
      loadItems();
      clearCart();
      const refNo = res.data.batchNumber;

      if (refNo) {

        clearCart();
        loadItems();
        navigate(`/invoices/${refNo}`);
      }
    } catch (error) {
      console.error("Error creating stocks", error);
    }
  };

  const clearCart = () => {
    setTempCartItems([])
  }

  const addToCart = (e: FormEvent) => {

    e.preventDefault();
    if (selectedItem && quantity > 0 && unitPrice > 0) {

      const stockEntry: StockEntryType = {
        itemId: selectedItem.itemId,
        itemName: selectedItem.itemName,
        quantity,
        unitPrice,
        amount: unitPrice * quantity
      };
      setTempCartItems((prevCart) => [...prevCart, stockEntry]);
      setSelectedItem(undefined);
      setQuantity(0);
      setUnitPrice(0);
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
      <h2 className="font-semibold text-2xl">Add Stock</h2>
      <div className="flex flex-row justify-between items-center w-full  mt-2">

        <form onSubmit={addToCart} className="border w-full border-slate-300 rounded-md p-2 flex justify-center flex-row gap-4">


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



          <div className="flex flex-col" >
            <label htmlFor="" className="m-1 font-medium">Quantity</label>
            <input
              className="border border-slate-300 font-medium rounded-md"
              type="number"
              min={0}
              onChange={(e) => setQuantity(Number(e.target.value))}
              value={quantity}
            />
          </div>
          <div className="flex flex-col" >
            <label htmlFor="" className="m-1 font-medium">Unit Price</label>
            <input
              className="border border-slate-300 font-medium rounded-md"
              type="number"
              min={0}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              value={unitPrice}
            />
          </div>


          <div className="flex flex-col items-center justify-center m-2 mt-8">
            <button type="submit" className={!selectedItem || quantity == 0 || unitPrice == 0 ?
              `bg-gray-500 p-2 text-gray-300 rounded-md font-semibold text-xl` :
              `bg-purple-500 p-2 font-semibold text-purple-800 rounded-md text-xl`}
              disabled={!selectedItem || quantity == 0 || unitPrice == 0}>
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
                } onClick={createStock} disabled={tempCartItems.length === 0 || !paymentStatus || paymentStatus === ""}>
                  Complete Stock
                </button>

              </div>
            </>
          ) : (<div className="flex flex-row justify-center">
            <h4>Add Itmes for Stock</h4>
          </div>)}

        </div>

      </div>
    </div>


  );
};

export default Stock;
