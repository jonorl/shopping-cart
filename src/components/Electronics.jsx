import { useEffect, useState } from "react";

const Electronics = () => {

        const [items, setItems] = useState(null);
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            fetch("https://fakestoreapi.com/products/categories/Electronics", { mode: "cors" })
                .then((response) => {
                    if (response.status >= 400) {
                        throw new Error("server error");
                    }
                    return response.json();
                })
                .then((response) => setItems(response))
                .catch((error) => setError(error))
                .finally(() => setLoading(false));
        }, []);
    
        if (loading) return <p>Loading...</p>;
        if (error) return <p>A network error was encountered</p>;
    return (
        <div className="categories-main-dropdown">
            {items.map((item, index) => (
                <ul key={index}>{item}</ul>
            ))}
        </div>
    );
};

export default Electronics;
