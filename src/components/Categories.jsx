import { Link, useOutletContext } from "react-router-dom";

function Categories() {
  const {
    loading,
    category,
    name,
    item,
    handleQuantityAdd,
    handleQuantitySubtract,
    addToCart,
    error
  } = useOutletContext();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>A network error was encountered</p>;
  
  return (
    <>
      {name && <h2 className="category-header">Category: {name}</h2>}
      {category && typeof (category[0]) !== 'string' ? (
        <div className="products-container">
          {category.map((cat, index) => (
            <ul className="product-card" data-index-number={index} key={index}>
              <h2 className="product-title">{cat.title}</h2>
              <p className="product-descrpition">{cat.description}</p>
              <p className="product-price">£{cat.price}</p>
              <div className="add-to-cart" key={index}>
                <button 
                  onClick={() => handleQuantitySubtract(item[index].id)} 
                  className="subtract"
                >–</button>
                <button className="quantity">{item[index].quantity}</button>
                <button 
                  onClick={() => handleQuantityAdd(item[index].id)} 
                  className="add"
                >+</button>
              </div>
              <button onClick={addToCart} className="add-cart">Add to cart</button>
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