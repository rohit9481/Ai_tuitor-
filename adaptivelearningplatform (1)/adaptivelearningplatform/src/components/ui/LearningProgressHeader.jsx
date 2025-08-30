import React from 'react';
import Icon from '../AppIcon';

const LearningProgressHeader = ({ 
  currentPhase = 'Assessment',
  questionProgress = { current: 1, total: 10 },
  completionPercentage = 10,
  sessionTime = '5:23',
  onPause,
  onSettings
}) => {
  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'Assessment':
        return 'FileQuestion';
      case 'Explanation':
        return 'Lightbulb';
      case 'Review':
        return 'CheckCircle';
      default:
        return 'BookOpen';
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Assessment':
        return 'text-primary';
      case 'Explanation':
        return 'text-accent';
      case 'Review':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="sticky top-16 z-40 w-full bg-card/95 backdrop-blur border-b supports-[backdrop-filter]:bg-card/60">
      <div className="px-4 py-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Phase Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg bg-muted ${getPhaseColor(currentPhase)}`}>
                <Icon name={getPhaseIcon(currentPhase)} size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {currentPhase} Phase
                </div>
                <div className="text-xs text-muted-foreground">
                  Question {questionProgress?.current} of {questionProgress?.total}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-3">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-smooth"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground font-data">
                {completionPercentage}%
              </span>
            </div>
          </div>

          {/* Right: Session Info & Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span className="font-data">{sessionTime}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={onPause}
                className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                title="Pause session"
              >
                <Icon name="Pause" size={16} className="text-muted-foreground" />
              </button>
              <button
                onClick={onSettings}
                className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                title="Session settings"
              >
                <Icon name="Settings" size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          {/* Phase and Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg bg-muted ${getPhaseColor(currentPhase)}`}>
                <Icon name={getPhaseIcon(currentPhase)} size={14} />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {currentPhase}
                </div>
                <div className="text-xs text-muted-foreground">
                  {questionProgress?.current}/{questionProgress?.total}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span className="font-data">{sessionTime}</span>
              </div>
              <button
                onClick={onPause}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors duration-200"
              >
                <Icon name="Pause" size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Progress Bar Row */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-smooth"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground font-data min-w-[2.5rem]">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgressHeader;