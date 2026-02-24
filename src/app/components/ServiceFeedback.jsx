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
import { mockServiceCategories } from '../data/mockData';
import { ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceFeedback() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [ratingUI, setRatingUI] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      serviceId: '',
      rating: 0,
      comments: ''
    }
  });

  const selectedServiceId = watch('serviceId');

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to submit feedback.');
      return;
    }

    const service = mockServiceCategories.find(
      (s) => s.id === data.serviceId
    );

    if (!service) {
      toast.error('Invalid service selected.');
      return;
    }

    try {
      setIsSubmitting(true);

      const newFeedback = {
        id: crypto.randomUUID(),
        studentId: user.id,
        studentName: user.name,
        type: 'service',
        targetId: data.serviceId,
        targetName: service.name,
        rating: data.rating,
        comments: data.comments.trim(),
        category: service.name,
        timestamp: new Date().toISOString(),
        status: 'submitted'
      };

      // Save to localStorage via service
      feedbackService.submitFeedback(newFeedback);

      toast.success('Service feedback submitted successfully! 🎉');

      // Reset form
      reset();
      setRatingUI(0);

      // Navigate after small delay (better UX)
      setTimeout(() => {
        navigate('/student');
      }, 800);

    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/student')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        <Card>
          <CardHeader>
            <CardTitle>Institutional Services Feedback</CardTitle>
            <CardDescription>
              Help us improve campus facilities and services
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* SERVICE SELECTION */}
              <div className="space-y-2">
                <Label>Select Service</Label>

                <Controller
                  name="serviceId"
                  control={control}
                  rules={{ required: "Please select a service" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockServiceCategories.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.serviceId && (
                  <p className="text-sm text-red-600">
                    {errors.serviceId.message}
                  </p>
                )}
              </div>

              {/* SERVICE DETAILS */}
              {selectedServiceId && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  {(() => {
                    const service = mockServiceCategories.find(
                      (s) => s.id === selectedServiceId
                    );
                    return service ? (
                      <div className="space-y-2 text-sm">
                        <div className="font-medium text-gray-900">
                          {service.name}
                        </div>
                        <p className="text-gray-600">
                          {service.description}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* RATING */}
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
                    <div className="flex items-center gap-3">
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

              {/* COMMENTS */}
              <div className="space-y-2">
                <Label>Your Feedback</Label>

                <Controller
                  name="comments"
                  control={control}
                  rules={{
                    required: "Feedback is required",
                    validate: (value) =>
                      value.trim().length >= 10 ||
                      "Please provide feedback (at least 10 characters)"
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="Please share your experience. What works well? What could be improved?"
                    />
                  )}
                />

                {errors.comments && (
                  <p className="text-sm text-red-600">
                    {errors.comments.message}
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  Your feedback helps us enhance campus services for all students.
                </p>
              </div>

              {/* TIPS */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-medium text-purple-900 mb-2">
                  Tips for effective feedback:
                </h4>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• Be specific about your experience</li>
                  <li>• Mention strengths and improvements</li>
                  <li>• Suggest actionable improvements</li>
                  <li>• Keep it respectful and constructive</li>
                </ul>
              </div>

              {/* BUTTONS */}
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
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}