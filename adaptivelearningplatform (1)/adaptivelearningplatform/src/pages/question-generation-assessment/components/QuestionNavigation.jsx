import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionNavigation = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  canGoNext = true,
  canGoPrevious = true,
  isLastQuestion = false,
  isSubmitting = false,
  showValidation = false
}) => {
  return (
    <div className="sticky bottom-0 bg-card/95 backdrop-blur border-t p-4 supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          iconName="ChevronLeft"
          iconPosition="left"
          className="min-w-[100px]"
        >
          Previous
        </Button>

        {/* Question Counter */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion} of {totalQuestions}
          </div>
          
          {/* Progress Dots (Mobile) */}
          <div className="flex items-center space-x-1 md:hidden">
            {Array.from({ length: Math.min(totalQuestions, 5) }, (_, index) => {
              let dotIndex = index;
              if (totalQuestions > 5) {
                if (currentQuestion <= 3) {
                  dotIndex = index;
                } else if (currentQuestion >= totalQuestions - 2) {
                  dotIndex = totalQuestions - 5 + index;
                } else {
                  dotIndex = currentQuestion - 3 + index;
                }
              }
              
              return (
                <div
                  key={dotIndex}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    dotIndex + 1 === currentQuestion
                      ? 'bg-primary'
                      : dotIndex + 1 < currentQuestion
                      ? 'bg-success' :'bg-muted'
                  }`}
                />
              );
            })}
            {totalQuestions > 5 && currentQuestion < totalQuestions - 2 && (
              <div className="text-xs text-muted-foreground">...</div>
            )}
          </div>
        </div>

        {/* Next/Submit Button */}
        {isLastQuestion ? (
          <Button
            variant="default"
            onClick={onSubmit}
            loading={isSubmitting}
            iconName="Check"
            iconPosition="right"
            className="min-w-[100px]"
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={onNext}
            disabled={!canGoNext}
            iconName="ChevronRight"
            iconPosition="right"
            className="min-w-[100px]"
          >
            Next
          </Button>
        )}
      </div>

      {/* Validation Message */}
      {showValidation && (
        <div className="flex items-center justify-center space-x-2 mt-3 p-2 bg-warning/10 border border-warning/20 rounded-lg">
          <Icon name="AlertTriangle" size={14} className="text-warning" />
          <span className="text-xs text-warning">
            Please answer the question before proceeding
          </span>
        </div>
      )}
    </div>
  );
};

export default QuestionNavigation;