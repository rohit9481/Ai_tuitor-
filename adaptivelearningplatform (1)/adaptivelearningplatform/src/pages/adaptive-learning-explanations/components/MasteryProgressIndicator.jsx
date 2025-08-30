import React from 'react';
import Icon from '../../../components/AppIcon';

const MasteryProgressIndicator = ({ 
  currentLevel = 65,
  targetLevel = 80,
  conceptsCompleted = 3,
  totalConcepts = 5,
  timeSpent = "12 min",
  onViewProgress
}) => {
  const progressPercentage = (currentLevel / 100) * 100;
  const targetPercentage = (targetLevel / 100) * 100;
  
  const getMasteryLevel = (level) => {
    if (level >= 90) return { label: 'Expert', color: 'text-success', bgColor: 'bg-success' };
    if (level >= 80) return { label: 'Proficient', color: 'text-primary', bgColor: 'bg-primary' };
    if (level >= 60) return { label: 'Developing', color: 'text-warning', bgColor: 'bg-warning' };
    if (level >= 40) return { label: 'Learning', color: 'text-accent', bgColor: 'bg-accent' };
    return { label: 'Beginner', color: 'text-muted-foreground', bgColor: 'bg-muted' };
  };

  const currentMastery = getMasteryLevel(currentLevel);
  const targetMastery = getMasteryLevel(targetLevel);

  const achievements = [
    {
      id: 1,
      title: "First Explanation",
      description: "Completed your first AI explanation",
      icon: "Award",
      earned: true
    },
    {
      id: 2,
      title: "Quick Learner",
      description: "Understood concept in under 10 minutes",
      icon: "Zap",
      earned: true
    },
    {
      id: 3,
      title: "Note Taker",
      description: "Added notes during explanation",
      icon: "PenTool",
      earned: false
    }
  ];

  return (
    <div className="bg-card border rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Mastery Progress
          </h3>
          <p className="text-sm text-muted-foreground">
            Track your understanding level
          </p>
        </div>
        <button
          onClick={onViewProgress}
          className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
          title="View detailed progress"
        >
          <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
        </button>
      </div>
      {/* Current Progress */}
      <div className="space-y-4 mb-6">
        {/* Mastery Level */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-3">
            {/* Background Circle */}
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${progressPercentage * 2.51} 251`}
                className={currentMastery?.color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-foreground font-data">
                {currentLevel}%
              </span>
            </div>
          </div>
          
          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${currentMastery?.color} bg-opacity-10`}>
            <Icon name="Target" size={14} />
            <span>{currentMastery?.label}</span>
          </div>
        </div>

        {/* Progress Bar to Target */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to {targetMastery?.label}</span>
            <span className="font-medium text-foreground font-data">
              {currentLevel}/{targetLevel}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${currentMastery?.bgColor} transition-all duration-500 ease-smooth`}
              style={{ width: `${(currentLevel / targetLevel) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground font-data">
            {conceptsCompleted}/{totalConcepts}
          </div>
          <div className="text-xs text-muted-foreground">Concepts</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-foreground font-data">
            {timeSpent}
          </div>
          <div className="text-xs text-muted-foreground">Time Spent</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-foreground font-data">
            {achievements?.filter(a => a?.earned)?.length}
          </div>
          <div className="text-xs text-muted-foreground">Achievements</div>
        </div>
      </div>
      {/* Recent Achievements */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="Trophy" size={14} className="text-warning" />
          <span>Recent Achievements</span>
        </h4>
        
        <div className="space-y-2">
          {achievements?.slice(0, 2)?.map((achievement) => (
            <div
              key={achievement?.id}
              className={`flex items-center space-x-3 p-2 rounded-lg ${
                achievement?.earned ? 'bg-success/10' : 'bg-muted/50'
              }`}
            >
              <div className={`p-1.5 rounded-full ${
                achievement?.earned ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon name={achievement?.icon} size={12} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  achievement?.earned ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {achievement?.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {achievement?.description}
                </div>
              </div>
              {achievement?.earned && (
                <Icon name="Check" size={14} className="text-success flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Next Steps */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Next Goal</div>
            <div className="text-xs text-muted-foreground">
              Reach {targetLevel}% mastery level
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-primary font-data">
              {targetLevel - currentLevel}% to go
            </div>
            <div className="text-xs text-muted-foreground">
              ~{Math.ceil((targetLevel - currentLevel) / 10)} more concepts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteryProgressIndicator;