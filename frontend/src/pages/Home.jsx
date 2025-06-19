import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex flex-col gap-4 items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300'>
      <h1 className="text-xl sm:text-5xl md:text-6xl text-gray-800 dark:text-gray-100 mb-6">
        ProTrack
      </h1>

      <button
        className='cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl text-lg sm:text-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600'
        onClick={() => navigate('/students')}>
        Go to Table
      </button>

      <ThemeToggle/>
    </div>
  )
}

export default Home
