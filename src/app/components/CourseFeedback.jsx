import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { authService } from '../services/authService';
import { feedbackService } from '../services/feedbackService';
import { mockCourses } from '../data/mockData';
import { ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseFeedback() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [ratingUI, setRatingUI] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      courseId: '',
      rating: 0,
      comments: ''
    }
  });

  const selectedCourseId = watch('courseId');

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    const course = mockCourses.find(c => c.id === data.courseId);
    if (!course) {
      toast.error("Invalid course selected.");
      return;
    }

    try {
      setIsSubmitting(true);

      const newFeedback = {
        id: crypto.randomUUID(), // ✅ Unique ID
        studentId: user.id,
        studentName: user.name,
        type: 'course',
        targetId: data.courseId,
        targetName: `${course.code} - ${course.name}`,
        rating: data.rating,
        comments: data.comments.trim(),
        category: `${course.code} - ${course.name}`, // ✅ FIXED (no more undefined)
        timestamp: new Date().toISOString(), // ✅ Required for charts
        status: 'submitted'
      };

      feedbackService.submitFeedback(newFeedback);

      toast.success("Course feedback submitted successfully! 🎉");

      reset();
      setRatingUI(0);

      setTimeout(() => {
        navigate('/student');
      }, 800);

    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/student')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Course Feedback</CardTitle>
            <CardDescription>
              Share your experience and help improve course quality
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Course Selection */}
              <div className="space-y-2">
                <Label>Select Course</Label>

                <Controller
                  name="courseId"
                  control={control}
                  rules={{ required: "Please select a course" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.courseId && (
                  <p className="text-sm text-red-600">
                    {errors.courseId.message}
                  </p>
                )}
              </div>

              {/* Course Preview */}
              {selectedCourseId && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  {(() => {
                    const course = mockCourses.find(c => c.id === selectedCourseId);
                    return course ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Instructor:</span>
                          <span className="font-medium">{course.instructor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Department:</span>
                          <span className="font-medium">{course.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Semester:</span>
                          <span className="font-medium">{course.semester}</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Rating */}
              <div className="space-y-2">
                <Label>Overall Rating</Label>

                <Controller
                  name="rating"
                  control={control}
                  rules={{
                    required: "Please select a rating",
                    min: { value: 1, message: "Please select a rating" }
                  }}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setRatingUI(star);
                            field.onChange(star);
                          }}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoveredRating || ratingUI)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                />

                {errors.rating && (
                  <p className="text-sm text-red-600">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label>Your Feedback</Label>

                <Controller
                  name="comments"
                  control={control}
                  rules={{
                    required: "Feedback is required",
                    minLength: {
                      value: 10,
                      message: "Please provide feedback (at least 10 characters)"
                    }
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="Please share your thoughts on the course content, teaching methods, materials, workload, etc."
                    />
                  )}
                />

                {errors.comments && (
                  <p className="text-sm text-red-600">
                    {errors.comments.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/student')}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}