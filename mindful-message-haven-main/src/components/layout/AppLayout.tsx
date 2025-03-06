
import { ReactNode } from 'react';
import NavBar from './NavBar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1">
        {children}
      </main>
      
    </div>
  );
}
