import React from 'react';
import Icon from '../../../components/AppIcon';

const ExplanationHeader = ({ 
  conceptTitle = "Photosynthesis Process",
  difficulty = "Intermediate",
  estimatedTime = "8 min",
  completionPercentage = 65,
  onBackToAssessment
}) => {
  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'text-success bg-success/10';
      case 'intermediate':
        return 'text-warning bg-warning/10';
      case 'advanced':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card border-b px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <button
          onClick={onBackToAssessment}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
        >
          <Icon name="ArrowLeft" size={16} />
          <span className="text-sm font-medium">Back to Assessment</span>
        </button>

        {/* Header Content */}
        <div className="space-y-4">
          {/* Title and Badges */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {conceptTitle}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </div>
              
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span className="text-sm">{estimatedTime}</span>
              </div>
              
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Target" size={14} />
                <span className="text-sm">Mastery Goal</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Understanding Progress</span>
              <span className="font-medium text-foreground font-data">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-smooth"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationHeader;