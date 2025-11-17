"use client"

import LibraryNavigation from '@/components/shared/navigation/Navigation';
import React, { useState } from 'react';
const App: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div>
      <LibraryNavigation
        userRole="student"
        notificationCount={3}
        userName="John Doe"
        userGrade="Grade 11"
        studentId="S12345"
      />
      
      <main style={{ padding: '2rem' }}>
        <h1>School Library Management System</h1>
        <p>Welcome to your digital library!</p>
      </main>
    </div>
  );
};

export default App;