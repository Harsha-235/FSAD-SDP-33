const STORAGE_KEY = 'studentFeedback_submissions';

export const feedbackService = {
  submitFeedback: (feedback) => {
    const feedbacks = feedbackService.getAllFeedbacks();
    const newFeedback = {
      ...feedback,
      id: `feedback_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    feedbacks.push(newFeedback);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
    return newFeedback;
  },

  getAllFeedbacks: () => {
    const feedbacksStr = localStorage.getItem(STORAGE_KEY);
    if (feedbacksStr) {
      try {
        return JSON.parse(feedbacksStr);
      } catch {
        return [];
      }
    }
    return [];
  },

  getFeedbacksByStudent: (studentId) => {
    return feedbackService.getAllFeedbacks().filter(f => f.studentId === studentId);
  },

  getFeedbacksByType: (type) => {
    return feedbackService.getAllFeedbacks().filter(f => f.type === type);
  }
};
