import openai from './openaiClient';

/**
 * Concept Extraction Service
 * Extracts detailed concepts from analyzed content for adaptive learning
 */
class ConceptExtractionService {
  /**
   * Extracts detailed concepts from file analysis results
   * @param {Object} analysisData - Results from file analysis
   * @returns {Promise<Array>} Array of extracted concepts with details
   */
  async extractConcepts(analysisData) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content curator. Extract comprehensive concepts from the analyzed content to create an adaptive learning experience.`
          },
          {
            role: 'user',
            content: `Based on this content analysis, extract detailed concepts for adaptive learning:

Subject: ${analysisData?.subject}
Topic: ${analysisData?.topic}
Key Concepts: ${analysisData?.keyConcepts?.join(', ')}
Learning Objectives: ${analysisData?.learningObjectives?.join(', ')}
Content Summary: ${analysisData?.summary}

For each concept, provide:
1. Concept name and description
2. Difficulty level
3. Prerequisites
4. Sub-concepts
5. Real-world examples
6. Common misconceptions
7. Key formulas or principles (if applicable)`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'concepts_extraction_response',
            schema: {
              type: 'object',
              properties: {
                concepts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      difficulty: { type: 'string' },
                      prerequisites: { type: 'array', items: { type: 'string' } },
                      subConcepts: { type: 'array', items: { type: 'string' } },
                      examples: { type: 'array', items: { type: 'string' } },
                      misconceptions: { type: 'array', items: { type: 'string' } },
                      keyPrinciples: { type: 'array', items: { type: 'string' } },
                      estimatedTime: { type: 'string' },
                      bloomsLevel: { type: 'string' }
                    },
                    required: ['id', 'name', 'description', 'difficulty', 'estimatedTime'],
                    additionalProperties: false
                  }
                }
              },
              required: ['concepts'],
              additionalProperties: false
            }
          }
        }
      });

      const extractionResult = JSON.parse(response?.choices?.[0]?.message?.content);
      
      // Add metadata to each concept
      return extractionResult?.concepts?.map((concept, index) => ({
        ...concept,
        id: concept?.id || `concept_${index + 1}`,
        extractedAt: new Date()?.toISOString(),
        sourceSubject: analysisData?.subject,
        sourceTopic: analysisData?.topic,
        masteryLevel: 0, // Initial mastery level
        attempts: 0,
        correctAnswers: 0
      }));
    } catch (error) {
      console.error('Error extracting concepts:', error);
      throw new Error('Failed to extract concepts from content');
    }
  }

  /**
   * Creates a learning pathway based on extracted concepts
   * @param {Array} concepts - Array of extracted concepts
   * @returns {Object} Structured learning pathway
   */
  createLearningPathway(concepts) {
    if (!concepts?.length) {
      return { pathway: [], totalEstimatedTime: '0 min' };
    }

    // Sort concepts by difficulty and prerequisites
    const sortedConcepts = this.sortConceptsByDependency(concepts);
    
    // Calculate total estimated time
    const totalMinutes = sortedConcepts?.reduce((total, concept) => {
      const time = this.parseTimeToMinutes(concept?.estimatedTime);
      return total + time;
    }, 0);

    const totalEstimatedTime = this.formatMinutesToTime(totalMinutes);

    return {
      pathway: sortedConcepts?.map((concept, index) => ({
        ...concept,
        order: index + 1,
        isUnlocked: index === 0, // Only first concept is initially unlocked
        dependencies: this.findDependencies(concept, sortedConcepts)
      })),
      totalEstimatedTime,
      totalConcepts: sortedConcepts?.length,
      difficultyDistribution: this.calculateDifficultyDistribution(sortedConcepts)
    };
  }

  /**
   * Sorts concepts based on dependencies and difficulty
   * @param {Array} concepts - Array of concepts to sort
   * @returns {Array} Sorted concepts array
   */
  sortConceptsByDependency(concepts) {
    const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    
    return concepts?.sort((a, b) => {
      const diffA = difficultyOrder?.[a?.difficulty] || 2;
      const diffB = difficultyOrder?.[b?.difficulty] || 2;
      
      if (diffA !== diffB) {
        return diffA - diffB;
      }
      
      // If same difficulty, sort by prerequisites count
      const prereqA = a?.prerequisites?.length || 0;
      const prereqB = b?.prerequisites?.length || 0;
      return prereqA - prereqB;
    });
  }

  /**
   * Finds dependencies between concepts
   * @param {Object} concept - Current concept
   * @param {Array} allConcepts - All concepts
   * @returns {Array} Array of dependency concept IDs
   */
  findDependencies(concept, allConcepts) {
    if (!concept?.prerequisites?.length) {
      return [];
    }

    return allConcepts?.filter(otherConcept => 
        otherConcept?.id !== concept?.id &&
        concept?.prerequisites?.some(prereq =>
          otherConcept?.name?.toLowerCase()?.includes(prereq?.toLowerCase()) ||
          otherConcept?.subConcepts?.some(sub =>
            sub?.toLowerCase()?.includes(prereq?.toLowerCase())
          )
        )
      )?.map(dep => dep?.id);
  }

  /**
   * Parses time string to minutes
   * @param {string} timeString - Time string (e.g., "15 min", "1 hour")
   * @returns {number} Time in minutes
   */
  parseTimeToMinutes(timeString) {
    if (!timeString) return 15; // Default 15 minutes
    
    const match = timeString?.match(/(\d+)\s*(min|hour|hr)/i);
    if (!match) return 15;
    
    const value = parseInt(match?.[1]);
    const unit = match?.[2]?.toLowerCase();
    
    return unit?.includes('hour') || unit?.includes('hr') ? value * 60 : value;
  }

  /**
   * Formats minutes to readable time string
   * @param {number} minutes - Time in minutes
   * @returns {string} Formatted time string
   */
  formatMinutesToTime(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  }

  /**
   * Calculates difficulty distribution of concepts
   * @param {Array} concepts - Array of concepts
   * @returns {Object} Difficulty distribution
   */
  calculateDifficultyDistribution(concepts) {
    const distribution = { Beginner: 0, Intermediate: 0, Advanced: 0 };
    
    concepts?.forEach(concept => {
      if (distribution?.hasOwnProperty(concept?.difficulty)) {
        distribution[concept.difficulty]++;
      }
    });

    return distribution;
  }
}

export default new ConceptExtractionService();