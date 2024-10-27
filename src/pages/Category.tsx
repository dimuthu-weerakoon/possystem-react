import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import { CategoryType } from "../types/CategoryType"

const Category = () => {
    const { isAuthenticated, jwtToken } = useAuth()
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [category, setCategory] = useState<string>("")
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editCategoryId, setEditCategoryId] = useState<number | null>(null) // To store the ID of the category being edited

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    };

    const loadCategories = async () => {
        try {
            const res = await axios.get("http://localhost:8080/categories", config)
            const data = await res.data
            setCategories(data)
        } catch (error) {
            console.error("Error loading categories:", error)
        }
    }

    const createCategory = async (e: any) => {
        e.preventDefault()
        try {
            const categoryRequest = { categoryName: category }
            const res = await axios.post("http://localhost:8080/categories", categoryRequest, config)
            loadCategories()
            setCategory("")
        } catch (error) {
            console.error("Error creating category:", error)
        }
    }

    const deleteCategory = async (categoryId: number) => {
        try {
            const res = await axios.delete(`http://localhost:8080/categories/${categoryId}`, config)
            loadCategories()
        } catch (error) {
            console.error("Error deleting category:", error)
        }
    }

    const updateCategory = async (e: any) => {
        e.preventDefault()
        if (editCategoryId !== null) {
            try {
                const categoryRequest = { categoryName: category }
                const res = await axios.put(`http://localhost:8080/categories/${editCategoryId}`, categoryRequest, config)
                loadCategories()
                setCategory("")
                setIsEditing(false)
                setEditCategoryId(null)
            } catch (error) {
                console.error("Error updating category:", error)
            }
        }
    }

    const handleEditClick = (category: CategoryType) => {
        setIsEditing(true)
        setCategory(category.categoryName)
        setEditCategoryId(category.categoryId)
    }

    useEffect(() => {
        if (isAuthenticated) {
            loadCategories()
        }
    }, [isAuthenticated])

    return (
        <div className="flex flex-row w-full justify-between items-center">
            <div className=" ">
                <h4>Create or Edit Category</h4>
                <form className="">
                    <input
                        className="rounded-md mb-4 border font-medium border-slate-300"
                        type="text"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                    />
                    {isEditing ? (
                        <div>
                            <button type="submit" className="py-1 px-2 rounded-md hover:bg-slate-800 hover:text-slate-200 bg-slate-200 text-slate-800" onClick={updateCategory}>Update Category</button>
                        </div>

                    ) : (
                        <div>
                            <button className="py-1 px-2 rounded-md text-white bg-slate-800 font-medium p-2" type="submit" onClick={createCategory}>Create Category</button>
                        </div>

                    )}
                </form>

            </div>

            <div>
                {categories && categories.length > 0 ?
                    <table className=" text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                            <tr>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3" colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.categoryId}>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{category.categoryName}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"><button className="py-1 px-2 rounded-md hover:bg-purple-800 hover:text-purple-200 bg-purple-200 text-purple-800" onClick={() => handleEditClick(category)}>edit</button></td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"> <button className="py-1 px-2 rounded-md hover:bg-red-800 hover:text-red-200 bg-red-200 text-red-800" onClick={() => deleteCategory(category.categoryId)}>delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : (<div></div>)}
            </div>
        </div>
    )
}

export default Category
