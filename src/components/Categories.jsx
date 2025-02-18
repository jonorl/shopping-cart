import { Link, useOutletContext } from "react-router-dom";

function Categories() {
  const {
    loading,
    category,
    name,
    basket,
    handleQuantityAdd,
    handleQuantitySubtract,
    addToCart,
    error,
    setBasket
  } = useOutletContext();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>A network error was encountered</p>;

  return (
    <>
      {name && <h2 className="category-header">Category: {name}</h2>}
      {category && typeof (category[0]) !== 'string' ? (
        <div className="products-container">
          {category.map((cat) => (
            <ul className="product-card" data-index-number={cat.id} key={cat.id}>
              <h2 className="product-title">{cat.title}</h2>
              <p className="product-descrpition">{cat.description}</p>
              <p className="product-price">£{cat.price}</p>
              <div className="add-to-cart" key={cat.id}>
                <button
                  onClick={() => handleQuantitySubtract(cat.id)}
                  className="subtract"
                >–</button>
                {basket.filter((itm) => itm.id === cat.id).map((itm) => (
                  <input key={itm.id} type="number" onChange={(event) => {
                    setBasket((prevBasket) =>
                      prevBasket.map((basketItem) =>
                        basketItem.id === itm.id
                          ? { ...basketItem, quantity: parseInt(event.target.value) } // Update quantity
                          : basketItem 
                      )
                    );
                  }} className="quantity" value={itm.quantity}></input>
                ))}
                <button
                  onClick={() => handleQuantityAdd(cat.id)}
                  className="add"
                >+</button>
              </div>
              <button onClick={() => addToCart(cat.id)} className="add-cart">Add to cart</button>
              <img className="product-image" src={cat.image} alt="" />
            </ul>
          ))}
        </div>
      ) : (
        <div className="categories-selection">
          {category && category.map((cat, index) => (
            <Link key={index} to={cat}>{cat}</Link>
          ))}
        </div>
      )}
    </>
  );
}

export default Categories;