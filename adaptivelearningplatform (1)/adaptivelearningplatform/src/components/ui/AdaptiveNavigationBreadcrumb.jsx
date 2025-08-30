import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const AdaptiveNavigationBreadcrumb = ({ 
  currentPhase = 'Assessment',
  completedPhases = [],
  availableNextSteps = [],
  sessionProgress = {}
}) => {
  const location = useLocation();

  const learningWorkflow = [
    {
      id: 'upload',
      label: 'Upload Content',
      path: '/upload',
      icon: 'Upload',
      description: 'Upload files for analysis'
    },
    {
      id: 'assessment',
      label: 'Assessment',
      path: '/question-generation-assessment',
      icon: 'FileQuestion',
      description: 'Answer generated questions'
    },
    {
      id: 'explanation',
      label: 'Explanations',
      path: '/adaptive-learning-explanations',
      icon: 'Lightbulb',
      description: 'Learn from AI explanations'
    },
    {
      id: 'review',
      label: 'Review',
      path: '/review',
      icon: 'CheckCircle',
      description: 'Review and master concepts'
    }
  ];

  const getCurrentPhaseIndex = () => {
    return learningWorkflow?.findIndex(phase => 
      location.pathname === phase?.path || 
      (phase?.id === 'assessment' && location.pathname === '/adaptive-learning-explanations')
    );
  };

  const currentPhaseIndex = getCurrentPhaseIndex();

  const getPhaseStatus = (index) => {
    if (index < currentPhaseIndex) return 'completed';
    if (index === currentPhaseIndex) return 'current';
    if (index === currentPhaseIndex + 1) return 'next';
    return 'upcoming';
  };

  const getPhaseStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          container: 'text-success hover:text-success/80',
          icon: 'bg-success text-success-foreground',
          connector: 'bg-success'
        };
      case 'current':
        return {
          container: 'text-primary',
          icon: 'bg-primary text-primary-foreground ring-2 ring-primary/20',
          connector: 'bg-muted'
        };
      case 'next':
        return {
          container: 'text-muted-foreground hover:text-foreground',
          icon: 'bg-muted text-muted-foreground border-2 border-primary/30',
          connector: 'bg-muted'
        };
      case 'upcoming':
        return {
          container: 'text-muted-foreground',
          icon: 'bg-muted text-muted-foreground',
          connector: 'bg-muted'
        };
      default:
        return {
          container: 'text-muted-foreground',
          icon: 'bg-muted text-muted-foreground',
          connector: 'bg-muted'
        };
    }
  };

  return (
    <nav className="w-full bg-background border-b" aria-label="Learning progress">
      <div className="px-4 py-4">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center space-x-1">
          {learningWorkflow?.map((phase, index) => {
            const status = getPhaseStatus(index);
            const styles = getPhaseStyles(status);
            const isClickable = status === 'completed' || status === 'current' || status === 'next';

            return (
              <React.Fragment key={phase?.id}>
                {/* Phase Item */}
                <div className="flex items-center">
                  {isClickable ? (
                    <Link
                      to={phase?.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${styles?.container}`}
                      title={phase?.description}
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${styles?.icon}`}>
                        {status === 'completed' ? (
                          <Icon name="Check" size={12} />
                        ) : (
                          <Icon name={phase?.icon} size={12} />
                        )}
                      </div>
                      <span className="text-sm font-medium">{phase?.label}</span>
                    </Link>
                  ) : (
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${styles?.container}`}>
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${styles?.icon}`}>
                        <Icon name={phase?.icon} size={12} />
                      </div>
                      <span className="text-sm font-medium">{phase?.label}</span>
                    </div>
                  )}
                </div>
                {/* Connector */}
                {index < learningWorkflow?.length - 1 && (
                  <div className="flex items-center px-2">
                    <div className={`w-8 h-0.5 ${styles?.connector} transition-colors duration-200`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Breadcrumb */}
        <div className="md:hidden">
          {/* Current Phase Indicator */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getPhaseStyles('current')?.icon}`}>
                <Icon name={learningWorkflow?.[currentPhaseIndex]?.icon || 'BookOpen'} size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {learningWorkflow?.[currentPhaseIndex]?.label || 'Learning'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Step {currentPhaseIndex + 1} of {learningWorkflow?.length}
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="text-xs text-muted-foreground font-data">
              {Math.round(((currentPhaseIndex + 1) / learningWorkflow?.length) * 100)}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-smooth"
              style={{ width: `${((currentPhaseIndex + 1) / learningWorkflow?.length) * 100}%` }}
            />
          </div>

          {/* Phase Dots */}
          <div className="flex items-center justify-center space-x-2 mt-3">
            {learningWorkflow?.map((phase, index) => {
              const status = getPhaseStatus(index);
              const styles = getPhaseStyles(status);
              
              return (
                <div
                  key={phase?.id}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    status === 'completed' ? 'bg-success' :
                    status === 'current'? 'bg-primary' : 'bg-muted'
                  }`}
                  title={phase?.label}
                />
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdaptiveNavigationBreadcrumb;