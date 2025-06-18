import { Route, Routes } from 'react-router-dom'
import './App.css'
import StudentTable from './pages/StudentTable'
import Home from './pages/Home'
import StudentProfile from './pages/StudentProfile'

function App() {

  return (
    <div className='text-3xl font-bold underline'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/students' element={<StudentTable/>}/>
        {/* <Route path='/students/:id' element={<StudentProfile/>}/> */}
      </Routes>
    </div>
  )
}

export default App
