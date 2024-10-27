import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { CategoryType } from "../types/CategoryType";
import { ItemRequestType, ItemType } from "../types/ItemType";

const Item = () => {
    const { isAuthenticated, jwtToken } = useAuth();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [items, setItems] = useState<ItemType[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editItemId, setEditItemId] = useState<number | null>(null);
    const [itemName, setItemName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [unitPrice, setUnitPrice] = useState<number | undefined>();
    const [currentStock, setCurrentStock] = useState<number | undefined>();
    const [categoryId, setCategoryId] = useState<number | undefined>();

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    };
    let sLLKR = new Intl.NumberFormat('si-LK', {
        style: 'currency',
        currency: 'LKR',
      });
    const loadCategories = async () => {
        try {
            const res = await axios.get("http://localhost:8080/categories", config);
            setCategories(res.data);
        } catch (error) {
            console.log("Error loading categories:", error);
        }
    };

    const loadItems = async () => {
        try {
            const res = await axios.get("http://localhost:8080/items", config);
            setItems(res.data);
        } catch (error) {
            console.error("Error loading items:", error);
        }
    };

    const createItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId || !itemName || !unitPrice || !currentStock) {
            console.error("Please fill out all fields");

        }
        try {
            const itemRequest: ItemRequestType = {
                itemName,
                description,
                unitPrice,
                currentStock,
                categoryId,
            };

            await axios.post("http://localhost:8080/items", itemRequest, config);
            loadItems();
            resetForm();
        } catch (error) {
            console.error("Error creating item:", error);
        }
    }


    const updateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editItemId || !categoryId || !itemName || !unitPrice || !currentStock) {
            console.error("Please fill out all fields");
            return;
        }
        try {
            const itemRequest: ItemRequestType = {
                itemName,
                description,
                unitPrice,
                currentStock,
                categoryId
            }
            await axios.put(`http://localhost:8080/items/${editItemId}`, itemRequest, config);
            loadItems();
            resetForm();
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const handleEditClick = (item: ItemType) => {
        setIsEditing(true);
        setItemName(item.itemName);
        setDescription(item.description);
        setUnitPrice(item.unitPrice);
        setCurrentStock(item.currentStock);
        setCategoryId(item.categoryId);
        setEditItemId(item.itemId);
    };

    const resetForm = () => {
        setItemName("");
        setDescription("");
        setUnitPrice(undefined);
        setCurrentStock(undefined);
        setCategoryId(undefined);
        setEditItemId(null);
        setIsEditing(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadCategories();
            loadItems();
        }
    }, [isAuthenticated]);

    return (
        <div className="w-full container flex flex-row justify-between items-baseline">

            <div className="w-full shadow-sm border border-slate-200 rounded-md p-4 m-2">
                <h4 className="text-center m-4 font-semibold text-xl">Create or Edit Item</h4>
                <form onSubmit={isEditing ? updateItem : createItem}
                    className="flex flex-col font-semibold">
                    <select className="rounded-md mb-4 border border-slate-300" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
                        <option value="" selected disabled>
                            Select Category
                        </option>
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                    <input
                        className="rounded-md mb-4 border border-slate-300"
                        type="text"
                        placeholder="Item Name"
                        onChange={(e) => setItemName(e.target.value)}
                        value={itemName}
                    />
                    <textarea
                        className="rounded-md mb-4 border border-slate-300"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <input
                        className="rounded-md mb-4 border border-slate-300"
                        type="number"
                        placeholder="Unit Price Rs."
                        value={unitPrice ?? ""}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                    />
                    <input
                        className="rounded-md mb-4 border border-slate-300"
                        type="number"
                        placeholder="Current Stock"
                        value={currentStock ?? ""}
                        onChange={(e) => setCurrentStock(Number(e.target.value))}
                    />
                    <div className="flex flex-row justify-start gap-2">
                        <button className="bg-slate-800 max-w-fit p-3 text-white  rounded-md" type="submit">{isEditing ? "Update Item" : "Create Item"}</button>
                        {isEditing && (<button type="button" className="text-slate-800 max-w-fit p-3 border border-slate-400 rounded-md" onClick={resetForm}>Cancel</button>)}
                    </div>

                </form>
            </div>


            <div className="">
                {items.length > 0 ? (
                    <table className=" text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                            <tr>
                                <th className="px-6 py-3">Item Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Unit Price</th>
                                <th className="px-6 py-3">Current Stock</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {items.map((item) => (
                                <tr key={item.itemId}>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" >{item.itemName}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.categoryName}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{sLLKR.format(item.unitPrice)}</td>
                                    <td className={`px-6 py-4 font-medium whitespace-nowrap ${item.currentStock === 0 ? `text-red-800` : `text-gray-900`}`}>{item.currentStock === 0 ? `Out of stock` : item.currentStock}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"><button className="py-1 px-2 rounded-md hover:bg-purple-800 hover:text-purple-200 bg-purple-200 text-purple-800" onClick={() => handleEditClick(item)}>Edit</button></td>
                                </tr>

                            ))}
                        </tbody>

                    </table>) : (
                    <h4>No items</h4>
                )}

            </div>


        </div>
    );
};

export default Item;
