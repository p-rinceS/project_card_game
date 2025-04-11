import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/dev" element={<Home title={"Project Prism"} description={"don't sue me, im not ready"}/>} />
            </Routes>
        </BrowserRouter>
  )
}

export default App
