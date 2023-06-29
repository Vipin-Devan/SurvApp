import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthGuard } from './services/auth.guard';
import ProfilePage from './components/profile/Profile';
import EmailsPage from './components/share/emailShare';
import Main from './components/main/Main';
import Survey from './components/survey/Survey';
import Statistics from './components/statistics/Statistics';
import Participant from './components/participant/Participant';
import SurveyProvider from './providers/SurveyProvider';
import QuestionForm from './components/questions/QuestionForm';

const AppRouter: React.FC = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/login' &&
        location.pathname !== '/register' &&
        location.pathname !== '/participant' && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/survey" element={<SurveyProvider />}>
            <Route path="/survey/new" element={<Survey />} />
            <Route path="/survey/:id/edit" element={<Survey />} />
            <Route path="/survey/questions" element={<QuestionForm />} />
          </Route>
          <Route path="/survey/:id/send-by-email" element={<EmailsPage />} />
          <Route path="/survey/:id/stats" element={<Statistics />} />
        </Route>
        <Route path="/participant" element={<Participant />} />
      </Routes>
    </>
  );
};

export default AppRouter;