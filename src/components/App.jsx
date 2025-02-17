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
  const [previousResponse, setPreviousResponse] = useState(null);
  const pathParts = location.pathname.split('/');
  const categoryName = pathParts[2];

  const addToCart = () => {
    const triggerShoppingIcon = basket.some(itm => itm.quantity > 0);
    triggerShoppingIcon ? setShowIcon(true) : setShowIcon(false)
    const countGreaterThanZero = basket.filter(itm => itm.quantity > 0).length;
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
    basket.length === 0 && setShowIcon(false)
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
      const countGreaterThanZero = basket.filter(itm => itm.quantity > 0).length;
      countGreaterThanZero > 0 && setIconCount(countGreaterThanZero)
  };

  useEffect(() => {
    basket.length === 0 && setShowIcon(false)
  },[basket])
 
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
    totalQuantity > 0 ? setShowIcon(true) :setShowIcon(false)}
    ,[totalQuantity]
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
              ? response.map((item) => ({
                  ...item,
                  quantity: item.quantity !== undefined ? item.quantity : 0,
              }))
              : response;


        // Testing potential fix

        setItem((prevItems) => {
          const newItems = processedResponse.filter(newItem => {
              return !prevItems.some(existingItem => existingItem.id === newItem.id);
          });
          return [...prevItems, ...newItems];
      });

        // setItem(processedResponse)
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