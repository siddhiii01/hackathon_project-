import { useState } from 'react'

import { Emergency } from './Emergency'
import { Route, Routes } from 'react-router-dom'
import { EmergencyStatus } from './EmergencyStatus'

function App() {
  return (
    <>
      <Routes>
        <Route path='/emergency' element={<Emergency/>}/>
        <Route path='/emergency/:id' element={<EmergencyStatus/>} />
      </Routes>
    </>
  )
}

export default App
