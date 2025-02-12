import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

function Categories() {
    const { name } = useParams();
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch(`https://fakestoreapi.com/products/${typeof (name) !== 'undefined' ? 'category/' + name.toLowerCase() : 'categories'}`, { mode: "cors" })
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error("server error");
                }
                return response.json();
            })
            .then((response) => setCategory(response))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }, [name]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>A network error was encountered</p>;
    return (
        <>
            <h2>Category: {name}</h2>
            {!loading && (typeof (name) !== "undefined" ? (
                <div className="categories-main-dropdown">
                    {category.map((cat, index) => (
                        <ul key={index}>{cat.title}</ul>
                    ))}
                </div>
            ) : category && typeof category[0] === 'string' ? (
                <div className="categories-main-dropdown">
                    {category.map((cat, index) => (
                        <Link key={index} to={cat}>{cat}</Link>
                    ))}
                </div>
            ) : <p>Loading...</p>)}
        </>
    );
};

export default Categories;
