import { useEffect, useState } from "react";

const Categories = () => {

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
        <div className="categories-main-dropdown">
            {category.map((cat, index) => (
                <ul key={index}>{cat}</ul>
            ))}
        </div>
    );
};

export default Categories;
