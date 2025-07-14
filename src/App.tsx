
import './App.css'
import LoginForm from './login/LoginForm'
import DashBoard from './Dashboard/DashBoard'
import NotFound from './notFound/NotFound'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Drivers from './Drivers/drivers'
import Rescures from './Rescuers/rescures'
// import Test from './login/test'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/dashboard" element={<DashBoard />} >

            <Route path="" element={null} />
            <Route path="driver-requests" element={<div>Driver Requests</div>} />
            <Route path="rescuer-requests" element={<div>Rescuer Requests</div>} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="rescuers" element={<Rescures/>} />
            <Route path="settings" element={<div>settings</div>} />


          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* <Test /> */}
    </>
  )
}

export default App
