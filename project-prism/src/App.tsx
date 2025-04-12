import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Collection/Home.tsx";
import Items from "./pages/Packs/Items.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home title={"Project Prism"} description={"don't sue me, im not ready"}/>} />
                <Route path="/packs" element={<Items title={"Packs"} />} />
            </Routes>
        </BrowserRouter>
  )
}

export default App
