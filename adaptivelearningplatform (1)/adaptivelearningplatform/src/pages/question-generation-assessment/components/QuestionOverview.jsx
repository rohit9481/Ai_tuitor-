import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionOverview = ({ 
  questions = [], 
  currentQuestion, 
  answeredQuestions = [], 
  onQuestionSelect,
  onToggleOverview,
  isVisible = false
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'answered', 'unanswered'

  const getQuestionStatus = (questionId) => {
    if (answeredQuestions?.includes(questionId)) return 'answered';
    if (questionId === currentQuestion) return 'current';
    return 'unanswered';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return 'CheckCircle';
      case 'current':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'text-success';
      case 'current':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredQuestions = questions?.filter(question => {
    const status = getQuestionStatus(question?.id);
    if (filter === 'answered') return status === 'answered';
    if (filter === 'unanswered') return status === 'unanswered';
    return true;
  });

  const stats = {
    total: questions?.length,
    answered: answeredQuestions?.length,
    remaining: questions?.length - answeredQuestions?.length
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:relative md:bg-transparent md:backdrop-blur-none">
      <div className="absolute inset-4 bg-card rounded-xl shadow-elevated md:relative md:inset-0 md:shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Question Overview
            </h3>
            <div className="text-sm text-muted-foreground">
              {stats?.answered} of {stats?.total} completed
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onToggleOverview}
            className="md:hidden"
          />
        </div>

        {/* Stats */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {stats?.total}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {stats?.answered}
              </div>
              <div className="text-xs text-muted-foreground">Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {stats?.remaining}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b">
          {[
            { key: 'all', label: 'All Questions', count: stats?.total },
            { key: 'answered', label: 'Answered', count: stats?.answered },
            { key: 'unanswered', label: 'Remaining', count: stats?.remaining }
          ]?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setFilter(tab?.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                filter === tab?.key
                  ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab?.label} ({tab?.count})
            </button>
          ))}
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[400px] md:max-h-none">
          <div className="space-y-2">
            {filteredQuestions?.map((question) => {
              const status = getQuestionStatus(question?.id);
              const isCurrent = question?.id === currentQuestion;
              
              return (
                <button
                  key={question?.id}
                  onClick={() => {
                    onQuestionSelect(question?.id);
                    onToggleOverview();
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                    isCurrent
                      ? 'bg-primary/10 border-2 border-primary' :'hover:bg-muted border-2 border-transparent'
                  }`}
                >
                  <Icon
                    name={getStatusIcon(status)}
                    size={16}
                    className={getStatusColor(status)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">
                        Q{question?.number}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        question?.difficulty === 'easy' ? 'bg-success/10 text-success' :
                        question?.difficulty === 'medium'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                      }`}>
                        {question?.difficulty}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {question?.question}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {question?.type?.replace('_', ' ')}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredQuestions?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">
                No questions match the current filter
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Overall Progress
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((stats?.answered / stats?.total) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-smooth"
              style={{ width: `${(stats?.answered / stats?.total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionOverview;