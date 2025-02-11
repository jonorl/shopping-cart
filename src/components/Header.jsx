import { useEffect, useState } from "react";
import "../styles/Header.css"

const Header = () => {
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://fakestoreapi.com/products/categories", { mode: "cors" })
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error("server error");
                }
                return response.json();
            })
            .then((response) => setCategory(response))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>A network error was encountered</p>;

    return (
        <div className="header">
            <button>Home</button>
            <div className="category-content">
                <button className="categories-button">Categories</button>
                <div className="categories-dropdown">
                    {category.map((cat, index) => (
                        <ul key={index}>{cat}</ul>
                    ))}
                </div>
            </div>
            <button>Shopping cart</button>
        </div>
    )
}

export default Header;