import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Compose from './pages/Compose'
import Result from './pages/Result'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/compose" element={<Compose />} />
      <Route path="/r/:slug" element={<Result />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
