import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css"


const Header = () => {
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

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
            <Link to="./">Home</Link>
            <div className="category-content">
                <Link className="categories-header" to="Categories">Categories</Link>
                <div className="categories-dropdown">
                    {category.map((cat, index) => (
                        <Link key={index} to={`Categories/${cat}`}>{cat}</Link>
                    ))}
                </div>
            </div>
            <button onClick={handleShowModal}>Shopping cart</button>
            {showModal && (
                <div className="modal-overlay"> 
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Your Shopping Basket</h2>
                        </div>
                        <div className="modal-body">
                            <p>Items go dynamically here</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header;