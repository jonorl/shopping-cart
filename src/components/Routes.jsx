import { createBrowserRouter } from "react-router-dom"; 
import App from "./App";
import ErrorPage from "./ErrorPage";
import Categories from "./Categories";
import Home from "./Home"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />, 
    children: [ 
        {
          index: true,
          element: <Home />,
        },
        {
          path: "categories",
          element: <Categories />,
        },
        {
          path: "categories/:name",
          element: <Categories />,
        },
      ],
  },
]);

export default router;
