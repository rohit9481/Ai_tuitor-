import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentSummary = ({ 
  results,
  onRetakeAssessment,
  onContinueToExplanations,
  sessionData
}) => {
  const {
    totalQuestions = 0,
    correctAnswers = 0,
    incorrectAnswers = 0,
    averageConfidence = 0,
    timeSpent = '0:00',
    weakAreas = [],
    strongAreas = [],
    overallScore = 0
  } = results || {};

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getScoreBgColor(overallScore)}`}>
            <Icon 
              name={overallScore >= 80 ? "Trophy" : overallScore >= 60 ? "Target" : "AlertCircle"} 
              size={32} 
              className={getScoreColor(overallScore)}
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Assessment Complete!
          </h1>
          <p className="text-muted-foreground">
            Here's how you performed on your learning assessment
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-card border rounded-xl p-6 text-center shadow-card">
          <div className="mb-4">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <div className="text-lg text-muted-foreground">
              Overall Score
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <div className="text-2xl font-bold text-success">
                {correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-error">
                {incorrectAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {averageConfidence}/5
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {timeSpent}
              </div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strong Areas */}
          {strongAreas?.length > 0 && (
            <div className="bg-card border rounded-xl p-6 shadow-card">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="TrendingUp" size={20} className="text-success" />
                <h3 className="text-lg font-semibold text-foreground">
                  Strong Areas
                </h3>
              </div>
              <div className="space-y-3">
                {strongAreas?.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                    <span className="text-sm font-medium text-foreground">
                      {area?.topic}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-bold text-success">
                        {area?.score}%
                      </div>
                      <Icon name="Check" size={14} className="text-success" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weak Areas */}
          {weakAreas?.length > 0 && (
            <div className="bg-card border rounded-xl p-6 shadow-card">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="TrendingDown" size={20} className="text-warning" />
                <h3 className="text-lg font-semibold text-foreground">
                  Areas for Improvement
                </h3>
              </div>
              <div className="space-y-3">
                {weakAreas?.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                    <span className="text-sm font-medium text-foreground">
                      {area?.topic}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-bold text-warning">
                        {area?.score}%
                      </div>
                      <Icon name="AlertTriangle" size={14} className="text-warning" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-card border rounded-xl p-6 shadow-card">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Lightbulb" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-foreground">
              Personalized Recommendations
            </h3>
          </div>
          
          <div className="space-y-4">
            {overallScore < 60 && (
              <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="BookOpen" size={16} className="text-error mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">
                      Focus on Fundamentals
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Your score indicates you may benefit from reviewing core concepts before moving forward.
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {weakAreas?.length > 0 && (
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="Target" size={16} className="text-accent mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">
                      Targeted Learning
                    </div>
                    <div className="text-sm text-muted-foreground">
                      We've identified {weakAreas?.length} areas where personalized explanations can help improve your understanding.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {averageConfidence < 3 && (
              <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="Brain" size={16} className="text-warning mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">
                      Build Confidence
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Your confidence levels suggest additional practice and explanations would be beneficial.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            variant="default"
            onClick={onContinueToExplanations}
            iconName="ArrowRight"
            iconPosition="right"
            className="flex-1"
          >
            Continue to Personalized Explanations
          </Button>
          
          <Button
            variant="outline"
            onClick={onRetakeAssessment}
            iconName="RotateCcw"
            iconPosition="left"
            className="flex-1"
          >
            Retake Assessment
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center pt-4">
          <Link
            to="/progress"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Icon name="BarChart3" size={14} />
            <span>View Detailed Progress</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSummary;