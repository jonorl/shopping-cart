import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

function Categories() {
    const { name } = useParams();
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState([])

    const handleQuantityAdd = (id) => {
        setItem((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      };

    const handleQuantitySubtract = (id) => {
        setItem((prevItems) =>
            prevItems.map((item) =>
              item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
            )
          );
    };

    useEffect(() => {

        fetch(`https://fakestoreapi.com/products/${typeof (name) !== 'undefined' ? 'category/' + name.toLowerCase() : 'categories'}`, { mode: "cors" })
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error("server error");
                }
                return response.json();
            })
            .then((response) => {
                const itemsWithQuantity = response.map((item) => ({
                    ...item,
                    quantity: 0,
                  }));
                setItem(itemsWithQuantity)
                setCategory(response)})
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    }, [name]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>A network error was encountered</p>;
    return (
        <>

            <h2>Category: {name}</h2>
            {!loading && typeof (category[0]) !== 'string' ? (
                <div className="products-container">
                    {category.map((cat, index) => (
                        <ul className="product-card" data-index-number={index} key={index}>
                            <h2 className="product-title">{cat.title}</h2>
                            <p className="product-descrpition">{cat.description}</p>
                            <p className="product-price">£{cat.price}</p>
                            <div className="add-to-cart" key={index}>
                                <button onClick={() => handleQuantitySubtract(item[index].id)} className="subtract">-</button>
                                <button className="quantity">{item[index].quantity}</button>
                                <button onClick={() => handleQuantityAdd(item[index].id)} className="add">+</button>
                            </div>
                            <button className="add-cart">Add to cart</button>
                            <img src={cat.image} alt="" />
                        </ul>

                    ))}
                </div>
            ) : (
                <div className="categories-selection">
                    {category.map((cat, index) => (
                        <Link key={index} to={cat}>{cat}</Link>
                    ))}
                </div>
            )}
        </>
    );
};

export default Categories;
