import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RelatedConceptsCard = ({ 
  concepts = [],
  onConceptSelect
}) => {
  const mockConcepts = [
    {
      id: 1,
      title: "Cellular Respiration",
      description: "The process by which cells break down glucose to release energy",
      difficulty: "Intermediate",
      estimatedTime: "6 min",
      completionStatus: "not_started",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?w=300&h=200&fit=crop",
      relationship: "opposite_process"
    },
    {
      id: 2,
      title: "Chloroplast Structure",
      description: "Detailed anatomy of the organelle where photosynthesis occurs",
      difficulty: "Advanced",
      estimatedTime: "10 min",
      completionStatus: "in_progress",
      image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=300&h=200&fit=crop",
      relationship: "prerequisite"
    },
    {
      id: 3,
      title: "Light Spectrum & Plants",
      description: "How different wavelengths of light affect plant growth",
      difficulty: "Beginner",
      estimatedTime: "4 min",
      completionStatus: "completed",
      image: "https://images.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg?w=300&h=200&fit=crop",
      relationship: "related_topic"
    },
    {
      id: 4,
      title: "Plant Nutrition",
      description: "Essential nutrients plants need for healthy growth",
      difficulty: "Beginner",
      estimatedTime: "5 min",
      completionStatus: "not_started",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
      relationship: "related_topic"
    }
  ];

  const displayConcepts = concepts?.length > 0 ? concepts : mockConcepts;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'in_progress':
        return { icon: 'Clock', color: 'text-warning' };
      case 'not_started':
        return { icon: 'Circle', color: 'text-muted-foreground' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-success bg-success/10';
      case 'intermediate':
        return 'text-warning bg-warning/10';
      case 'advanced':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getRelationshipLabel = (relationship) => {
    switch (relationship) {
      case 'prerequisite':
        return { label: 'Prerequisite', icon: 'ArrowUp', color: 'text-primary' };
      case 'opposite_process':
        return { label: 'Opposite Process', icon: 'RefreshCw', color: 'text-secondary' };
      case 'related_topic':
        return { label: 'Related', icon: 'Link', color: 'text-accent' };
      default:
        return { label: 'Related', icon: 'Link', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
            Related Concepts
          </h2>
          <p className="text-muted-foreground">
            Explore connected topics to deepen your understanding
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {displayConcepts?.map((concept) => {
            const statusConfig = getStatusIcon(concept?.completionStatus);
            const relationshipConfig = getRelationshipLabel(concept?.relationship);

            return (
              <div
                key={concept?.id}
                className="bg-card border rounded-lg overflow-hidden hover:shadow-card transition-all duration-200 cursor-pointer group"
                onClick={() => onConceptSelect?.(concept)}
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden">
                  <Image 
                    src={concept?.image} 
                    alt={concept?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Content */}
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                        {concept?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {concept?.description}
                      </p>
                    </div>
                    <Icon 
                      name={statusConfig?.icon} 
                      size={16} 
                      className={statusConfig?.color}
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(concept?.difficulty)}`}>
                        {concept?.difficulty}
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Icon name="Clock" size={12} />
                        <span>{concept?.estimatedTime}</span>
                      </div>
                    </div>

                    <div className={`flex items-center space-x-1 text-xs ${relationshipConfig?.color}`}>
                      <Icon name={relationshipConfig?.icon} size={12} />
                      <span>{relationshipConfig?.label}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <span className="text-sm font-medium">
                        {concept?.completionStatus === 'completed' ? 'Review' : 
                         concept?.completionStatus === 'in_progress' ? 'Continue' : 'Start Learning'}
                      </span>
                      <Icon name="ArrowRight" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-6">
          <Link
            to="/concepts"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-200"
          >
            <span className="text-sm font-medium">View All Concepts</span>
            <Icon name="ExternalLink" size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedConceptsCard;