
import './App.css'
import LoginForm from './login/LoginForm'
import DashBoard from './Dashboard/DashBoard'
import NotFound from './notFound/NotFound'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
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
            <Route path="drivers" element={<div>Drivers</div>} />
            <Route path="rescuers" element={<div>Rescuers</div>} />
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
