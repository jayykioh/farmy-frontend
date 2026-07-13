import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PageHeaderProvider } from './contexts/PageHeaderContext';
import { useDiaryOfflineSync } from './hooks/useDiaryOfflineSync';

// Pages
import WelcomeAuth from './pages/WelcomeAuth';
import Register from './pages/Register';
import OnboardingStep1 from './pages/OnboardingStep1';
import OnboardingStep2 from './pages/OnboardingStep2';
import OnboardingStep3 from './pages/OnboardingStep3';
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

// Error & Status Pages
import NotFound404 from './pages/NotFound404';
import LoadingScreen from './pages/LoadingScreen';
import NetworkError from './pages/NetworkError';
import MaintenanceMode from './pages/MaintenanceMode';

export function App() {
  useDiaryOfflineSync();

  return (
    <ErrorBoundary>
      <PageHeaderProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<WelcomeAuth />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding-1" element={<OnboardingStep1 />} />
                <Route path="/onboarding-2" element={<OnboardingStep2 />} />
                <Route path="/onboarding-3" element={<OnboardingStep3 />} />
                <Route path="/home" element={<Home />} />
                <Route path="/diary" element={<DiaryList />} />
                <Route path="/diary/history" element={<DiaryHistory />} />
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
                <Route path="/reminder/create" element={<CreateReminder />} />
                <Route path="/celebration" element={<Celebration />} />
                <Route path="/farm-feed" element={<FarmFeed />} />
                <Route path="/snap/:id" element={<SnapDetail />} />
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
