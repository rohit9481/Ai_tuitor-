import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LearningProgressHeader from '../../components/ui/LearningProgressHeader';
import AdaptiveNavigationBreadcrumb from '../../components/ui/AdaptiveNavigationBreadcrumb';
import FloatingActionAssistant from '../../components/ui/FloatingActionAssistant';
import SessionStatusIndicator from '../../components/ui/SessionStatusIndicator';

// Import page-specific components
import ExplanationHeader from './components/ExplanationHeader';
import ExplanationContent from './components/ExplanationContent';
import AIAvatarPlayer from './components/AIAvatarPlayer';
import LearningModeToggle from './components/LearningModeToggle';
import RelatedConceptsCard from './components/RelatedConceptsCard';
import NoteTakingPanel from './components/NoteTakingPanel';
import MasteryProgressIndicator from './components/MasteryProgressIndicator';
import Icon from '../../components/AppIcon';

// Import AI services
import adaptiveLearningService from '../../services/adaptiveLearningService';

const AdaptiveLearningExplanations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [learningMode, setLearningMode] = useState('text');
  const [sessionStatus, setSessionStatus] = useState('active');
  const [currentConcept, setCurrentConcept] = useState(null);
  const [personalizedExplanation, setPersonalizedExplanation] = useState(null);
  const [audioScript, setAudioScript] = useState(null);
  const [masteryLevel, setMasteryLevel] = useState(0);
  const [sessionTime, setSessionTime] = useState('00:00');
  const [isNotePanelExpanded, setIsNotePanelExpanded] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [concepts, setConcepts] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [weakAreas, setWeakAreas] = useState([]);

  // Load data from navigation state or determine focus concept
  useEffect(() => {
    const loadData = async () => {
      let conceptsData = [];
      let resultsData = null;
      let weakAreasData = [];
      let focusConcept = null;

      // Get data from navigation state
      if (location.state) {
        conceptsData = location.state?.concepts || [];
        resultsData = location.state?.assessmentResults;
        weakAreasData = location.state?.weakAreas || [];

        if (location.state?.currentQuestion) {
          // Find concept related to current question
          focusConcept = conceptsData?.find(c => c?.id === location.state?.currentQuestion?.conceptId);
        }
      }

      // Fallback to sessionStorage
      if (!conceptsData?.length) {
        const storedConcepts = sessionStorage.getItem('extractedConcepts');
        if (storedConcepts) {
          conceptsData = JSON.parse(storedConcepts);
        }
      }

      setConcepts(conceptsData);
      setAssessmentResults(resultsData);
      setWeakAreas(weakAreasData);

      // Determine which concept to explain
      if (!focusConcept) {
        // If no specific concept, focus on weakest area or first concept
        if (weakAreasData?.length > 0) {
          focusConcept = conceptsData?.find(c => 
            c?.name?.toLowerCase()?.includes(weakAreasData?.[0]?.topic?.toLowerCase())
          ) || conceptsData?.[0];
        } else {
          focusConcept = conceptsData?.[0];
        }
      }

      if (focusConcept) {
        setCurrentConcept(focusConcept);
        setMasteryLevel(focusConcept?.masteryLevel || 0);
        await generatePersonalizedExplanation(focusConcept, resultsData);
      } else {
        // Redirect back if no concepts available
        navigate('/file-upload');
      }
    };

    loadData();
  }, [location.state, navigate]);

  // Generate personalized explanation using AI
  const generatePersonalizedExplanation = async (concept, userResults = null) => {
    setIsGeneratingExplanation(true);
    
    try {
      // Build user context from assessment results
      const userContext = {
        currentMasteryLevel: concept?.masteryLevel || 0,
        previousAttempts: concept?.attempts || 0,
        learningStyle: 'visual', // Could be determined from user preferences
        preferredComplexity: concept?.difficulty?.toLowerCase() || 'intermediate',
        mistakePatterns: userResults?.weakAreas?.map(area => area?.topic) || []
      };

      const explanation = await adaptiveLearningService?.generatePersonalizedExplanation(
        concept,
        userContext
      );

      setPersonalizedExplanation(explanation);

      // Generate audio script for avatar mode
      if (learningMode === 'avatar') {
        const script = await adaptiveLearningService?.createAudioScript(explanation, {
          pace: 'normal',
          tone: 'encouraging',
          includeExamples: true
        });
        setAudioScript(script);
      }

    } catch (error) {
      console.error('Error generating explanation:', error);
      // Fallback to concept's basic explanation
      setPersonalizedExplanation({
        overview: concept?.description,
        detailedExplanation: `Let's explore ${concept?.name} in detail.\n\n${concept?.description}`,
        keyPoints: concept?.keyPrinciples || [],
        examples: concept?.examples?.map(ex => ({ title: ex, description: ex, type: 'text' })) || [],
        practiceExercises: [],
        commonPitfalls: concept?.misconceptions || [],
        realWorldApplications: [],
        nextSteps: [],
        estimatedStudyTime: concept?.estimatedTime || '10 min',
        conceptId: concept?.id,
        conceptName: concept?.name
      });
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  // Session timer
  useEffect(() => {
    let startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setSessionTime(`${minutes}:${seconds?.toString()?.padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Event handlers
  const handleBackToAssessment = () => {
    navigate('/question-generation-assessment');
  };

  const handleModeChange = async (mode) => {
    setLearningMode(mode);
    
    // Generate audio script when switching to avatar mode
    if (mode === 'avatar' && personalizedExplanation && !audioScript) {
      try {
        const script = await adaptiveLearningService?.createAudioScript(personalizedExplanation, {
          pace: 'normal',
          tone: 'encouraging',
          includeExamples: true
        });
        setAudioScript(script);
      } catch (error) {
        console.error('Error generating audio script:', error);
      }
    }
  };

  const handleGotIt = () => {
    // Simulate understanding confirmation
    setMasteryLevel(prev => Math.min(100, prev + 15));
    
    // Show success feedback
    setTimeout(() => {
      // Navigate to next concept or back to assessment
      navigate('/question-generation-assessment');
    }, 1500);
  };

  const handleNeedMoreHelp = () => {
    // Provide additional explanation or examples
    setShowHelpModal(true);
  };

  const handleConceptSelect = async (concept) => {
    setCurrentConcept(concept);
    setMasteryLevel(concept?.masteryLevel || 0);
    await generatePersonalizedExplanation(concept, assessmentResults);
  };

  const handleSessionManage = (action) => {
    switch (action) {
      case 'pause':
        setSessionStatus(sessionStatus === 'active' ? 'paused' : 'active');
        break;
      case 'save': setSessionStatus('saving');
        setTimeout(() => setSessionStatus('saved'), 1000);
        setTimeout(() => setSessionStatus('active'), 2000);
        break;
      case 'manage':
        // Open session management modal
        break;
      default:
        break;
    }
  };

  const handleExplanationRequest = () => {
    // Request additional explanation
    setShowHelpModal(true);
  };

  const handleHelpRequest = () => {
    setShowHelpModal(true);
  };

  const handleHintRequest = () => {
    // Provide learning hint
    setShowHelpModal(true);
  };

  const handlePlaybackComplete = () => {
    // Handle avatar explanation completion
    setMasteryLevel(prev => Math.min(100, prev + 10));
  };

  const handlePauseSession = () => {
    handleSessionManage('pause');
  };

  const handleSessionSettings = () => {
    handleSessionManage('manage');
  };

  const handleViewProgress = () => {
    navigate('/progress');
  };

  // Loading state
  if (isGeneratingExplanation || (!currentConcept && !personalizedExplanation)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {isGeneratingExplanation ? 'Generating personalized explanation...' : 'Loading explanation...'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <Header />
      {/* Learning Progress Header */}
      <LearningProgressHeader
        currentPhase="Explanation"
        questionProgress={{ current: 1, total: concepts?.length }}
        completionPercentage={masteryLevel}
        sessionTime={sessionTime}
        onPause={handlePauseSession}
        onSettings={handleSessionSettings}
      />
      {/* Adaptive Navigation Breadcrumb */}
      <AdaptiveNavigationBreadcrumb
        currentPhase="Explanation"
        completedPhases={assessmentResults ? ['upload', 'assessment'] : ['upload']}
        availableNextSteps={['review']}
        sessionProgress={{ current: 1, total: concepts?.length }}
      />
      {/* Session Status */}
      <div className="sticky top-32 z-30 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-heading font-semibold text-foreground">
              AI Explanation
            </h1>
          </div>
          <SessionStatusIndicator
            sessionStatus={sessionStatus}
            lastSaved="1 minute ago"
            sessionName={`${currentConcept?.name || 'Learning'} Session`}
            onSessionManage={handleSessionManage}
            autoSaveEnabled={true}
          />
        </div>
      </div>
      {/* Main Content */}
      <div className={`transition-all duration-300 ${isNotePanelExpanded ? 'ml-80' : 'ml-0'}`}>
        {/* Explanation Header */}
        {currentConcept && (
          <ExplanationHeader
            conceptTitle={currentConcept?.name}
            difficulty={currentConcept?.difficulty}
            estimatedTime={personalizedExplanation?.estimatedStudyTime || currentConcept?.estimatedTime}
            completionPercentage={masteryLevel}
            onBackToAssessment={handleBackToAssessment}
          />
        )}

        {/* Learning Mode Toggle */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <LearningModeToggle
            currentMode={learningMode}
            onModeChange={handleModeChange}
            disabled={sessionStatus === 'paused'}
          />

          {/* AI Avatar Player (when in avatar mode) */}
          {learningMode === 'avatar' && (
            <AIAvatarPlayer
              isVisible={true}
              explanationText={audioScript?.script || personalizedExplanation?.overview}
              onToggleMode={() => handleModeChange('text')}
              onPlaybackComplete={handlePlaybackComplete}
            />
          )}

          {/* Mastery Progress Indicator */}
          <MasteryProgressIndicator
            currentLevel={masteryLevel}
            targetLevel={80}
            conceptsCompleted={1}
            totalConcepts={concepts?.length}
            timeSpent={sessionTime}
            onViewProgress={handleViewProgress}
          />
        </div>

        {/* Explanation Content */}
        {personalizedExplanation && (
          <ExplanationContent
            concept={personalizedExplanation}
            onNeedMoreHelp={handleNeedMoreHelp}
            onGotIt={handleGotIt}
          />
        )}

        {/* Related Concepts */}
        <RelatedConceptsCard
          concepts={concepts?.filter(c => c?.id !== currentConcept?.id)?.slice(0, 3)}
          onConceptSelect={handleConceptSelect}
        />
      </div>
      {/* Note Taking Panel */}
      <NoteTakingPanel
        isExpanded={isNotePanelExpanded}
        onToggleExpanded={setIsNotePanelExpanded}
        conceptTitle={currentConcept?.name}
      />
      {/* Floating Action Assistant */}
      <FloatingActionAssistant
        currentContext="explanation"
        onExplanationRequest={handleExplanationRequest}
        onHelpRequest={handleHelpRequest}
        onHintRequest={handleHintRequest}
        disabled={sessionStatus === 'paused'}
      />
      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Need Help?
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg hover:bg-muted transition-colors duration-200"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                I'm here to help you understand this concept better. What would you like me to explain further?
              </p>
              <div className="space-y-2">
                <button 
                  className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors duration-200"
                  onClick={() => {
                    // Generate additional simpler explanation
                    setShowHelpModal(false);
                  }}
                >
                  <div className="font-medium text-foreground">Explain with simpler terms</div>
                  <div className="text-xs text-muted-foreground">Break down complex concepts</div>
                </button>
                <button 
                  className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors duration-200"
                  onClick={() => {
                    // Show more examples
                    setShowHelpModal(false);
                  }}
                >
                  <div className="font-medium text-foreground">Show more examples</div>
                  <div className="text-xs text-muted-foreground">Provide additional real-world examples</div>
                </button>
                <button 
                  className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors duration-200"
                  onClick={() => {
                    // Switch to visual mode
                    setLearningMode('text');
                    setShowHelpModal(false);
                  }}
                >
                  <div className="font-medium text-foreground">Visual explanation</div>
                  <div className="text-xs text-muted-foreground">Show diagrams and illustrations</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveLearningExplanations;