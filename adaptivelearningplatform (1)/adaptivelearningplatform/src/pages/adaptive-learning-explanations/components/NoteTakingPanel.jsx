import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NoteTakingPanel = ({ 
  isExpanded = false,
  onToggleExpanded,
  conceptTitle = "Photosynthesis Process"
}) => {
  const [notes, setNotes] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [activeTab, setActiveTab] = useState('notes');

  const mockHighlights = [
    {
      id: 1,
      text: "Photosynthesis occurs in chloroplasts",
      timestamp: "2:34",
      color: "yellow"
    },
    {
      id: 2,
      text: "Light-dependent reactions produce ATP and NADPH",
      timestamp: "4:12",
      color: "green"
    },
    {
      id: 3,
      text: "Calvin cycle fixes carbon dioxide",
      timestamp: "5:45",
      color: "blue"
    }
  ];

  const mockNotes = `Key Points from Photosynthesis Explanation:

1. Two main stages:
   - Light-dependent reactions (thylakoids)
   - Light-independent reactions (stroma)

2. Essential components:
   - Chlorophyll pigments
   - ATP and NADPH
   - Carbon dioxide and water

3. Products:
   - Glucose (energy storage)
   - Oxygen (byproduct)

Questions to review:
- How does light intensity affect photosynthesis rate?
- What happens during the Calvin cycle?`;

  const [currentNotes, setCurrentNotes] = useState(notes || mockNotes);
  const [currentHighlights, setCurrentHighlights] = useState(highlights?.length > 0 ? highlights : mockHighlights);

  const handleSaveNotes = () => {
    setNotes(currentNotes);
    // Here you would typically save to backend
    console.log('Notes saved:', currentNotes);
  };

  const handleAddHighlight = () => {
    const newHighlight = {
      id: Date.now(),
      text: "New highlight",
      timestamp: "0:00",
      color: "yellow"
    };
    setCurrentHighlights([...currentHighlights, newHighlight]);
  };

  const handleRemoveHighlight = (id) => {
    setCurrentHighlights(currentHighlights?.filter(h => h?.id !== id));
  };

  const getHighlightColor = (color) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-200 border-yellow-300';
      case 'green':
        return 'bg-green-200 border-green-300';
      case 'blue':
        return 'bg-blue-200 border-blue-300';
      case 'pink':
        return 'bg-pink-200 border-pink-300';
      default:
        return 'bg-yellow-200 border-yellow-300';
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={onToggleExpanded}
          className="flex items-center space-x-2 px-4 py-2 bg-card border rounded-full shadow-elevated hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Icon name="PenTool" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground hidden sm:block">
            Take Notes
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 w-80 bg-card border-r shadow-elevated z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-medium text-foreground">Notes & Highlights</h3>
          <p className="text-xs text-muted-foreground truncate">{conceptTitle}</p>
        </div>
        <button
          onClick={onToggleExpanded}
          className="p-1 rounded-lg hover:bg-muted transition-colors duration-200"
        >
          <Icon name="X" size={16} className="text-muted-foreground" />
        </button>
      </div>
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'notes' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="FileText" size={14} />
          <span>Notes</span>
        </button>
        <button
          onClick={() => setActiveTab('highlights')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'highlights' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Highlighter" size={14} />
          <span>Highlights</span>
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'notes' ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 p-4">
              <textarea
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e?.target?.value)}
                placeholder="Take notes while learning..."
                className="w-full h-full resize-none bg-background border border-border rounded-lg p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="p-4 border-t">
              <button
                onClick={handleSaveNotes}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                <Icon name="Save" size={14} />
                <span className="text-sm font-medium">Save Notes</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentHighlights?.map((highlight) => (
                <div
                  key={highlight?.id}
                  className={`p-3 rounded-lg border ${getHighlightColor(highlight?.color)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-data">
                      {highlight?.timestamp}
                    </span>
                    <button
                      onClick={() => handleRemoveHighlight(highlight?.id)}
                      className="p-1 rounded hover:bg-black/10 transition-colors duration-200"
                    >
                      <Icon name="X" size={12} className="text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-sm text-foreground">{highlight?.text}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <button
                onClick={handleAddHighlight}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200"
              >
                <Icon name="Plus" size={14} />
                <span className="text-sm font-medium">Add Highlight</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteTakingPanel;