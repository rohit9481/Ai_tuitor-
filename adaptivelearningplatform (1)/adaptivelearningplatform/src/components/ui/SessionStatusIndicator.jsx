import React, { useState } from 'react';
import Icon from '../AppIcon';

const SessionStatusIndicator = ({ 
  sessionStatus = 'active', // 'active', 'paused', 'saving', 'saved'
  lastSaved = '2 minutes ago',
  sessionName = 'Learning Session',
  onSessionManage,
  autoSaveEnabled = true
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusConfig = () => {
    switch (sessionStatus) {
      case 'active':
        return {
          icon: 'Play',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Active',
          pulse: true
        };
      case 'paused':
        return {
          icon: 'Pause',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Paused',
          pulse: false
        };
      case 'saving':
        return {
          icon: 'Loader2',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          label: 'Saving',
          pulse: false,
          animate: 'animate-spin'
        };
      case 'saved':
        return {
          icon: 'Check',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Saved',
          pulse: false
        };
      default:
        return {
          icon: 'Circle',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Unknown',
          pulse: false
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="relative">
      {/* Main Status Indicator */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors duration-200"
        title={`Session ${statusConfig?.label} - Click for details`}
      >
        {/* Status Icon with Pulse Animation */}
        <div className={`relative ${statusConfig?.bgColor} p-1.5 rounded-full`}>
          <Icon 
            name={statusConfig?.icon} 
            size={12} 
            className={`${statusConfig?.color} ${statusConfig?.animate || ''}`}
          />
          {statusConfig?.pulse && (
            <div className={`absolute inset-0 ${statusConfig?.bgColor} rounded-full animate-ping opacity-75`} />
          )}
        </div>

        {/* Status Text (Desktop) */}
        <div className="hidden sm:block">
          <div className="text-xs font-medium text-foreground">
            {statusConfig?.label}
          </div>
          {autoSaveEnabled && lastSaved && (
            <div className="text-xs text-muted-foreground">
              Saved {lastSaved}
            </div>
          )}
        </div>

        {/* Dropdown Arrow */}
        <Icon 
          name="ChevronDown" 
          size={12} 
          className={`text-muted-foreground transition-transform duration-200 ${
            showDetails ? 'rotate-180' : ''
          }`}
        />
      </button>
      {/* Expanded Details */}
      {showDetails && (
        <div className="absolute top-full right-0 mt-2 bg-card border rounded-lg shadow-elevated p-4 min-w-[280px] z-50 animate-slide-down">
          {/* Session Info */}
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-foreground mb-1">
                {sessionName}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className={`flex items-center space-x-1 ${statusConfig?.color}`}>
                  <Icon name={statusConfig?.icon} size={10} />
                  <span>{statusConfig?.label}</span>
                </div>
                {lastSaved && (
                  <>
                    <span>•</span>
                    <span>Last saved {lastSaved}</span>
                  </>
                )}
              </div>
            </div>

            {/* Auto-save Status */}
            {autoSaveEnabled && (
              <div className="flex items-center justify-between py-2 border-t">
                <div className="flex items-center space-x-2">
                  <Icon name="Save" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">Auto-save</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-xs text-success">Enabled</span>
                </div>
              </div>
            )}

            {/* Session Actions */}
            <div className="space-y-1 pt-2 border-t">
              <button
                onClick={() => {
                  onSessionManage?.('pause');
                  setShowDetails(false);
                }}
                className="flex items-center space-x-2 w-full px-2 py-1.5 rounded-lg hover:bg-muted transition-colors duration-200"
              >
                <Icon name="Pause" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {sessionStatus === 'active' ? 'Pause Session' : 'Resume Session'}
                </span>
              </button>
              
              <button
                onClick={() => {
                  onSessionManage?.('save');
                  setShowDetails(false);
                }}
                className="flex items-center space-x-2 w-full px-2 py-1.5 rounded-lg hover:bg-muted transition-colors duration-200"
              >
                <Icon name="Save" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Save Now</span>
              </button>
              
              <button
                onClick={() => {
                  onSessionManage?.('manage');
                  setShowDetails(false);
                }}
                className="flex items-center space-x-2 w-full px-2 py-1.5 rounded-lg hover:bg-muted transition-colors duration-200"
              >
                <Icon name="Settings" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Manage Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Click Outside Handler */}
      {showDetails && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default SessionStatusIndicator;