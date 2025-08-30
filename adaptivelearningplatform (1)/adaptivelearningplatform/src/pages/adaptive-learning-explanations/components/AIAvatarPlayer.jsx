import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AIAvatarPlayer = ({ 
  isVisible = true,
  explanationText = "",
  onToggleMode,
  onPlaybackComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes mock duration
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [showControls, setShowControls] = useState(true);
  
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const mockExplanationText = `Welcome to this explanation of photosynthesis! I'm here to help you understand this fascinating biological process.\n\nPhotosynthesis is how plants convert sunlight into energy. Think of it as nature's solar panel system. Plants capture light energy and transform it into chemical energy that they can use to grow and survive.\n\nLet me break this down into simple steps that are easy to remember...`;

  const displayText = explanationText || mockExplanationText;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            onPlaybackComplete?.();
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(intervalRef?.current);
    }

    return () => clearInterval(intervalRef?.current);
  }, [isPlaying, playbackSpeed, duration, onPlaybackComplete]);

  useEffect(() => {
    if (showControls) {
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => clearTimeout(timeoutRef?.current);
  }, [showControls]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const handleSeek = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const clickX = e?.clientX - rect?.left;
    const newTime = (clickX / rect?.width) * duration;
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
    setShowControls(true);
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds?.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds?.length;
    setPlaybackSpeed(speeds?.[nextIndex]);
    setShowControls(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  if (!isVisible) return null;

  return (
    <div className="bg-card border rounded-lg overflow-hidden mb-6">
      {/* Avatar Display Area */}
      <div 
        className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center cursor-pointer"
        onClick={() => setShowControls(true)}
      >
        {/* AI Avatar Placeholder */}
        <div className="relative">
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-300 ${
            isPlaying ? 'animate-pulse' : ''
          }`}>
            <Icon 
              name="Bot" 
              size={48} 
              className="text-primary"
            />
          </div>
          
          {/* Speaking Indicator */}
          {isPlaying && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {[...Array(3)]?.map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: '12px',
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '0.8s'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Play/Pause Overlay */}
        <button
          onClick={handlePlayPause}
          className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Icon 
              name={isPlaying ? "Pause" : "Play"} 
              size={24} 
              color="white"
            />
          </div>
        </button>
      </div>
      {/* Controls */}
      <div className={`p-4 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-70'}`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div 
            className="w-full h-2 bg-muted rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-primary rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1 font-data">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
            </button>

            {/* Speed Control */}
            <button
              onClick={handleSpeedChange}
              className="px-3 py-1 text-xs font-medium bg-muted rounded-full hover:bg-muted/80 transition-colors duration-200 font-data"
            >
              {playbackSpeed}x
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Icon name="Volume2" size={16} className="text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e?.target?.value))}
                className="w-16 h-1 bg-muted rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Mode Toggle */}
            <button
              onClick={onToggleMode}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              title="Switch to text-only mode"
            >
              <Icon name="Type" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
      {/* Transcript/Captions */}
      <div className="px-4 pb-4">
        <div className="bg-muted/50 rounded-lg p-3 max-h-32 overflow-y-auto">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {displayText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAvatarPlayer;