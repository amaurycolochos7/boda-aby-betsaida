'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getSession, signOut } from '@/lib/auth';
import '../dashboard.css';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const session = await getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUserEmail(session.user.email || '');
      setLoading(false);
    } catch {
      router.push('/login');
    }
  }

  async function handleLogout() {
    await signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="dash-page">
        <div className="dash-loading">
          <div className="dash-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-layout">
        {/* Sidebar */}
        <aside className="dash-sidebar">
          <div className="dash-sidebar-brand">
            <h2>EventControl</h2>
            <span>{userEmail}</span>
          </div>

          <nav className="dash-nav">
            <Link
              href="/dashboard"
              className={pathname === '/dashboard' ? 'active' : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Mis Eventos
            </Link>
            <Link
              href="/dashboard/create"
              className={pathname === '/dashboard/create' ? 'active' : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Crear Evento
            </Link>
          </nav>

          <div className="dash-logout">
            <button onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dash-main">
          {children}
        </main>
      </div>
    </div>
  );
}
