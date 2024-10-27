import axios from "axios";
import { useAuth } from "../context/AuthContext";


const ItemsLoader = async() => {
    const { isAuthenticated, jwtToken } = useAuth()
    const config = {
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    };

    try {
        if (isAuthenticated && jwtToken) {
            const res = await axios.get("http://localhost:8080/items", config)
            const data = await res.data
            return data
        } else {
            return "please log in"; // Return empty arrays if not authenticated
        }
    } catch (error) {
        console.log(error);
        return error; // Fallback on error to empty arrays
    }
};

export { ItemsLoader };



