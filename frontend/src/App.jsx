import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import Spots from "./components/Spots";
import AllSpots from "./components/AllSpots"; 
import DetailedSpot from "./components/DetailedSpot";
import NewSpot from "./components/NewSpot";
import UpdateSpot from "./components/UpdateSpot"

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <AllSpots />
      },
      {
        path: '/spots/current',
        element: <Spots />
      },
      {
        path: '/spots/:spotId',
        element: <DetailedSpot />
      },
      {
        path: '/spots/new',
        element: <NewSpot />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpot />
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;