import Header from "./Header"
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState([]);
  const [basket, setBasket] = useState([])
  const [showIcon, setShowIcon] = useState(false)
  const [iconCount, setIconCount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const pathParts = location.pathname.split('/');
  const categoryName = pathParts[2];

  const addToCart = () => {
    const triggerShoppingIcon = item.some(itm => itm.quantity > 0);
    triggerShoppingIcon ? setShowIcon(true) : setShowIcon(false)
    const countGreaterThanZero = item.filter(itm => itm.quantity > 0).length;
    countGreaterThanZero > 0 && setIconCount(countGreaterThanZero)
  }

  const handleQuantityAdd = (id) => {
    setItem((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    setBasket((prevItems) =>
      prevItems.map((basket) =>
        basket.id === id ? { ...basket, quantity: basket.quantity + 1 } : basket
      )
    );
  };

  const handleQuantitySubtract = (id) => {
    setItem((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
    setBasket((prevItems) =>
      prevItems.map((basket) =>
        basket.id === id && basket.quantity > 0 ? { ...basket, quantity: basket.quantity - 1 } : basket
      )
    );
  }

  const removeItem = (id) => {
    setItem((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: 0 } : item
      )),

    setBasket((prevItems) =>
      prevItems.map(basket =>
        basket.id === id ? {...basket, quantity: 0} : basket
      ))
    basket.length === 0 && setShowIcon(false)
  };

  // Get the total money to pay
  useEffect(() => {
    let addedVal = 0
    showIcon && item.filter(itm => itm.quantity !== 0).map((itm) => (addedVal = addedVal + itm.quantity * itm.price))
    setTotalPrice(addedVal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  } // Regex to add comma separator for thousands!
    , [showIcon, item]);

  // Get the total quantity amount
  useEffect(() => {
    let addedQuantity = 0
    showIcon && item.filter(itm => itm.quantity !== 0).map((itm) => (addedQuantity = addedQuantity + itm.quantity))
    setTotalQuantity(addedQuantity)
  }
    , [showIcon, item]);

  useEffect(() => {
    setLoading(true);

    const fetchUrl = categoryName
      ? `https://fakestoreapi.com/products/category/${categoryName.toLowerCase()}`
      : 'https://fakestoreapi.com/products/categories';

    fetch(fetchUrl, { mode: "cors" })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => {
        // If we're fetching products (not categories), add quantity
        const processedResponse = Array.isArray(response) && typeof response[0] !== 'string'
          ? response.map((item) => ({
            ...item,
            quantity: 0,
          }))
          : response;

        setItem(processedResponse)
        item.length === 0 && setBasket(processedResponse)
        setCategory(response);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [categoryName, item.length]);

  return (
    <>
      <Header showIcon={showIcon} iconCount={iconCount} error={error} loading={loading} item={item} totalPrice={totalPrice} totalQuantity={totalQuantity} removeItem={removeItem} basket={basket} />
      <main>
        <Outlet
          context={{
            loading,
            category,
            name: categoryName,
            item,
            handleQuantityAdd,
            handleQuantitySubtract,
            addToCart,
            error
          }}
        />
      </main>
    </>
  );
}

export default App;