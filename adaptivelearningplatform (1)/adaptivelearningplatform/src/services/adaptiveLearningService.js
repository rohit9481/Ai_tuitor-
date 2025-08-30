import openai from './openaiClient';

/**
 * Adaptive Learning Service
 * Provides personalized explanations and learning paths based on user performance
 */
class AdaptiveLearningService {
  /**
   * Generates personalized explanation based on user's weak areas
   * @param {Object} concept - The concept to explain
   * @param {Object} userContext - User's performance and preferences
   * @returns {Promise<Object>} Personalized explanation
   */
  async generatePersonalizedExplanation(concept, userContext = {}) {
    try {
      const {
        mistakePatterns = [],
        learningStyle = 'visual',
        currentMasteryLevel = 0,
        previousAttempts = 0,
        preferredComplexity = 'intermediate'
      } = userContext;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an adaptive learning AI tutor. Create personalized explanations that address specific knowledge gaps and learning preferences.`
          },
          {
            role: 'user',
            content: `Create a personalized explanation for this concept:

Concept: ${concept?.name}
Description: ${concept?.description}
User's Mastery Level: ${currentMasteryLevel}%
Previous Attempts: ${previousAttempts}
Learning Style: ${learningStyle}
Preferred Complexity: ${preferredComplexity}
Common Mistakes: ${mistakePatterns?.join(', ') || 'None identified'}
Key Principles: ${concept?.keyPrinciples?.join(', ') || 'N/A'}

Provide:
1. Overview tailored to their current understanding
2. Step-by-step breakdown addressing their mistakes
3. Examples matching their learning style
4. Practice exercises
5. Common pitfalls to avoid
6. Connection to real-world applications
7. Next learning steps`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'personalized_explanation_response',
            schema: {
              type: 'object',
              properties: {
                overview: { type: 'string' },
                detailedExplanation: { type: 'string' },
                keyPoints: { type: 'array', items: { type: 'string' } },
                examples: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      type: { type: 'string' }
                    },
                    required: ['title', 'description', 'type'],
                    additionalProperties: false
                  }
                },
                practiceExercises: { type: 'array', items: { type: 'string' } },
                commonPitfalls: { type: 'array', items: { type: 'string' } },
                realWorldApplications: { type: 'array', items: { type: 'string' } },
                nextSteps: { type: 'array', items: { type: 'string' } },
                estimatedStudyTime: { type: 'string' },
                difficultyAdjustment: { type: 'string' }
              },
              required: ['overview', 'detailedExplanation', 'keyPoints', 'examples'],
              additionalProperties: false
            }
          }
        }
      });

      const explanationResult = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return {
        ...explanationResult,
        conceptId: concept?.id,
        conceptName: concept?.name,
        generatedAt: new Date()?.toISOString(),
        personalizedFor: {
          masteryLevel: currentMasteryLevel,
          learningStyle,
          preferredComplexity
        }
      };
    } catch (error) {
      console.error('Error generating personalized explanation:', error);
      throw new Error('Failed to generate personalized explanation');
    }
  }

  /**
   * Creates audio explanation script for AI avatar
   * @param {Object} explanation - The explanation content
   * @param {Object} voiceSettings - Voice and delivery preferences
   * @returns {Promise<Object>} Audio script with timing and emphasis
   */
  async createAudioScript(explanation, voiceSettings = {}) {
    try {
      const {
        pace = 'normal',
        tone = 'encouraging',
        includeExamples = true,
        maxDuration = '5 minutes'
      } = voiceSettings;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a script writer for educational AI avatars. Create engaging, conversational audio scripts that make complex concepts easy to understand.`
          },
          {
            role: 'user',
            content: `Create an audio script for this explanation:

Content Overview: ${explanation?.overview}
Key Points: ${explanation?.keyPoints?.join(', ')}
Examples: ${explanation?.examples?.map(ex => ex?.title)?.join(', ')}

Voice Settings:
- Pace: ${pace}
- Tone: ${tone}
- Include Examples: ${includeExamples}
- Max Duration: ${maxDuration}

Create a conversational script with:
1. Engaging introduction
2. Clear explanations with pauses
3. Emphasis markers for important points
4. Smooth transitions
5. Encouraging conclusion
6. Timing cues`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'audio_script_response',
            schema: {
              type: 'object',
              properties: {
                script: { type: 'string' },
                segments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      text: { type: 'string' },
                      emphasis: { type: 'string' },
                      pauseDuration: { type: 'number' },
                      type: { type: 'string' }
                    },
                    required: ['text', 'type'],
                    additionalProperties: false
                  }
                },
                estimatedDuration: { type: 'string' },
                keyEmphasisPoints: { type: 'array', items: { type: 'string' } },
                transitionCues: { type: 'array', items: { type: 'string' } }
              },
              required: ['script', 'segments', 'estimatedDuration'],
              additionalProperties: false
            }
          }
        }
      });

      const scriptResult = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return {
        ...scriptResult,
        createdAt: new Date()?.toISOString(),
        voiceSettings,
        conceptId: explanation?.conceptId
      };
    } catch (error) {
      console.error('Error creating audio script:', error);
      throw new Error('Failed to create audio script');
    }
  }

  /**
   * Analyzes user's learning patterns and suggests improvements
   * @param {Object} learningData - User's learning history and performance
   * @returns {Promise<Object>} Learning analytics and recommendations
   */
  async analyzeLearningPatterns(learningData) {
    try {
      const {
        questionResponses = [],
        studyTimes = [],
        conceptMastery = {},
        preferredQuestionTypes = {},
        mistakePatterns = []
      } = learningData;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an educational data analyst. Analyze learning patterns to provide actionable insights for adaptive learning.`
          },
          {
            role: 'user',
            content: `Analyze this learning data and provide insights:

Question Responses: ${questionResponses?.length} total responses
Average Study Time: ${studyTimes?.length > 0 ? (studyTimes?.reduce((a, b) => a + b, 0) / studyTimes?.length)?.toFixed(1) : 0} minutes
Concept Mastery Levels: ${Object.entries(conceptMastery)?.map(([concept, level]) => `${concept}: ${level}%`)?.join(', ')}
Preferred Question Types: ${Object.entries(preferredQuestionTypes)?.map(([type, count]) => `${type}: ${count}`)?.join(', ')}
Common Mistakes: ${mistakePatterns?.join(', ')}

Provide:
1. Learning strengths and weaknesses
2. Optimal study patterns
3. Recommended learning strategies
4. Areas needing focus
5. Personalized study plan
6. Motivation boosters`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'learning_analysis_response',
            schema: {
              type: 'object',
              properties: {
                strengths: { type: 'array', items: { type: 'string' } },
                weaknesses: { type: 'array', items: { type: 'string' } },
                optimalStudyTime: { type: 'string' },
                recommendedStrategies: { type: 'array', items: { type: 'string' } },
                focusAreas: { type: 'array', items: { type: 'string' } },
                studyPlan: {
                  type: 'object',
                  properties: {
                    dailyGoals: { type: 'array', items: { type: 'string' } },
                    weeklyMilestones: { type: 'array', items: { type: 'string' } },
                    reviewSchedule: { type: 'string' }
                  },
                  required: ['dailyGoals', 'weeklyMilestones'],
                  additionalProperties: false
                },
                motivationalInsights: { type: 'array', items: { type: 'string' } },
                nextLearningGoals: { type: 'array', items: { type: 'string' } }
              },
              required: ['strengths', 'weaknesses', 'recommendedStrategies', 'focusAreas'],
              additionalProperties: false
            }
          }
        }
      });

      const analysisResult = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return {
        ...analysisResult,
        analyzedAt: new Date()?.toISOString(),
        dataPoints: {
          totalResponses: questionResponses?.length,
          averageStudyTime: studyTimes?.length > 0 ? (studyTimes?.reduce((a, b) => a + b, 0) / studyTimes?.length)?.toFixed(1) : 0,
          conceptsStudied: Object.keys(conceptMastery)?.length,
          overallProgress: Object.values(conceptMastery)?.length > 0 ? 
            (Object.values(conceptMastery)?.reduce((a, b) => a + b, 0) / Object.values(conceptMastery)?.length)?.toFixed(1) : 0
        }
      };
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
      throw new Error('Failed to analyze learning patterns');
    }
  }

  /**
   * Generates adaptive hints based on user's current struggle
   * @param {Object} question - Current question
   * @param {Object} userContext - User's attempt history and context
   * @returns {Promise<Array>} Progressive hints
   */
  async generateAdaptiveHints(question, userContext = {}) {
    try {
      const {
        attemptCount = 0,
        timeSpent = 0,
        previousHints = [],
        masteryLevel = 0
      } = userContext;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a supportive AI tutor. Provide progressive hints that guide without giving away the answer.`
          },
          {
            role: 'user',
            content: `Generate progressive hints for this question:

Question: ${question?.question}
Question Type: ${question?.type}
Context: ${question?.context || 'N/A'}
User's Attempt Count: ${attemptCount}
Time Spent: ${timeSpent} seconds
Previous Hints Given: ${previousHints?.join(', ') || 'None'}
User's Mastery Level: ${masteryLevel}%

Provide 3-4 progressive hints:
1. Gentle nudge (conceptual direction)
2. More specific guidance (methodology)
3. Detailed approach (step-by-step)
4. Near-solution hint (if needed)

Each hint should build on the previous one without revealing the answer.`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'adaptive_hints_response',
            schema: {
              type: 'object',
              properties: {
                hints: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      level: { type: 'number' },
                      text: { type: 'string' },
                      type: { type: 'string' },
                      revealAmount: { type: 'string' }
                    },
                    required: ['level', 'text', 'type'],
                    additionalProperties: false
                  }
                },
                encouragement: { type: 'string' },
                studyTip: { type: 'string' }
              },
              required: ['hints', 'encouragement'],
              additionalProperties: false
            }
          }
        }
      });

      const hintsResult = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return {
        ...hintsResult,
        questionId: question?.id,
        generatedAt: new Date()?.toISOString(),
        userContext: {
          attemptCount,
          timeSpent,
          masteryLevel
        }
      };
    } catch (error) {
      console.error('Error generating adaptive hints:', error);
      throw new Error('Failed to generate adaptive hints');
    }
  }

  /**
   * Creates a personalized study plan based on learning goals
   * @param {Object} userProfile - User's learning profile and goals
   * @param {Array} availableConcepts - Concepts available for learning
   * @returns {Promise<Object>} Personalized study plan
   */
  async createPersonalizedStudyPlan(userProfile, availableConcepts) {
    try {
      const {
        learningGoals = [],
        availableTime = '1 hour',
        preferredPace = 'moderate',
        currentLevel = 'beginner',
        weakAreas = [],
        strongAreas = []
      } = userProfile;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a personalized learning advisor. Create effective study plans that align with user goals and constraints.`
          },
          {
            role: 'user',
            content: `Create a personalized study plan:

Learning Goals: ${learningGoals?.join(', ')}
Available Time: ${availableTime} per session
Preferred Pace: ${preferredPace}
Current Level: ${currentLevel}
Weak Areas: ${weakAreas?.join(', ')}
Strong Areas: ${strongAreas?.join(', ')}
Available Concepts: ${availableConcepts?.map(c => c?.name)?.join(', ')}

Design a plan with:
1. Daily learning sessions
2. Weekly milestones
3. Progress checkpoints
4. Review schedules
5. Motivation strategies
6. Adaptive adjustments`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'study_plan_response',
            schema: {
              type: 'object',
              properties: {
                planOverview: { type: 'string' },
                dailySessions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      day: { type: 'number' },
                      concepts: { type: 'array', items: { type: 'string' } },
                      activities: { type: 'array', items: { type: 'string' } },
                      duration: { type: 'string' },
                      goals: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['day', 'concepts', 'activities', 'duration'],
                    additionalProperties: false
                  }
                },
                weeklyMilestones: { type: 'array', items: { type: 'string' } },
                progressCheckpoints: { type: 'array', items: { type: 'string' } },
                reviewSchedule: { type: 'string' },
                motivationStrategies: { type: 'array', items: { type: 'string' } },
                adaptationTriggers: { type: 'array', items: { type: 'string' } }
              },
              required: ['planOverview', 'dailySessions', 'weeklyMilestones'],
              additionalProperties: false
            }
          }
        }
      });

      const planResult = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return {
        ...planResult,
        createdAt: new Date()?.toISOString(),
        userProfile,
        totalConcepts: availableConcepts?.length,
        estimatedCompletionTime: this.calculateCompletionTime(planResult?.dailySessions),
        nextReviewDate: this.calculateNextReviewDate()
      };
    } catch (error) {
      console.error('Error creating study plan:', error);
      throw new Error('Failed to create personalized study plan');
    }
  }

  /**
   * Calculates estimated completion time for study plan
   * @param {Array} dailySessions - Array of daily study sessions
   * @returns {string} Estimated completion time
   */
  calculateCompletionTime(dailySessions) {
    if (!dailySessions?.length) return '0 days';
    
    const totalDays = dailySessions?.length;
    const weeks = Math.ceil(totalDays / 7);
    
    if (weeks === 1) return `${totalDays} days`;
    return `${weeks} weeks`;
  }

  /**
   * Calculates next review date
   * @returns {string} ISO date string for next review
   */
  calculateNextReviewDate() {
    const nextReview = new Date();
    nextReview?.setDate(nextReview?.getDate() + 7); // Review weekly
    return nextReview?.toISOString();
  }
}

export default new AdaptiveLearningService();