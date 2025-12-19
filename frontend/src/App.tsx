import { Emergency } from './Emergency'
import { Route, Routes } from 'react-router-dom'
import { EmergencyStatus } from './EmergencyStatus'
import { AdminDashboard } from './AdminDashboard'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<AdminDashboard />} />
        <Route path='/emergency' element={<Emergency/>}/>
        <Route path='/emergency/:id' element={<EmergencyStatus/>} />
      </Routes>
    </>
  )
}

export default App
