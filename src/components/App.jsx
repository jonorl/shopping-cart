import Header from "./Header"
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation(); // for Router
  const [category, setCategory] = useState([]); // This is for showing in categories
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState([]) // This is for showing in the basket
  const [showIcon, setShowIcon] = useState(false) // display the basket when items are added
  const [iconCount, setIconCount] = useState(0) // display the amount of items in basket
  const [totalPrice, setTotalPrice] = useState(0) // total display for checkout basket
  const [totalQuantity, setTotalQuantity] = useState(0) // total display for checkout basket
  
  // This is to do with router Outlet
  const pathParts = location.pathname.split('/');
  const categoryName = pathParts[2];

  const addToCart = (id) => {

    // Updates the basket with whatever amount there is

    setBasket((prevItems) =>
      prevItems.map((basket) =>
        basket.id === id ? { ...basket, quantity: basket.quantity } : basket
      )
    );

    // Check if any items are over quantity 0 and then trigger the showIcon to flag there are items.
    const triggerShoppingIcon = basket.some((itm) => itm.quantity > 0);
    setShowIcon(triggerShoppingIcon);
  }

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

  useEffect(() => {

    // Check how many items are over quantity 0 and display the right amount.
    const countGreaterThanZero = basket.filter((itm) => itm.quantity > 0).length;
    setIconCount(countGreaterThanZero > 0 ? countGreaterThanZero : 0); // Ensure iconCount is 0 if no items
  }, [basket]); // Run this effect whenever the basket changes


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


  // Checks if all items were removed in the basket and hides the quantity icon.
  useEffect(() => {
    totalQuantity > 0 ? setShowIcon(true) : setShowIcon(false)
  }
    , [totalQuantity]
  )

  // API data fetching
  useEffect(() => {
    setLoading(true);
    const fetchUrl = categoryName
      ? `https://fakestoreapi.com/products/category/${categoryName.toLowerCase()}`
      : 'https://fakestoreapi.com/products/categories';

    fetch(fetchUrl, { mode: "cors" })
      .then(response => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then(response => {
        setCategory(response);
        
        // Only process products, not categories
        if (Array.isArray(response) && typeof response[0] !== 'string') {
          const newProducts = response.map(product => ({
            ...product,
            quantity: 0
          }));
          
          // Merge new products with existing basket, preserving quantities
          setBasket(prevBasket => {
            const merged = [...prevBasket];
            newProducts.forEach(newProduct => {
              const existingIndex = merged.findIndex(item => item.id === newProduct.id);
              if (existingIndex === -1) {
                merged.push(newProduct);
              }
            });
            return merged;
          });
        }
      })
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, [categoryName]);

  // Outlet needs to pass props differently!

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
            setBasket
          }}
        />
      </main>
    </>
  );
}

export default App;