import React from "react";
import "./App.css";
import ContextAllPost from "./contextStore/AllPostContext";
import ContextAuth from "./contextStore/AuthContext";
import ContextPost from "./contextStore/PostContext";
import SellerContextProvider from "./contextStore/SellerContext";
import AdminContextProvider from "./contextStore/AdminContext";
import { NotificationProvider } from "./Components/Notification/NotificationProvider";
import MainRoutes from "./Routes/MainRoutes";
import GoogleAuthDebug from "./Components/Debug/GoogleAuthDebug";

function App() {
  return (
    <div>
      <NotificationProvider>
        <ContextAuth>
          <SellerContextProvider>
            <AdminContextProvider>
              <ContextAllPost>
                <ContextPost>
                  <MainRoutes />
                  {/* Debug component - remove after fixing Google auth */}
                  <GoogleAuthDebug />
                </ContextPost>
              </ContextAllPost>
            </AdminContextProvider>
          </SellerContextProvider>
        </ContextAuth>
      </NotificationProvider>
    </div>
  );
}

export default App;
