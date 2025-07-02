import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const Home = () => {
  const navigate = useNavigate();
  const svgbg = '../code-forces.svg';

  const { theme } = useTheme()

  return (
    <div className="w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      <div className='w-3/4 h-screen'>
        <img src={svgbg} alt="bg" className={theme === 'dark' ? 'h-full w-full bg-gray-900' :  'h-full w-full bg-gray-100'} />
      </div>


      <div className="w-1/4 h-screen flex items-center justify-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">

        <div className='flex flex-col gap-4 border-2 border-white dark:border-gray-800  w-full h-full items-center justify-center'>
          <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            ProTrack
          </p>
          <Button className='px-4 py-2' onClick={() => navigate('/students')}>
            Let's Go
          </Button>
        </div>

      </div>

      <div className="absolute bottom-4 right-4">
          <ModeToggle />
        </div>

    </div>
  );
};

export default Home;
