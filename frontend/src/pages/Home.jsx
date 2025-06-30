import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/ModeToggle';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="text-center space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            ProTrack
          </h1>
          <Button size="lg" className="w-full" onClick={() => navigate('/students')}>
            Go to Table
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <ModeToggle />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
