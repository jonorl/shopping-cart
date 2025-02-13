import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css"

const Header = ({ showIcon, iconCount, category, error, loading}) => {

    const [categoryDropdown, setCategoryDropdown] = useState(null);
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
            .then((response) => setCategoryDropdown(response))
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>A network error was encountered</p>;

    return (
        <div className="header">
            {console.log(iconCount)}
            <Link to="./">Home</Link>
            <div className="category-content">
                <Link className="categories-header" to="Categories">Categories</Link>
                <div className="categories-dropdown">
                    {categoryDropdown.map((cat, index) => (
                        <Link key={index} to={`Categories/${cat}`}>{cat}</Link>
                    ))}
                </div>
            </div>
            <div className="shopping-cart">
                <i onClick={handleShowModal} className="fa fa-shopping-cart"></i>
                {showIcon && <a className="icon-shopping-cart"><div className="shopping-total">{iconCount}</div></a>}
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Your Shopping Basket</h2>
                        </div>
                        <div className="modal-body">
                        <h1>Your Shopping basket</h1>
                            {category.filter(cat => cat.quantity !== '0').map((cat, index) => (
                                    <ul className="product-card" data-index-number={index} key={index}>
                                        <h2 className="product-title">{cat.title}</h2>
                                    </ul>
                            ))}
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