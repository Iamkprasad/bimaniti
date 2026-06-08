import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { News } from './pages/News';
import { Archives } from './pages/Archives';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Post } from './pages/Post';
import { AdminLayout } from './layouts/AdminLayout';
import { Login } from './pages/admin/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

const BlogsPage = lazy(() => import('./pages/admin/BlogsPage').then(m => ({ default: m.BlogsPage })));
const BlogEditorPage = lazy(() => import('./pages/admin/BlogEditorPage').then(m => ({ default: m.BlogEditorPage })));
const NewsPage = lazy(() => import('./pages/admin/NewsPage').then(m => ({ default: m.NewsPage })));
const NewsEditorPage = lazy(() => import('./pages/admin/NewsEditorPage').then(m => ({ default: m.NewsEditorPage })));
const ContactsPage = lazy(() => import('./pages/admin/ContactsPage').then(m => ({ default: m.ContactsPage })));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ContentGenerator = lazy(() => import('./pages/admin/ContentGenerator').then(m => ({ default: m.ContentGenerator })));

function AdminFallback() {
  return <div className="admin-loading">Loading...</div>;
}

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/news" element={<News />} />
              <Route path="/archives" element={<Archives />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/post/:id" element={<Post />} />
            </Route>

            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/blogs" replace />} />
              <Route path="blogs" element={<Suspense fallback={<AdminFallback />}><BlogsPage /></Suspense>} />
              <Route path="blogs/new" element={<Suspense fallback={<AdminFallback />}><BlogEditorPage /></Suspense>} />
              <Route path="blogs/:id/edit" element={<Suspense fallback={<AdminFallback />}><BlogEditorPage /></Suspense>} />
              <Route path="news" element={<Suspense fallback={<AdminFallback />}><NewsPage /></Suspense>} />
              <Route path="news/new" element={<Suspense fallback={<AdminFallback />}><NewsEditorPage /></Suspense>} />
              <Route path="news/:id/edit" element={<Suspense fallback={<AdminFallback />}><NewsEditorPage /></Suspense>} />
              <Route path="contacts" element={<Suspense fallback={<AdminFallback />}><ContactsPage /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<AdminFallback />}><SettingsPage /></Suspense>} />
              <Route path="generate" element={<Suspense fallback={<AdminFallback />}><ContentGenerator /></Suspense>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
