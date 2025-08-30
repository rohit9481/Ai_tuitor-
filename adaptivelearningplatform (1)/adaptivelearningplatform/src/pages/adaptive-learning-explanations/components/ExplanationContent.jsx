import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ExplanationContent = ({ 
  concept = {},
  onNeedMoreHelp,
  onGotIt
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const mockConcept = {
    title: "Photosynthesis Process",
    overview: `Photosynthesis is the biological process by which plants, algae, and certain bacteria convert light energy into chemical energy stored in glucose molecules.\n\nThis process is fundamental to life on Earth as it produces oxygen and serves as the primary source of energy for most ecosystems.`,
    detailedExplanation: `The photosynthesis process occurs in two main stages:\n\n**Light-Dependent Reactions (Photo Stage):**\nThese reactions occur in the thylakoid membranes of chloroplasts. Chlorophyll absorbs light energy, which excites electrons and drives the production of ATP and NADPH. Water molecules are split, releasing oxygen as a byproduct.\n\n**Light-Independent Reactions (Calvin Cycle):**\nThese reactions take place in the stroma of chloroplasts. Carbon dioxide from the atmosphere is fixed into organic molecules using the ATP and NADPH produced in the light-dependent reactions.`,
    keyPoints: [
      "Occurs in chloroplasts of plant cells",
      "Requires sunlight, carbon dioxide, and water",
      "Produces glucose and oxygen",
      "Essential for oxygen production on Earth",
      "Foundation of most food chains"
    ],
    examples: [
      {
        title: "Leaf Structure",
        description: "Leaves are specifically adapted for photosynthesis with their broad, flat surface area to capture maximum sunlight.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
      },
      {
        title: "Chloroplast Function",
        description: "Chloroplasts contain chlorophyll pigments that absorb light energy and convert it into chemical energy.",
        image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?w=400&h=300&fit=crop"
      }
    ],
    formula: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂",
    ...concept
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BookOpen' },
    { id: 'detailed', label: 'Detailed', icon: 'Microscope' },
    { id: 'examples', label: 'Examples', icon: 'Image' },
    { id: 'formula', label: 'Formula', icon: 'Calculator' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {mockConcept?.overview}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span>Key Points to Remember</span>
              </h4>
              <ul className="space-y-2">
                {mockConcept?.keyPoints?.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-foreground">
                    <Icon name="Dot" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
        
      case 'detailed':
        return (
          <div className="prose prose-gray max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-line">
              {mockConcept?.detailedExplanation}
            </div>
          </div>
        );
        
      case 'examples':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            {mockConcept?.examples?.map((example, index) => (
              <div key={index} className="bg-card border rounded-lg overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <Image 
                    src={example?.image} 
                    alt={example?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-foreground mb-2">{example?.title}</h4>
                  <p className="text-sm text-muted-foreground">{example?.description}</p>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'formula':
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <h4 className="font-medium text-foreground mb-4">Chemical Equation</h4>
              <div className="text-lg font-data text-primary bg-background rounded-lg p-4 border">
                {mockConcept?.formula}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-card border rounded-lg p-4">
                <h5 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                  <Icon name="ArrowRight" size={16} className="text-success" />
                  <span>Reactants</span>
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Carbon Dioxide (CO₂)</li>
                  <li>• Water (H₂O)</li>
                  <li>• Light Energy</li>
                </ul>
              </div>
              
              <div className="bg-card border rounded-lg p-4">
                <h5 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                  <Icon name="ArrowLeft" size={16} className="text-primary" />
                  <span>Products</span>
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Glucose (C₆H₁₂O₆)</li>
                  <li>• Oxygen (O₂)</li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onNeedMoreHelp}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200"
          >
            <Icon name="HelpCircle" size={16} />
            <span className="font-medium">Need More Help</span>
          </button>
          
          <button
            onClick={onGotIt}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <Icon name="CheckCircle" size={16} />
            <span className="font-medium">Got It!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationContent;