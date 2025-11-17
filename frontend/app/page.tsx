import HomeWrapper from '@/components/home/HomeWrapper';
import LibraryNavigation from '@/components/shared/navigation/Navigation';
import { NextPage } from 'next';

const App: NextPage = () => {
  return (
    <div>
      <LibraryNavigation
        userRole="student"
        userName="John Doe"
      />

      <HomeWrapper />
    </div>
  );
};

export default App;