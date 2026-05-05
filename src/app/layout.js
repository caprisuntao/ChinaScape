import './globals.css';
import Navbar from '@/components/Navbar'; // Import the new component

export const metadata = {
  title: 'ChinaScape - 中国旅游',
  description: 'Plan your perfect journey through China.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="app">
          {/* Replace the old hardcoded topbar with the new component */}
          <Navbar />
          
          {/* MAIN CONTENT */}
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}