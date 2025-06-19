import { Route, Routes } from 'react-router-dom'
import './App.css'
import StudentTable from './pages/StudentTable'
import Home from './pages/Home'
import StudentProfile from './pages/StudentProfile'

function App() {

  return (
    <div className='w-screen min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/students' element={<StudentTable/>}/>
        <Route path='/students/:id' element={<StudentProfile/>}/>
      </Routes>
    </div>
  )
}

export default App
