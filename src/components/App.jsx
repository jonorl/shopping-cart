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

  const pathParts = location.pathname.split('/');
  const categoryName = pathParts[2]; 

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
          
        setItem(processedResponse);
        setCategory(response);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [categoryName]); 

  return (
    <>
      <Header />
      <main>
        <Outlet 
          context={{
            loading,
            category,
            name: categoryName,
            item,
            handleQuantityAdd,
            handleQuantitySubtract,
            error
          }}
        /> 
      </main>
    </>
  );
}

export default App;