import React from 'react';
import Icon from '../../../components/AppIcon';

const LearningModeToggle = ({ 
  currentMode = 'avatar', // 'avatar' | 'text'
  onModeChange,
  disabled = false
}) => {
  const modes = [
    {
      id: 'avatar',
      label: 'AI Avatar',
      icon: 'Bot',
      description: 'Interactive AI explanation with voice'
    },
    {
      id: 'text',
      label: 'Text Only',
      icon: 'Type',
      description: 'Read at your own pace'
    }
  ];

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">Learning Mode</h3>
        <Icon name="Settings" size={16} className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {modes?.map((mode) => (
          <button
            key={mode?.id}
            onClick={() => !disabled && onModeChange(mode?.id)}
            disabled={disabled}
            className={`flex flex-col items-center space-y-2 p-3 rounded-lg border transition-all duration-200 ${
              currentMode === mode?.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon 
              name={mode?.icon} 
              size={20} 
              className={currentMode === mode?.id ? 'text-primary-foreground' : 'text-muted-foreground'}
            />
            <div className="text-center">
              <div className="text-sm font-medium">{mode?.label}</div>
              <div className={`text-xs ${
                currentMode === mode?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {mode?.description}
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Additional Options */}
      <div className="mt-4 pt-3 border-t space-y-2">
        <label className="flex items-center justify-between">
          <span className="text-sm text-foreground">Auto-play next concept</span>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
          />
        </label>
        
        <label className="flex items-center justify-between">
          <span className="text-sm text-foreground">Show captions</span>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
          />
        </label>
      </div>
    </div>
  );
};

export default LearningModeToggle;