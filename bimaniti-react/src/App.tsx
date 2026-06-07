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
import { BlogsPage } from './pages/admin/BlogsPage';
import { BlogEditorPage } from './pages/admin/BlogEditorPage';
import { NewsPage } from './pages/admin/NewsPage';
import { NewsEditorPage } from './pages/admin/NewsEditorPage';
import { ContactsPage } from './pages/admin/ContactsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { ContentGenerator } from './pages/admin/ContentGenerator';
import { ProtectedRoute } from './components/ProtectedRoute';

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
              <Route path="blogs" element={<BlogsPage />} />
              <Route path="blogs/new" element={<BlogEditorPage />} />
              <Route path="blogs/:id/edit" element={<BlogEditorPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="news/new" element={<NewsEditorPage />} />
              <Route path="news/:id/edit" element={<NewsEditorPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="generate" element={<ContentGenerator />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
