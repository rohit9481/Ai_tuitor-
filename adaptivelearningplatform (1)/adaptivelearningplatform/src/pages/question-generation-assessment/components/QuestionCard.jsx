import React from 'react';
import Icon from '../../../components/AppIcon';


const QuestionCard = ({ 
  question, 
  currentAnswer, 
  onAnswerChange, 
  onConfidenceChange,
  confidence = 3,
  showValidation = false,
  isSubmitted = false
}) => {
  const renderQuestionContent = () => {
    switch (question?.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question?.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  currentAnswer === option?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question?.id}`}
                  value={option?.id}
                  checked={currentAnswer === option?.id}
                  onChange={(e) => onAnswerChange(e?.target?.value)}
                  className="mt-1 w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {option?.text}
                  </div>
                  {option?.explanation && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {option?.explanation}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-3">
            {['true', 'false']?.map((option) => (
              <label
                key={option}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  currentAnswer === option
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question?.id}`}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => onAnswerChange(e?.target?.value)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-foreground capitalize">
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case 'short_answer':
        return (
          <div className="space-y-2">
            <textarea
              value={currentAnswer || ''}
              onChange={(e) => onAnswerChange(e?.target?.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-colors duration-200"
              rows={4}
            />
            <div className="text-xs text-muted-foreground">
              {currentAnswer?.length || 0} characters
            </div>
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-4">
            <div className="text-sm text-foreground leading-relaxed">
              {question?.content?.split('___')?.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < question?.content?.split('___')?.length - 1 && (
                    <input
                      type="text"
                      value={currentAnswer?.[index] || ''}
                      onChange={(e) => {
                        const newAnswers = [...(currentAnswer || [])];
                        newAnswers[index] = e?.target?.value;
                        onAnswerChange(newAnswers);
                      }}
                      className="inline-block mx-2 px-3 py-1 border-b-2 border-primary bg-transparent focus:outline-none focus:border-primary min-w-[100px]"
                      placeholder="answer"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">Unsupported question type: {question?.type}
          </div>
        );
    }
  };

  const isAnswered = () => {
    if (!currentAnswer) return false;
    if (question?.type === 'fill_blank') {
      return Array.isArray(currentAnswer) && currentAnswer?.some(answer => answer?.trim());
    }
    return currentAnswer?.toString()?.trim()?.length > 0;
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-card">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <Icon name="HelpCircle" size={16} className="text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-primary">
              Question {question?.number}
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {question?.type?.replace('_', ' ')}
            </div>
          </div>
        </div>
        
        {question?.difficulty && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            question?.difficulty === 'easy' ? 'bg-success/10 text-success' :
            question?.difficulty === 'medium'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
          }`}>
            {question?.difficulty}
          </div>
        )}
      </div>
      {/* Question Content */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground mb-4 leading-relaxed">
          {question?.question}
        </h3>
        
        {question?.context && (
          <div className="bg-muted/50 border-l-4 border-primary p-4 rounded-r-lg mb-4">
            <div className="text-sm text-muted-foreground mb-1">Context:</div>
            <div className="text-sm text-foreground">{question?.context}</div>
          </div>
        )}

        {renderQuestionContent()}
      </div>
      {/* Confidence Level */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">
            How confident are you in your answer?
          </label>
          <div className="text-sm font-medium text-primary">
            {confidence}/5
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Not sure</span>
          <div className="flex space-x-1 flex-1 justify-center">
            {[1, 2, 3, 4, 5]?.map((level) => (
              <button
                key={level}
                onClick={() => onConfidenceChange(level)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  confidence >= level
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-xs font-medium">{level}</span>
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Very sure</span>
        </div>
      </div>
      {/* Validation Message */}
      {showValidation && !isAnswered() && (
        <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <Icon name="AlertTriangle" size={16} className="text-warning" />
          <span className="text-sm text-warning">
            Please provide an answer before continuing.
          </span>
        </div>
      )}
      {/* Submission Status */}
      {isSubmitted && (
        <div className="flex items-center space-x-2 p-3 bg-success/10 border border-success/20 rounded-lg">
          <Icon name="Check" size={16} className="text-success" />
          <span className="text-sm text-success">
            Answer submitted successfully
          </span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;