import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'ChinaScape - 中国旅游',
  description: 'Plan your perfect journey through China.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="app">
          {/* TOPBAR */}
          <div className="topbar">
            <Link href="/" className="topbar-logo" style={{ textDecoration: 'none' }}>
              ChinaScape <span>中国旅游</span>
            </Link>
            <div className="topbar-nav">
              <Link href="/" className="nav-item">Home</Link>
              <Link href="/itinerary" className="nav-item">Itinerary</Link>
              <Link href="/cultural" className="nav-item">Cultural Guide</Link>
              <Link href="/attractions" className="nav-item">Explore</Link>
            </div>
            <div className="topbar-right">
              <div className="search-wrap">
                <input type="text" placeholder="Search attractions..." />
                <button>Search</button>
              </div>
              <Link href="/profile" className="profile-btn" style={{ textDecoration: 'none' }}>
                <div className="profile-av">旅</div>
                My Profile
              </Link>
            </div>
          </div>
          
          {/* MAIN CONTENT */}
          {children}
        </div>
      </body>
    </html>
  );
}