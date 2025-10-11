import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Laptop from "./pages/laptop";

export default function App() {
   return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/laptop" element={<Laptop />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
