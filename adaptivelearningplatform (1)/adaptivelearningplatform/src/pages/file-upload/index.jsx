import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import AppIcon from '../../components/AppIcon';
import fileAnalysisService from '../../services/fileAnalysisService';
import conceptExtractionService from '../../services/conceptExtractionService';

const FileUpload = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  // Handle file drag and drop
  const handleDrag = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileSelection(e?.dataTransfer?.files?.[0]);
    }
  }, []);

  const handleFileInputChange = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileSelection(e?.target?.files?.[0]);
    }
  };

  const handleFileSelection = (file) => {
    const validation = fileAnalysisService?.validateFile(file);
    
    if (!validation?.isValid) {
      setError(validation?.error);
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');
    
    try {
      // Step 1: Analyze file
      setProcessingStep('Analyzing file content...');
      const analysisResult = await fileAnalysisService?.analyzeFile(selectedFile);
      
      // Step 2: Extract concepts
      setProcessingStep('Extracting learning concepts...');
      const concepts = await conceptExtractionService?.extractConcepts(analysisResult);
      
      // Step 3: Create learning pathway
      setProcessingStep('Creating personalized learning path...');
      const learningPathway = conceptExtractionService?.createLearningPathway(concepts);
      
      setAnalysisResult({
        ...analysisResult,
        concepts,
        learningPathway
      });
      
      setProcessingStep('Complete! Redirecting to assessment...');
      
      // Store data in sessionStorage for access across components
      sessionStorage.setItem('fileAnalysis', JSON.stringify(analysisResult));
      sessionStorage.setItem('extractedConcepts', JSON.stringify(concepts));
      sessionStorage.setItem('learningPathway', JSON.stringify(learningPathway));
      
      // Navigate to question generation after brief delay
      setTimeout(() => {
        navigate('/question-generation-assessment', {
          state: {
            analysisResult,
            concepts,
            learningPathway
          }
        });
      }, 1500);

    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process file. Please try again.');
      setProcessingStep('');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setError('');
    setAnalysisResult(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            Upload Your Learning Material
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your documents and let our AI analyze the content to create personalized questions and adaptive learning experiences tailored to your needs.
          </p>
        </div>

        {/* File Upload Area */}
        <div className="bg-card rounded-lg border-2 border-dashed border-border p-8 mb-6">
          {!selectedFile ? (
            <div
              className={`text-center transition-all duration-200 ${
                dragActive ? 'border-primary bg-primary/5' : ''
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <AppIcon 
                  name="Upload" 
                  size={48} 
                  className="mx-auto text-muted-foreground mb-4" 
                />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  Drop your files here
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click to browse from your computer
                </p>
              </div>
              
              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="mx-auto"
                >
                  <AppIcon name="FolderOpen" size={20} className="mr-2" />
                  Choose File
                </Button>
                
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".txt,.md,.json,.csv,.pdf"
                  onChange={handleFileInputChange}
                />
              </div>
              
              <div className="mt-6 text-xs text-muted-foreground">
                Supported formats: TXT, PDF, JSON, CSV, Markdown (Max 10MB)
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected File Info */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <AppIcon name="File" size={24} className="text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{selectedFile?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile?.size)} • {selectedFile?.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeSelectedFile}
                  disabled={isProcessing}
                >
                  <AppIcon name="X" size={16} />
                </Button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 justify-center">
                <Button
                  variant="outline"
                  onClick={removeSelectedFile}
                  disabled={isProcessing}
                >
                  Choose Different File
                </Button>
                <Button
                  onClick={handleFileUpload}
                  disabled={isProcessing}
                  className="min-w-[200px]"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <AppIcon name="Play" size={16} className="mr-2" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
              <div>
                <h4 className="font-medium text-foreground">Processing Your File</h4>
                <p className="text-sm text-muted-foreground">{processingStep}</p>
              </div>
            </div>
            
            <div className="mt-4 bg-background rounded-full h-2">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-500"
                style={{ 
                  width: processingStep?.includes('Analyzing') ? '33%' : 
                         processingStep?.includes('Extracting') ? '66%' : 
                         processingStep?.includes('Creating') ? '90%' : '100%' 
                }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AppIcon name="AlertCircle" size={20} className="text-destructive" />
              <p className="text-destructive font-medium">Error</p>
            </div>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        )}

        {/* Analysis Preview */}
        {analysisResult && (
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
              Analysis Complete
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Subject</h4>
                <p className="text-muted-foreground">{analysisResult?.subject}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Topic</h4>
                <p className="text-muted-foreground">{analysisResult?.topic}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Difficulty</h4>
                <p className="text-muted-foreground">{analysisResult?.difficulty}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Study Time</h4>
                <p className="text-muted-foreground">{analysisResult?.estimatedTime}</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-foreground mb-2">Key Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult?.keyConcepts?.slice(0, 5)?.map((concept, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <AppIcon name="Upload" size={24} className="text-primary-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">1. Upload</h4>
              <p className="text-sm text-muted-foreground">
                Upload your learning materials in supported formats
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <AppIcon name="Zap" size={24} className="text-primary-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">2. Analyze</h4>
              <p className="text-sm text-muted-foreground">
                AI analyzes content and extracts key concepts automatically
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <AppIcon name="Target" size={24} className="text-primary-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">3. Learn</h4>
              <p className="text-sm text-muted-foreground">
                Get personalized questions and adaptive explanations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;