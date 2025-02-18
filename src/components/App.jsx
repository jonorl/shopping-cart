import Header from "./Header"
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const [category, setCategory] = useState([]); // This is for showing in categories
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState([]) // This is for showing in the basket
  const [userQuantity, setUserQuantity] = useState(0)
  const [showIcon, setShowIcon] = useState(false) // display the basket when items are added
  const [iconCount, setIconCount] = useState(0) // display the amount of items in basket
  const [totalPrice, setTotalPrice] = useState(0) // total display for checkout basket
  const [totalQuantity, setTotalQuantity] = useState(0) // total display for checkout basket
  const [previousResponse, setPreviousResponse] = useState(null); // helper hook to add/remove array of items to basket

  // This is to do with router Outlet
  const pathParts = location.pathname.split('/');
  const categoryName = pathParts[2];

  const addToCart = (id) => {

    setBasket((prevItems) =>
      prevItems.map((basket) =>
        basket.id === id ? { ...basket, quantity: basket.quantity } : basket
      )
    );

    // Check if any items are over quantity 0 and then trigger the showIcon to flag there are items.
    const triggerShoppingIcon = basket.some((itm) => itm.quantity > 0);
    setShowIcon(triggerShoppingIcon);
  }

  useEffect(() => {

    // Check how many items are over quantity 0 and display the right amount.
    const countGreaterThanZero = basket.filter((itm) => itm.quantity > 0).length;
    setIconCount(countGreaterThanZero > 0 ? countGreaterThanZero : 0); // Ensure iconCount is 0 if no items
  }, [basket]); // Run this effect whenever the basket changes


  const handleQuantityAdd = (id) => {

    setBasket((prevItems) =>
      prevItems.map((basket) =>
        basket.id === id ? { ...basket, quantity: basket.quantity + 1 } : basket
      )
    );
  };

  const handleQuantitySubtract = (id) => {

    setBasket((prevItems) =>
      prevItems.map((basket) =>
        basket.id === id && basket.quantity > 0 ? { ...basket, quantity: basket.quantity - 1 } : basket
      )
    );
    basket.length === 0 && setShowIcon(false)
  }

  const removeItem = (id) => {

    setBasket((prevItems) =>
      prevItems.map(basket =>
        basket.id === id ? { ...basket, quantity: 0 } : basket
      )
    );
  };

  // Get the total money to pay
  useEffect(() => {
    let addedVal = 0
    showIcon && basket.filter(itm => itm.quantity !== 0).map((itm) => (addedVal = addedVal + itm.quantity * itm.price))
    setTotalPrice(addedVal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  } // Regex to add comma separator for thousands!
    , [showIcon, basket]);

  // Get the total quantity amount
  useEffect(() => {
    let addedQuantity = 0
    showIcon && basket.filter(itm => itm.quantity !== 0).map((itm) => (addedQuantity = addedQuantity + itm.quantity))
    setTotalQuantity(addedQuantity)
  }
    , [showIcon, basket]);

  useEffect(() => {
    totalQuantity > 0 ? setShowIcon(true) : setShowIcon(false)
  }
    , [totalQuantity]
  )

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
        if (JSON.stringify(response) !== JSON.stringify(previousResponse)) {
          setPreviousResponse(response);

          const processedResponse = Array.isArray(response) && typeof response[0] !== 'string'
            ? response.map((basket) => ({
              ...basket,
              quantity: basket.quantity !== undefined ? basket.quantity : 0,
            }))
            : response;

          setBasket((prevBasket) => {
            const newItems = processedResponse.filter(newItem => {
              return !prevBasket.some(existingItem => existingItem.id === newItem.id);
            });
            return [...prevBasket, ...newItems];
          });
          setCategory(response);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [categoryName, previousResponse]);

  return (
    <>
      <Header showIcon={showIcon} iconCount={iconCount} error={error} loading={loading} basket={basket} totalPrice={totalPrice} totalQuantity={totalQuantity} removeItem={removeItem} />
      <main>
        <Outlet
          context={{
            loading,
            category,
            name: categoryName,
            basket,
            handleQuantityAdd,
            handleQuantitySubtract,
            addToCart,
            error,
            userQuantity,
            setUserQuantity,
            setBasket
          }}
        />
      </main>
    </>
  );
}

export default App;