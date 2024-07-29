import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CheckModalProvider } from "./components/Modal/CheckModalContext";
import { SuccessModalProvider } from "./components/Modal/SuccessModalContext";
import RestaurantSignup from "./pages/RestaurantSignup";
import UserSignup from "./pages/UserSignup";
import RestMain from "./pages/RestMain";
import AdminMain from "./pages/AdminMain";
import UserMain from "./pages/UserMain";
import { MenuModalProvider } from "./components/Modal/MenuModalContext";
import { InputModalProvider } from "./components/Modal/InputModalContext";
import ReservationPage from "./pages/SqsTest";

function App() {
  return (
    <SuccessModalProvider>
    <CheckModalProvider>
    <MenuModalProvider>
    <InputModalProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserMain />}></Route>
        <Route path="/rest" element={<RestMain />}></Route>
        <Route path="/admin" element={<AdminMain />}></Route>
        <Route path="/usersignup" element={<UserSignup />}></Route>
        <Route path="/restaurantsignup" element={<RestaurantSignup />}></Route>
        <Route path="/sqstest" element={<ReservationPage />}></Route>

      </Routes>
    </BrowserRouter>
    </InputModalProvider>
    </MenuModalProvider>
    </CheckModalProvider>
    </SuccessModalProvider>
  );
}

export default App;
