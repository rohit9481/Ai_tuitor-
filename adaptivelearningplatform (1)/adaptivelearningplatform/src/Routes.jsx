import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import FileUpload from './pages/file-upload';
import QuestionGenerationAssessment from './pages/question-generation-assessment';
import AdaptiveLearningExplanations from './pages/adaptive-learning-explanations';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<FileUpload />} />
        <Route path="/file-upload" element={<FileUpload />} />
        <Route path="/question-generation-assessment" element={<QuestionGenerationAssessment />} />
        <Route path="/adaptive-learning-explanations" element={<AdaptiveLearningExplanations />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;