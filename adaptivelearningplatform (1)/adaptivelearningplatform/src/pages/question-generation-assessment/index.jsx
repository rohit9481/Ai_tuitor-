import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LearningProgressHeader from '../../components/ui/LearningProgressHeader';
import AdaptiveNavigationBreadcrumb from '../../components/ui/AdaptiveNavigationBreadcrumb';
import FloatingActionAssistant from '../../components/ui/FloatingActionAssistant';
import SessionStatusIndicator from '../../components/ui/SessionStatusIndicator';
import QuestionCard from './components/QuestionCard';
import QuestionNavigation from './components/QuestionNavigation';
import QuestionOverview from './components/QuestionOverview';
import AssessmentSummary from './components/AssessmentSummary';
import Button from '../../components/ui/Button';

// Import AI services
import questionGenerationService from '../../services/questionGenerationService';


const QuestionGenerationAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [confidence, setConfidence] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionStatus, setSessionStatus] = useState('active');
  const [showSummary, setShowSummary] = useState(false);
  const [lastSaved, setLastSaved] = useState('Just now');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [concepts, setConcepts] = useState([]);
  const [learningPathway, setLearningPathway] = useState(null);

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length;
  const answeredQuestions = Object.keys(answers);
  const completionPercentage = totalQuestions > 0 ? Math.round((answeredQuestions?.length / totalQuestions) * 100) : 0;

  // Load data from navigation state or sessionStorage
  useEffect(() => {
    const loadData = async () => {
      let conceptsData = [];
      let pathwayData = null;

      // Try to get data from navigation state first
      if (location.state?.concepts) {
        conceptsData = location.state?.concepts;
        pathwayData = location.state?.learningPathway;
      } else {
        // Fallback to sessionStorage
        const storedConcepts = sessionStorage.getItem('extractedConcepts');
        const storedPathway = sessionStorage.getItem('learningPathway');
        
        if (storedConcepts) {
          conceptsData = JSON.parse(storedConcepts);
        }
        if (storedPathway) {
          pathwayData = JSON.parse(storedPathway);
        }
      }

      setConcepts(conceptsData);
      setLearningPathway(pathwayData);

      // Generate questions if we have concepts
      if (conceptsData?.length > 0) {
        await generateQuestionsFromConcepts(conceptsData);
      } else {
        // Fallback to demo questions if no concepts available
        console.warn('No concepts found, redirecting to file upload');
        navigate('/file-upload');
      }
    };

    loadData();
  }, [location.state, navigate]);

  // Generate questions from concepts using AI
  const generateQuestionsFromConcepts = async (conceptsData) => {
    setIsGeneratingQuestions(true);
    
    try {
      // Generate questions for up to 3 concepts to keep assessment manageable
      const selectedConcepts = conceptsData?.slice(0, 3);
      const questionPromises = selectedConcepts?.map(concept =>
        questionGenerationService?.generateQuestionsForConcept(concept, {
          questionCount: 3,
          questionTypes: ['multiple_choice', 'true_false', 'short_answer']
        })
      );

      const questionSets = await Promise.all(questionPromises);
      const allQuestions = questionSets?.flat();
      
      // Shuffle questions for better experience
      const shuffledQuestions = questionGenerationService?.shuffleQuestions(allQuestions);
      setQuestions(shuffledQuestions);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to demo questions
      setQuestions(getDemoQuestions());
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Fallback demo questions
  const getDemoQuestions = () => {
    return [
      {
        id: 'demo_1',
        number: 1,
        type: 'multiple_choice',
        difficulty: 'easy',
        question: "What is the primary purpose of machine learning?",
        context: "Machine learning is a subset of artificial intelligence that enables computers to learn without being explicitly programmed.",
        options: [
          { id: 'a', text: 'To automate repetitive tasks', explanation: 'While ML can automate tasks, this is not its primary purpose' },
          { id: 'b', text: 'To enable computers to learn from data', explanation: 'Correct - ML allows systems to improve performance through experience' },
          { id: 'c', text: 'To replace human intelligence', explanation: 'ML augments rather than replaces human intelligence' },
          { id: 'd', text: 'To process large amounts of data', explanation: 'Data processing is a component, not the primary purpose' }
        ],
        correctAnswer: 'b',
        conceptId: 'demo_concept_1',
        createdAt: new Date()?.toISOString()
      },
      {
        id: 'demo_2',
        number: 2,
        type: 'true_false',
        difficulty: 'medium',
        question: "Supervised learning requires labeled training data.",
        context: "Understanding the difference between supervised and unsupervised learning is crucial.",
        correctAnswer: 'true',
        explanation: 'Supervised learning uses labeled examples to train models to make predictions.',
        conceptId: 'demo_concept_2',
        createdAt: new Date()?.toISOString()
      }
    ];
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (sessionStatus === 'active') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);

  // Auto-save effect
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (sessionStatus === 'active' && answeredQuestions?.length > 0) {
        setSessionStatus('saving');
        setTimeout(() => {
          setSessionStatus('saved');
          setLastSaved('Just now');
          setTimeout(() => setSessionStatus('active'), 1000);
        }, 500);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [sessionStatus, answeredQuestions?.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleAnswerChange = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion?.id]: answer
    }));
    setShowValidation(false);
  };

  const handleConfidenceChange = (level) => {
    setConfidence(prev => ({
      ...prev,
      [currentQuestion?.id]: level
    }));
  };

  const handleNext = () => {
    if (!answers?.[currentQuestion?.id]) {
      setShowValidation(true);
      return;
    }
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowValidation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowValidation(false);
    }
  };

  const handleSubmit = async () => {
    if (!answers?.[currentQuestion?.id]) {
      setShowValidation(true);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay and analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSummary(true);
  };

  const handleQuestionSelect = (questionId) => {
    const questionIndex = questions?.findIndex(q => q?.id === questionId);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
    }
  };

  const handlePauseSession = () => {
    setSessionStatus(sessionStatus === 'active' ? 'paused' : 'active');
  };

  const handleSessionManage = (action) => {
    switch (action) {
      case 'pause':
        handlePauseSession();
        break;
      case 'save': setSessionStatus('saving');
        setTimeout(() => {
          setSessionStatus('saved');
          setLastSaved('Just now');
          setTimeout(() => setSessionStatus('active'), 1000);
        }, 1000);
        break;
      case 'manage':
        // Handle session management
        break;
    }
  };

  const handleExplanationRequest = () => {
    // Navigate to explanations with current context
    navigate('/adaptive-learning-explanations', {
      state: {
        currentQuestion: currentQuestion,
        userAnswer: answers?.[currentQuestion?.id],
        confidence: confidence?.[currentQuestion?.id] || 3,
        concepts: concepts,
        learningPathway: learningPathway
      }
    });
  };

  const handleHintRequest = () => {
    // Show hint modal or tooltip
    console.log('Hint requested for question:', currentQuestion?.id);
  };

  const handleHelpRequest = () => {
    // Show help modal
    console.log('Help requested');
  };

  const generateAssessmentResults = () => {
    const totalAnswered = answeredQuestions?.length;
    let correctCount = 0;
    let conceptPerformance = {};

    // Analyze answers
    answeredQuestions?.forEach(questionId => {
      const question = questions?.find(q => q?.id === questionId);
      const userAnswer = answers?.[questionId];
      
      if (question && userAnswer === question?.correctAnswer) {
        correctCount++;
      }

      // Track concept performance
      if (question?.conceptId) {
        if (!conceptPerformance?.[question?.conceptId]) {
          conceptPerformance[question.conceptId] = { correct: 0, total: 0, concept: question?.conceptName };
        }
        conceptPerformance[question.conceptId].total++;
        if (userAnswer === question?.correctAnswer) {
          conceptPerformance[question.conceptId].correct++;
        }
      }
    });

    // Identify weak and strong areas
    const weakAreas = [];
    const strongAreas = [];

    Object.values(conceptPerformance)?.forEach(perf => {
      const score = Math.round((perf?.correct / perf?.total) * 100);
      if (score < 60) {
        weakAreas?.push({ topic: perf?.concept, score });
      } else if (score >= 80) {
        strongAreas?.push({ topic: perf?.concept, score });
      }
    });

    return {
      totalQuestions: totalAnswered,
      correctAnswers: correctCount,
      incorrectAnswers: totalAnswered - correctCount,
      averageConfidence: Object.values(confidence)?.length > 0 ? 
        (Object.values(confidence)?.reduce((a, b) => a + b, 0) / Object.values(confidence)?.length)?.toFixed(1) : 3.0,
      timeSpent: formatTime(sessionTime),
      overallScore: totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0,
      weakAreas,
      strongAreas,
      conceptPerformance
    };
  };

  const handleRetakeAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setConfidence({});
    setShowSummary(false);
    setSessionTime(0);
    setSessionStatus('active');
  };

  const handleContinueToExplanations = () => {
    const results = generateAssessmentResults();
    navigate('/adaptive-learning-explanations', {
      state: {
        assessmentResults: results,
        weakAreas: results?.weakAreas,
        concepts: concepts,
        learningPathway: learningPathway
      }
    });
  };

  // Loading state while generating questions
  if (isGeneratingQuestions) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Generating personalized questions...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <AssessmentSummary
          results={generateAssessmentResults()}
          onRetakeAssessment={handleRetakeAssessment}
          onContinueToExplanations={handleContinueToExplanations}
          sessionData={{ time: formatTime(sessionTime) }}
        />
      </div>
    );
  }

  if (!currentQuestion && totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No questions available</p>
            <Button onClick={() => navigate('/file-upload')}>
              Upload Learning Material
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LearningProgressHeader
        currentPhase="Assessment"
        questionProgress={{ current: currentQuestionIndex + 1, total: totalQuestions }}
        completionPercentage={completionPercentage}
        sessionTime={formatTime(sessionTime)}
        onPause={handlePauseSession}
        onSettings={() => console.log('Settings')}
      />
      <AdaptiveNavigationBreadcrumb
        currentPhase="Assessment"
        completedPhases={['upload']}
        sessionProgress={{ completion: completionPercentage }}
      />
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 border-r bg-card/50">
          <div className="sticky top-32 p-4">
            <QuestionOverview
              questions={questions}
              currentQuestion={currentQuestion?.id}
              answeredQuestions={answeredQuestions?.map(id => questions?.find(q => q?.id === id)?.number)?.filter(Boolean)}
              onQuestionSelect={handleQuestionSelect}
              onToggleOverview={() => {}}
              isVisible={true}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto">
          <div className="p-4 pb-24">
            {/* Session Status */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="List"
                  onClick={() => setShowOverview(true)}
                  className="lg:hidden"
                >
                  Overview
                </Button>
              </div>
              
              <SessionStatusIndicator
                sessionStatus={sessionStatus}
                lastSaved={lastSaved}
                sessionName="AI Assessment"
                onSessionManage={handleSessionManage}
                autoSaveEnabled={true}
              />
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                currentAnswer={answers?.[currentQuestion?.id]}
                onAnswerChange={handleAnswerChange}
                onConfidenceChange={handleConfidenceChange}
                confidence={confidence?.[currentQuestion?.id] || 3}
                showValidation={showValidation}
                isSubmitted={false}
              />
            )}
          </div>

          {/* Navigation */}
          {currentQuestion && (
            <QuestionNavigation
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              canGoNext={!!answers?.[currentQuestion?.id]}
              canGoPrevious={currentQuestionIndex > 0}
              isLastQuestion={currentQuestionIndex === totalQuestions - 1}
              isSubmitting={isSubmitting}
              showValidation={showValidation}
            />
          )}
        </div>
      </div>
      {/* Mobile Question Overview */}
      <QuestionOverview
        questions={questions}
        currentQuestion={currentQuestion?.id}
        answeredQuestions={answeredQuestions?.map(id => questions?.find(q => q?.id === id)?.number)?.filter(Boolean)}
        onQuestionSelect={handleQuestionSelect}
        onToggleOverview={() => setShowOverview(false)}
        isVisible={showOverview}
      />
      {/* Floating Action Assistant */}
      <FloatingActionAssistant
        currentContext="assessment"
        onExplanationRequest={handleExplanationRequest}
        onHelpRequest={handleHelpRequest}
        onHintRequest={handleHintRequest}
        disabled={sessionStatus === 'paused'}
      />
    </div>
  );
};

export default QuestionGenerationAssessment;