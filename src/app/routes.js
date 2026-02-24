import { createBrowserRouter } from 'react-router';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import CourseFeedback from './components/CourseFeedback';
import InstructorFeedback from './components/InstructorFeedback';
import ServiceFeedback from './components/ServiceFeedback';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage
  },
  {
    path: '/admin',
    Component: AdminDashboard
  },
  {
    path: '/student',
    Component: StudentDashboard
  },
  {
    path: '/student/feedback/course',
    Component: CourseFeedback
  },
  {
    path: '/student/feedback/instructor',
    Component: InstructorFeedback
  },
  {
    path: '/student/feedback/services',
    Component: ServiceFeedback
  },
  {
    path: '*',
    Component: LoginPage
  }
]);
