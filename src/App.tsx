
import './App.css'
import LoginForm from './login/LoginForm'
import DashBoard from './Dashboard/DashBoard'
import NotFound from './notFound/NotFound'
import { Route, Routes } from 'react-router-dom'
// import Test from './login/test'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* <Test /> */}
    </>
  )
}

export default App
