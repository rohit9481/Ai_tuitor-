import openai from './openaiClient';

/**
 * Question Generation Service
 * Generates adaptive questions based on extracted concepts
 */
class QuestionGenerationService {
  /**
   * Generates questions for a specific concept
   * @param {Object} concept - Concept to generate questions for
   * @param {Object} options - Generation options
   * @returns {Promise<Array>} Generated questions
   */
  async generateQuestionsForConcept(concept, options = {}) {
    const {
      questionCount = 5,
      questionTypes = ['multiple_choice', 'true_false', 'short_answer'],
      difficultyLevel = concept?.difficulty,
      includeExplanations = true
    } = options;

    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational question generator. Create adaptive assessment questions that test understanding and identify knowledge gaps.`
          },
          {
            role: 'user',
            content: `Generate ${questionCount} educational questions for this concept:

Concept: ${concept?.name}
Description: ${concept?.description}
Difficulty: ${difficultyLevel}
Key Principles: ${concept?.keyPrinciples?.join(', ') || 'N/A'}
Examples: ${concept?.examples?.join(', ') || 'N/A'}
Common Misconceptions: ${concept?.misconceptions?.join(', ') || 'N/A'}

Question Types to Include: ${questionTypes?.join(', ')}

For each question:
1. Create clear, unambiguous questions
2. Include context when needed
3. For multiple choice: 4 options with explanations
4. For true/false: Include reasoning
5. For short answer: Provide sample correct answers
6. Include difficulty rating
7. Map to specific learning objectives`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'questions_generation_response',
            schema: {
              type: 'object',
              properties: {
                questions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string' },
                      difficulty: { type: 'string' },
                      question: { type: 'string' },
                      context: { type: 'string' },
                      options: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            text: { type: 'string' },
                            explanation: { type: 'string' }
                          },
                          required: ['id', 'text'],
                          additionalProperties: false
                        }
                      },
                      correctAnswer: { type: 'string' },
                      sampleAnswers: { type: 'array', items: { type: 'string' } },
                      explanation: { type: 'string' },
                      learningObjective: { type: 'string' },
                      bloomsLevel: { type: 'string' },
                      estimatedTime: { type: 'string' }
                    },
                    required: ['id', 'type', 'difficulty', 'question', 'correctAnswer'],
                    additionalProperties: false
                  }
                }
              },
              required: ['questions'],
              additionalProperties: false
            }
          }
        }
      });

      const generationResult = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return generationResult?.questions?.map((question, index) => ({
        ...question,
        id: question?.id || `${concept?.id}_q${index + 1}`,
        conceptId: concept?.id,
        conceptName: concept?.name,
        number: index + 1,
        createdAt: new Date()?.toISOString(),
        attempts: 0,
        correctAttempts: 0,
        lastAttempted: null,
        userAnswer: null,
        isCorrect: null,
        timeSpent: 0,
        hintsUsed: 0
      }));
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions for concept');
    }
  }

  /**
   * Generates adaptive questions based on user performance
   * @param {Array} concepts - Available concepts
   * @param {Object} userPerformance - User's performance data
   * @returns {Promise<Array>} Adaptive question set
   */
  async generateAdaptiveQuestions(concepts, userPerformance = {}) {
    try {
      // Identify weak areas from performance
      const weakConcepts = this.identifyWeakAreas(concepts, userPerformance);
      const strongConcepts = this.identifyStrongAreas(concepts, userPerformance);
      
      // Generate more questions for weak areas
      const questionPromises = [];
      
      // 60% questions from weak areas
      for (const concept of weakConcepts?.slice(0, 3)) {
        questionPromises?.push(
          this.generateQuestionsForConcept(concept, {
            questionCount: 3,
            difficultyLevel: this.adjustDifficultyForPerformance(concept, userPerformance)
          })
        );
      }
      
      // 30% questions from mixed difficulty
      for (const concept of concepts?.slice(0, 2)) {
        if (!weakConcepts?.includes(concept)) {
          questionPromises?.push(
            this.generateQuestionsForConcept(concept, {
              questionCount: 2,
              questionTypes: ['multiple_choice', 'short_answer']
            })
          );
        }
      }
      
      // 10% challenging questions from strong areas
      if (strongConcepts?.length > 0) {
        questionPromises?.push(
          this.generateQuestionsForConcept(strongConcepts?.[0], {
            questionCount: 1,
            difficultyLevel: 'Advanced'
          })
        );
      }

      const questionSets = await Promise.all(questionPromises);
      const allQuestions = questionSets?.flat();
      
      // Shuffle and return
      return this.shuffleQuestions(allQuestions);
    } catch (error) {
      console.error('Error generating adaptive questions:', error);
      throw new Error('Failed to generate adaptive questions');
    }
  }

  /**
   * Evaluates user's answer and provides feedback
   * @param {Object} question - The question object
   * @param {string} userAnswer - User's answer
   * @returns {Promise<Object>} Evaluation result with feedback
   */
  async evaluateAnswer(question, userAnswer) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational evaluator. Assess the user's answer and provide constructive feedback.`
          },
          {
            role: 'user',
            content: `Evaluate this answer:

Question: ${question?.question}
Question Type: ${question?.type}
Correct Answer: ${question?.correctAnswer}
User Answer: ${userAnswer}
Context: ${question?.context || 'N/A'}

Provide:
1. Whether the answer is correct
2. Score (0-100)
3. Detailed feedback
4. Areas for improvement
5. Hints for better understanding`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'answer_evaluation_response',
            schema: {
              type: 'object',
              properties: {
                isCorrect: { type: 'boolean' },
                score: { type: 'number' },
                feedback: { type: 'string' },
                explanation: { type: 'string' },
                areasForImprovement: { type: 'array', items: { type: 'string' } },
                hints: { type: 'array', items: { type: 'string' } },
                nextSteps: { type: 'string' }
              },
              required: ['isCorrect', 'score', 'feedback', 'explanation'],
              additionalProperties: false
            }
          }
        }
      });

      const evaluationResult = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return {
        ...evaluationResult,
        questionId: question?.id,
        conceptId: question?.conceptId,
        evaluatedAt: new Date()?.toISOString(),
        userAnswer,
        timeTaken: 0 // To be updated by calling component
      };
    } catch (error) {
      console.error('Error evaluating answer:', error);
      throw new Error('Failed to evaluate answer');
    }
  }

  /**
   * Identifies weak areas based on user performance
   * @param {Array} concepts - All concepts
   * @param {Object} userPerformance - User performance data
   * @returns {Array} Concepts that need more focus
   */
  identifyWeakAreas(concepts, userPerformance) {
    return concepts?.filter(concept => {
      const performance = userPerformance?.[concept?.id] || { masteryLevel: 0, attempts: 0 };
      return performance.masteryLevel < 70 || performance.attempts === 0;
    })?.sort((a, b) => {
      const perfA = userPerformance?.[a?.id] || { masteryLevel: 0 };
      const perfB = userPerformance?.[b?.id] || { masteryLevel: 0 };
      return perfA?.masteryLevel - perfB?.masteryLevel;
    });
  }

  /**
   * Identifies strong areas based on user performance
   * @param {Array} concepts - All concepts
   * @param {Object} userPerformance - User performance data
   * @returns {Array} Concepts user is strong in
   */
  identifyStrongAreas(concepts, userPerformance) {
    return concepts?.filter(concept => {
      const performance = userPerformance?.[concept?.id] || { masteryLevel: 0 };
      return performance.masteryLevel >= 80;
    })?.sort((a, b) => {
      const perfA = userPerformance?.[a?.id] || { masteryLevel: 0 };
      const perfB = userPerformance?.[b?.id] || { masteryLevel: 0 };
      return perfB?.masteryLevel - perfA?.masteryLevel;
    });
  }

  /**
   * Adjusts question difficulty based on user performance
   * @param {Object} concept - The concept
   * @param {Object} userPerformance - User performance data
   * @returns {string} Adjusted difficulty level
   */
  adjustDifficultyForPerformance(concept, userPerformance) {
    const performance = userPerformance?.[concept?.id] || { masteryLevel: 0, attempts: 0 };
    
    if (performance.masteryLevel < 40) {
      return 'Beginner';
    } else if (performance.masteryLevel < 70) {
      return 'Intermediate';
    } else {
      return 'Advanced';
    }
  }

  /**
   * Shuffles questions array
   * @param {Array} questions - Questions to shuffle
   * @returns {Array} Shuffled questions
   */
  shuffleQuestions(questions) {
    const shuffled = [...questions];
    for (let i = shuffled?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled?.[j], shuffled?.[i]];
    }
    return shuffled?.map((question, index) => ({
      ...question,
      number: index + 1
    }));
  }
}

export default new QuestionGenerationService();