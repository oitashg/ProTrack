import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      <button
        onClick={() => navigate('/students')}>
        Go to Table
      </button>

      <ThemeToggle/>
    </div>
  )
}

export default Home
