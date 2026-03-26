import { Routes, Route } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Home from "./Pages/Home"; 
import About from "./Pages/About";
import Departments from "./Pages/Departments";
import SpecialistList from "./components/SpecialistList";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import SpecialistDetails from "./Pages/SpecialistDetails";
import Dashboard from "./Pages/Dashboard";

import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="departments" element={<Departments />} />
        <Route path="specialists" element={<SpecialistList />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="specialist/:id" element={<SpecialistDetails />} />
        <Route path="appointments" element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
