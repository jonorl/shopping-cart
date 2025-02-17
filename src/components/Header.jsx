import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css"

const Header = ({ showIcon, iconCount, error, loading, totalPrice, totalQuantity, removeItem, basket }) => {

    const [categoryDropdown, setCategoryDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const checkout = () => {
        alert("Checkout function coming soon!")
    };

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
                        {showIcon && basket.filter(itm => itm.quantity !== 0).length > 0 && (
                            <>
                                <table className="products-table">
                                    <thead>
                                        <tr>
                                            <th className="item-table-header">Item</th>
                                            <th className="price-table-header">Price</th>
                                            <th className="quantity-table-header">Quantity</th>
                                            <th className="remove-table-header">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {showIcon && basket
                                            .filter((itm) => itm.quantity !== 0)
                                            .map((itm) => (
                                                    <tr className="modal-body item-row" key={itm.id}>
                                                        <td className="product-title">{itm.title}</td>
                                                        <td className="product-price">£{itm.price}</td>
                                                        <td className="product-quantity">{itm.quantity}</td>
                                                        <td><i onClick={() => removeItem(itm.id)} className="fa fa-trash-o"></i></td>
                                                    </tr>
                                            ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th className="item-table-footer">Total</th>
                                            <th className="price-table-footer">£{totalPrice}</th>
                                            <th className="product-quantity">{totalQuantity}</th>
                                            <th className="remove-table-footer"></th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </>
                        )}

                        {!showIcon && 
                            <h1>Your Shopping basket is empty!</h1>
                        }

                    </div>
                    <div className="modal-footer">
                        <button onClick={checkout}>Checkout</button>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )
            }

        </div >
    )
}

export default Header;