import React, { useState } from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from './routes/layout/layout';
import ListPage from './routes/listPage/listPage';
import AddInfluencerPage from './routes/addInfluencerPage/addInfluencerPage'
// import { ListPage } from './routes/listPage/listPage';



const App: React.FC = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout/>
      ),
      children: [
        {
          path: "/",
          element: (
            <ListPage/>
          )
        },
        {
          path: "/add-influencer",
          element: (
            <AddInfluencerPage/>
          )
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router}/>
  )
}

export default App
