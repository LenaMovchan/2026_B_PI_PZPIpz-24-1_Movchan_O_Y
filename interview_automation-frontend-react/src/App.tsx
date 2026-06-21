import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import AuthPage from './pages/Auth/AuthPage';
import EditPasswordEmailSent from './pages/Auth/EditPasswordEmailSent';
import EditPasswordHandler from './pages/Auth/EditPasswordHandler';
import ForgotPassword from './pages/Auth/ForgotPassword';
import InvalidResetTokenPage from './pages/Auth/InvalidResetTokenPage';
import OAuth2RedirectHandler from './pages/Auth/OAuth2RedirectHandler';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import SignInPage from './pages/Auth/SignInPage';
import SignUpPage from './pages/Auth/SignUpPage';
import SuccessfulSignUp from './pages/Auth/SuccessfulSignUp';
import CandidateSearch from './pages/CandidateSearch/CandidateSearch';
import Home from './pages/Home/Home';
import InterviewPage from './pages/Interview/InterviewPage';
import Statistics from './pages/Profile/components/Statistics/Statistics';
import UserInfoCard from './pages/Profile/components/UserSettings/UserInfoCard/UserInfoCard';
import UserProfileNavigator from './pages/Profile/components/UserSettings/UserProfileNavigator';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './utils/ProtectedRoute';
import InterviewStatsHardcoded from './components/Header/InterviewStatsHardcoded';
import CandidateDirectory from './pages/СandidateDirectory/CandidateDiretory';
import MostCheckedSkills from './components/Header/MostCheckedSkills';
import SkillComplianceStats from './components/Header/SkillComplianceStats';
import InterviewerStatistics from './components/Header/InterviewerStatistics';
import SkillCoverageStats from './components/Header/SkillCoverageStats';
import AllCandidates from './pages/СandidateDirectory/AllCandidates';
import CandidateSearchByEmail from './pages/СandidateDirectory/CandidateSearchByEmail';
import UserProfile from './pages/Profile/components/UserProfile/UserProfile';
import UserProfilePage from './pages/Profile/components/UserProfile/UserProfilePage';

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route
        path="sign-in"
        element={
          <AuthPage>
            <SignInPage />
          </AuthPage>
        }
      />
      <Route
        path="forgot-password"
        element={
          <AuthPage>
            <ForgotPassword />
          </AuthPage>
        }
      />
      <Route
        path="sign-up"
        element={
          <AuthPage>
            <SignUpPage />
          </AuthPage>
        }
      />
      <Route
        path="reset-password"
        element={
          <AuthPage>
            <ResetPasswordPage />
          </AuthPage>
        }
      />
      <Route
        path="thank-you"
        element={
          <AuthPage>
            <SuccessfulSignUp />
          </AuthPage>
        }
      />
      <Route
        path="email-sent"
        element={
          <AuthPage>
            <EditPasswordEmailSent />
          </AuthPage>
        }
      />
      <Route
        path="invalid-link"
        element={
          <AuthPage>
            <InvalidResetTokenPage />
          </AuthPage>
        }
      />

      <Route path="/" element={<Layout />}>
        <Route element={<Home />} index />
        <Route path="oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="edit-password" element={<EditPasswordHandler />} />
        <Route path="candidate-search" element={<CandidateSearch />} />
        <Route path="by-lastname" element={<CandidateDirectory />} />
        <Route path="by-email" element={<CandidateSearchByEmail />} />
        <Route path="all-candidates" element={<AllCandidates />} />
        {/* <Route path="/profile/:id" element={<UserProfilePage />} /> */}

        <Route element={<ProtectedRoute />}>
          <Route path="interview" element={<InterviewPage />} />
          <Route path="interview/:id" element={<InterviewPage />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route
            path="profile/:userId/settings"
            element={<UserProfileNavigator />}
          />
          <Route path="profile/:userId/info" element={<UserInfoCard />} />
          {/* <Route
            path="profile/:userId/statistics"
            element={<InterviewStatsHardcoded />}
          /> */}
          <Route
            path="profile/statistics"
            element={<InterviewerStatistics />}
          />
          <Route
            path="profile/skills-compliance"
            element={<SkillComplianceStats />}
          />
          <Route
            path="profile/skills-coverage"
            element={<SkillCoverageStats />}
          />
          <Route
            path="profile/most-checked-skills"
            element={<MostCheckedSkills />}
          />
          <Route
            path="profile/:userId/my_statistics"
            element={<Statistics />}
          />
        </Route>
        <Route path="*" element={<p>404</p>} />
      </Route>
    </Routes>
  );
}

export default App;
