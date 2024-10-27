import { useAuth } from "../context/AuthContext"


const Home = () => {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated) {
        console.log("please log in");

    }
    return (
        <div>Home</div>
    )
}

export default Home