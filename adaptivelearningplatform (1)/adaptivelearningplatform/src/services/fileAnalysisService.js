import openai from './openaiClient';

/**
 * File Analysis Service
 * Handles file upload, processing, and content extraction using OpenAI
 */
class FileAnalysisService {
  /**
   * Analyzes uploaded file content and extracts key information
   * @param {File} file - The uploaded file
   * @returns {Promise<Object>} Analysis results with content and metadata
   */
  async analyzeFile(file) {
    try {
      const fileContent = await this.extractFileContent(file);
      
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI educational content analyzer. Analyze the provided content and extract key information for adaptive learning purposes.`
          },
          {
            role: 'user',
            content: `Analyze this educational content and provide structured information:

Content: ${fileContent}

Please provide:
1. Subject area and topic
2. Difficulty level (Beginner/Intermediate/Advanced)
3. Key concepts covered
4. Learning objectives
5. Prerequisites (if any)
6. Estimated study time`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'file_analysis_response',
            schema: {
              type: 'object',
              properties: {
                subject: { type: 'string' },
                topic: { type: 'string' },
                difficulty: { type: 'string' },
                keyConcepts: { type: 'array', items: { type: 'string' } },
                learningObjectives: { type: 'array', items: { type: 'string' } },
                prerequisites: { type: 'array', items: { type: 'string' } },
                estimatedTime: { type: 'string' },
                summary: { type: 'string' }
              },
              required: ['subject', 'topic', 'difficulty', 'keyConcepts', 'learningObjectives', 'estimatedTime', 'summary'],
              additionalProperties: false
            }
          }
        }
      });

      const analysisResult = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return {
        ...analysisResult,
        fileInfo: {
          name: file?.name,
          size: file?.size,
          type: file?.type,
          lastModified: file?.lastModified
        },
        rawContent: fileContent,
        analyzedAt: new Date()?.toISOString()
      };
    } catch (error) {
      console.error('Error analyzing file:', error);
      throw new Error('Failed to analyze file content');
    }
  }

  /**
   * Extracts text content from various file types
   * @param {File} file - The file to extract content from
   * @returns {Promise<string>} Extracted text content
   */
  async extractFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          let content = '';
          
          if (file.type.includes('text/')) {
            content = event.target.result;
          } else if (file.type.includes('application/json')) {
            const jsonData = JSON.parse(event.target.result);
            content = JSON.stringify(jsonData, null, 2);
          } else {
            // For other file types, attempt to read as text
            content = event.target.result;
          }
          
          resolve(content);
        } catch (error) {
          reject(new Error('Failed to extract file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Validates file before processing
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'text/plain',
      'text/markdown',
      'application/json',
      'text/csv',
      'application/pdf' // Note: PDF requires additional processing
    ];

    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (file?.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }

    if (!allowedTypes?.some(type => file?.type?.includes(type?.split('/')?.[0]))) {
      return { isValid: false, error: 'Unsupported file type' };
    }

    return { isValid: true };
  }
}

export default new FileAnalysisService();