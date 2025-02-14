import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css"

const Header = ({ showIcon, iconCount, category, error, loading, item }) => {

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
            {console.log(item.filter(itm => itm.quantity !== 0))}
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
                            {!showIcon && <h1>Your Shopping basket is empty!</h1>}
                            {showIcon && <>
                                <h2 className="item-table-header">Item</h2>
                                <h2 className="price-table-header">Price</h2>
                                <h2 className="quantity-table-header">Quantity</h2>
                                <h2 className="remove-table-header">Remove</h2>
                            </>}
                            {showIcon && item.filter(itm => itm.quantity !== 0).map((itm) => (
                                <>
                                    <p className="product-title">{itm.title}</p>
                                    <p className="product-price">£{itm.price}</p>
                                    <p className="product-quantity">{itm.quantity}</p>
                                    <i className="fa fa-trash-o"></i>
                                </>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button onClick={'#'}>Checkout</button>
                            <button onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Header;