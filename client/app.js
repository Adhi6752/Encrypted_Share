import React from "react";
import  ReactDOM  from "react-dom/client";
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
import Upload from "./src/components/Upload";
import Download from "./src/components/Download";

const router = createBrowserRouter([
    {
        path: "/",
        element:<>
            <Header/>
            <Upload />
            <Footer />
        </> 
    },
    {
        path : "/:file_id/:file_key",
        element:<>
            <Header/>
            <Download/>
            <Footer/>
        </>
    }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);