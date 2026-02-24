import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { authService } from '../services/authService';
import { LogOut, BookOpen, UserCheck, Building2, MessageSquare } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const feedbackOptions = [
    {
      title: 'Course Feedback',
      description: 'Provide feedback on your courses',
      icon: BookOpen,
      path: '/student/feedback/course',
      color: 'bg-blue-500'
    },
    {
      title: 'Instructor Feedback',
      description: 'Rate and review your instructors',
      icon: UserCheck,
      path: '/student/feedback/instructor',
      color: 'bg-green-500'
    },
    {
      title: 'Institutional Services',
      description: 'Share feedback on campus services',
      icon: Building2,
      path: '/student/feedback/services',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-white">Your Voice Matters</CardTitle>
                <CardDescription className="text-indigo-100 mt-2">
                  Help improve your educational experience by sharing your feedback
                </CardDescription>
              </div>
              <MessageSquare className="h-8 w-8 text-white opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-indigo-100">Courses</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-indigo-100">Feedbacks Given</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold">ODD SEM 2026</div>
                <div className="text-sm text-indigo-100">Current Semester</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Options */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedbackOptions.map((option) => (
              <Card
                key={option.title}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(option.path)}
              >
                <CardHeader>
                  <div className={`${option.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <option.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Start Feedback
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Why Your Feedback Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5" />
                <span>Help instructors improve their teaching methods and course content</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5" />
                <span>Contribute to enhancing campus services and facilities</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5" />
                <span>Shape the future educational experience for yourself and others</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5" />
                <span>All feedback is anonymous and confidential</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
