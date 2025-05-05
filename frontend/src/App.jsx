import { Routes, Route } from "react-router-dom"
import MainPage from "./pages/MainPage"
import AuthPage from "./pages/AuthPage"

const App = () => {

  return (
    <Routes >
      <Route path="/" element={<AuthPage />} />
      <Route path="/app" element={<MainPage />} />
    </Routes>
  )
}
export default App;
