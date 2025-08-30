import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const FloatingActionAssistant = ({ 
  currentContext = 'assessment', // 'assessment', 'explanation', 'review'
  onExplanationRequest,
  onHelpRequest,
  onHintRequest,
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextActions = () => {
    switch (currentContext) {
      case 'assessment':
        return [
          {
            icon: 'Lightbulb',
            label: 'Get Hint',
            action: onHintRequest,
            color: 'text-warning'
          },
          {
            icon: 'MessageCircle',
            label: 'Explain',
            action: onExplanationRequest,
            color: 'text-accent'
          },
          {
            icon: 'HelpCircle',
            label: 'Help',
            action: onHelpRequest,
            color: 'text-muted-foreground'
          }
        ];
      case 'explanation':
        return [
          {
            icon: 'RotateCcw',
            label: 'Re-explain',
            action: onExplanationRequest,
            color: 'text-accent'
          },
          {
            icon: 'HelpCircle',
            label: 'Help',
            action: onHelpRequest,
            color: 'text-muted-foreground'
          }
        ];
      case 'review':
        return [
          {
            icon: 'MessageCircle',
            label: 'Explain',
            action: onExplanationRequest,
            color: 'text-accent'
          },
          {
            icon: 'HelpCircle',
            label: 'Help',
            action: onHelpRequest,
            color: 'text-muted-foreground'
          }
        ];
      default:
        return [];
    }
  };

  const actions = getContextActions();
  const primaryAction = actions?.[0];

  const handlePrimaryAction = () => {
    if (disabled) return;
    
    if (isExpanded) {
      setIsExpanded(false);
    } else if (primaryAction) {
      primaryAction?.action?.();
    }
  };

  const handleSecondaryAction = (action) => {
    if (disabled) return;
    action?.action?.();
    setIsExpanded(false);
  };

  const toggleExpanded = (e) => {
    e?.stopPropagation();
    if (disabled) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-80 flex flex-col items-end space-y-2">
      {/* Secondary Actions */}
      {isExpanded && actions?.length > 1 && (
        <div className="flex flex-col space-y-2 animate-slide-up">
          {actions?.slice(1)?.reverse()?.map((action, index) => (
            <button
              key={index}
              onClick={() => handleSecondaryAction(action)}
              disabled={disabled}
              className={`flex items-center space-x-2 px-4 py-2 bg-card border rounded-full shadow-elevated hover:shadow-lg transition-all duration-200 ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              <Icon 
                name={action?.icon} 
                size={16} 
                className={action?.color}
              />
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {action?.label}
              </span>
            </button>
          ))}
        </div>
      )}
      {/* Primary Action Button */}
      <div className="flex items-center space-x-2">
        {/* Expand/Collapse Button (Desktop) */}
        {actions?.length > 1 && (
          <button
            onClick={toggleExpanded}
            disabled={disabled}
            className={`hidden sm:flex items-center justify-center w-12 h-12 bg-muted border rounded-full shadow-card hover:shadow-elevated transition-all duration-200 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            <Icon 
              name={isExpanded ? "X" : "MoreHorizontal"} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>
        )}

        {/* Main Action Button */}
        <button
          onClick={handlePrimaryAction}
          disabled={disabled}
          className={`flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-elevated hover:shadow-lg transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          }`}
          title={primaryAction?.label}
        >
          <Icon 
            name={primaryAction?.icon || 'HelpCircle'} 
            size={20} 
            color="white"
          />
        </button>
      </div>
      {/* Mobile Expanded Menu */}
      {isExpanded && (
        <div className="sm:hidden absolute bottom-16 right-0 bg-card border rounded-lg shadow-elevated p-2 min-w-[200px] animate-slide-up">
          {actions?.map((action, index) => (
            <button
              key={index}
              onClick={() => handleSecondaryAction(action)}
              disabled={disabled}
              className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors duration-200 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Icon 
                name={action?.icon} 
                size={16} 
                className={action?.color}
              />
              <span className="text-sm font-medium text-foreground">
                {action?.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingActionAssistant;