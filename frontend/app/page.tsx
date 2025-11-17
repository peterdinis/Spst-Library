import LibraryNavigation from '@/components/shared/navigation/Navigation';
import { NextPage } from 'next';

const App: NextPage = () => {
  return (
    <div>
      <LibraryNavigation
        userRole="student"
        userName="John Doe"
      />

      <main style={{ padding: '2rem' }}>
        <h1>School Library Management System</h1>
        <p>Welcome to your digital library!</p>
      </main>
    </div>
  );
};

export default App;