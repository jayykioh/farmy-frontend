import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PageHeaderProvider } from './contexts/PageHeaderContext';
import { useDiaryOfflineSync } from './hooks/useDiaryOfflineSync';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import WelcomeAuth from './pages/WelcomeAuth';
import OAuthCallback from './pages/OAuthCallback';
import Register from './pages/Register';
import Home from './pages/Home';
import DiaryList from './pages/DiaryList';
import DiaryHistory from './pages/DiaryHistory';
import CreateDiary from './pages/CreateDiary';
import ChatList from './pages/ChatList';
import ChatActive from './pages/ChatActive';
import PlantScan from './pages/PlantScan';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Celebration from './pages/Celebration';
import Reminders from './pages/Reminders';
import CreateReminder from './pages/CreateReminder';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import AccountSettings from './pages/AccountSettings';
import FarmFeed from './pages/FarmFeed';
import SnapDetail from './pages/SnapDetail';
import Insights from './pages/Insights';

// Admin Pages
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRag from './pages/AdminRag';
import AdminScans from './pages/AdminScans';
import AdminSettings from './pages/AdminSettings';
import AdminReminders from './pages/AdminReminders';
import AdminChangePassword from './pages/AdminChangePassword';
import AdminSkins from './pages/AdminSkins';

// Error & Status Pages
import NotFound404 from './pages/NotFound404';
import LoadingScreen from './pages/LoadingScreen';
import NetworkError from './pages/NetworkError';
import MaintenanceMode from './pages/MaintenanceMode';

export function App() {
  useDiaryOfflineSync();

  return (
    <ErrorBoundary>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            borderRadius: '100px',
            background: '#ffffff',
            color: '#1a1a1a',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid rgba(0,0,0,0.05)',
          },
          success: {
            iconTheme: {
              primary: '#008A5E',
              secondary: '#ffffff',
            },
            style: {
              background: '#f2fcf5',
              borderColor: '#e0f6e8',
              color: '#067a3d',
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              background: '#fef2f2',
              borderColor: '#fee2e2',
              color: '#b91c1c',
            }
          }
        }}
      />
      <PageHeaderProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<WelcomeAuth />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/diary" element={<DiaryList />} />
                <Route path="/diary/history/:id" element={<DiaryHistory />} />
                <Route path="/diary/history" element={<DiaryHistory />} />
                <Route path="/diary-history" element={<DiaryHistory />} />
                <Route path="/diary/create" element={<CreateDiary />} />
                <Route path="/chat/active" element={<ChatActive />} />
                <Route path="/chat/active/:sessionId" element={<ChatActive />} />
                <Route path="/chat" element={<ChatList />} />
                <Route path="/scan" element={<PlantScan />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help-support" element={<HelpSupport />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/reminder/create" element={<CreateReminder />} />
                <Route path="/reminders/create" element={<CreateReminder />} />
                <Route path="/celebration" element={<Celebration />} />
                <Route path="/farm-feed" element={<FarmFeed />} />
                <Route path="/snap/:id" element={<SnapDetail />} />

                {/* Admin Routes */}
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/rag" element={<AdminRag />} />
                  <Route path="/admin/scans" element={<AdminScans />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/reminders" element={<AdminReminders />} />
                  <Route path="/admin/change-password" element={<AdminChangePassword />} />
                  <Route path="/admin/skins" element={<AdminSkins />} />
                </Route>
              </Route>

              {/* Error & Status Pages - Outside MainLayout */}
              <Route path="/loading" element={<LoadingScreen />} />
              <Route path="/network-error" element={<NetworkError />} />
              <Route path="/maintenance" element={<MaintenanceMode />} />
              <Route path="/404" element={<NotFound404 />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound404 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PageHeaderProvider>
    </ErrorBoundary>
  );
}

export default App;
