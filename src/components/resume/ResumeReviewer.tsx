import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MessageSquare, CheckCircle, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';

interface ReviewFeedback {
  category: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  suggestion?: string;
  score?: number;
}

interface ReviewResult {
  overallScore: number;
  feedback: ReviewFeedback[];
  summary: string;
  strengths: string[];
  improvements: string[];
}

export default function ResumeReviewer() {
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const { resumeData } = useResume();

  const analyzeResume = async () => {
    setLoading(true);
    try {
      // Simulate AI analysis (in real app, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const feedback: ReviewFeedback[] = [];
      const strengths: string[] = [];
      const improvements: string[] = [];
      let score = 0;
      let maxScore = 0;

      // Analyze personal information
      if (resumeData.personalInfo.fullName && resumeData.personalInfo.jobTitle) {
        feedback.push({
          category: 'Personal Information',
          type: 'success',
          message: 'Name and job title are properly filled',
          score: 10
        });
        strengths.push('Clear personal information');
        score += 10;
      } else {
        feedback.push({
          category: 'Personal Information',
          type: 'error',
          message: 'Missing name or job title',
          suggestion: 'Add your full name and current/desired job title'
        });
        improvements.push('Complete personal information section');
      }
      maxScore += 10;

      // Analyze summary
      if (resumeData.personalInfo.summary && resumeData.personalInfo.summary.length > 50) {
        feedback.push({
          category: 'Professional Summary',
          type: 'success',
          message: 'Good professional summary length',
          score: 15
        });
        strengths.push('Comprehensive professional summary');
        score += 15;
      } else if (resumeData.personalInfo.summary && resumeData.personalInfo.summary.length < 50) {
        feedback.push({
          category: 'Professional Summary',
          type: 'warning',
          message: 'Summary is too brief',
          suggestion: 'Expand your summary to 2-3 sentences highlighting key achievements'
        });
        improvements.push('Expand professional summary');
        score += 8;
      } else {
        feedback.push({
          category: 'Professional Summary',
          type: 'error',
          message: 'No professional summary found',
          suggestion: 'Add a compelling 2-3 sentence summary of your professional background'
        });
        improvements.push('Add professional summary');
      }
      maxScore += 15;

      // Analyze experience
      if (resumeData.experiences.length > 0) {
        const hasDescriptions = resumeData.experiences.every(exp => exp.description && exp.description.length > 20);
        if (hasDescriptions) {
          feedback.push({
            category: 'Work Experience',
            type: 'success',
            message: 'All experience entries have detailed descriptions',
            score: 25
          });
          strengths.push('Detailed work experience descriptions');
          score += 25;
        } else {
          feedback.push({
            category: 'Work Experience',
            type: 'warning',
            message: 'Some experience entries lack detailed descriptions',
            suggestion: 'Add specific achievements and responsibilities for each role'
          });
          improvements.push('Add more details to work experience');
          score += 15;
        }
        
        if (resumeData.experiences.length >= 2) {
          strengths.push('Multiple work experiences listed');
        } else {
          improvements.push('Consider adding more work experience');
        }
      } else {
        feedback.push({
          category: 'Work Experience',
          type: 'error',
          message: 'No work experience listed',
          suggestion: 'Add your relevant work experience with dates and descriptions'
        });
        improvements.push('Add work experience section');
      }
      maxScore += 25;

      // Analyze education
      if (resumeData.education.length > 0) {
        feedback.push({
          category: 'Education',
          type: 'success',
          message: 'Education information is included',
          score: 15
        });
        strengths.push('Education section completed');
        score += 15;
      } else {
        feedback.push({
          category: 'Education',
          type: 'warning',
          message: 'No education information found',
          suggestion: 'Add your educational background and qualifications'
        });
        improvements.push('Add education information');
      }
      maxScore += 15;

      // Analyze skills
      if (resumeData.skills.length > 0) {
        if (resumeData.skills.length >= 5) {
          feedback.push({
            category: 'Skills',
            type: 'success',
            message: 'Good variety of skills listed',
            score: 15
          });
          strengths.push('Comprehensive skill set');
          score += 15;
        } else {
          feedback.push({
            category: 'Skills',
            type: 'info',
            message: 'Consider adding more skills',
            suggestion: 'Add 5-10 relevant skills to showcase your abilities'
          });
          improvements.push('Add more relevant skills');
          score += 10;
        }
      } else {
        feedback.push({
          category: 'Skills',
          type: 'error',
          message: 'No skills listed',
          suggestion: 'Add relevant skills for your target role'
        });
        improvements.push('Add skills section');
      }
      maxScore += 15;

      // Analyze projects
      if (resumeData.projects.length > 0) {
        feedback.push({
          category: 'Projects',
          type: 'success',
          message: 'Projects section enhances your profile',
          score: 10
        });
        strengths.push('Projects showcase practical experience');
        score += 10;
      } else {
        feedback.push({
          category: 'Projects',
          type: 'info',
          message: 'Consider adding projects to showcase your work',
          suggestion: 'Add personal or professional projects that demonstrate your skills'
        });
        improvements.push('Add projects section');
      }
      maxScore += 10;

      // Calculate overall score
      const overallScore = Math.round((score / maxScore) * 100);

      // Generate summary
      let summary = '';
      if (overallScore >= 80) {
        summary = 'Excellent resume! Your resume is well-structured and comprehensive.';
      } else if (overallScore >= 60) {
        summary = 'Good resume with room for improvement. Focus on the suggested areas to make it stronger.';
      } else if (overallScore >= 40) {
        summary = 'Your resume needs significant improvements. Consider adding more details and completing missing sections.';
      } else {
        summary = 'Your resume requires substantial work. Start by completing the essential sections like personal info, experience, and education.';
      }

      setReviewResult({
        overallScore,
        feedback,
        summary,
        strengths,
        improvements
      });

      toast.success('Resume analysis completed!');
    } catch (error) {
      console.error('Resume analysis error:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Requires Improvement';
  };

  const getIcon = (type: ReviewFeedback['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'info': return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Resume Reviewer
          </CardTitle>
          <CardDescription>
            Get AI-powered feedback on your resume to improve your chances of landing your dream job
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={analyzeResume} 
              disabled={loading}
              className="gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </div>

          {customPrompt && (
            <Alert>
              <AlertDescription>
                <strong>Custom Analysis:</strong> {customPrompt}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {reviewResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Overall Score
                <div className={`text-3xl font-bold ${getScoreColor(reviewResult.overallScore)}`}>
                  {reviewResult.overallScore}%
                </div>
              </CardTitle>
              <CardDescription>
                <Badge variant={reviewResult.overallScore >= 60 ? 'default' : 'destructive'}>
                  {getScoreLabel(reviewResult.overallScore)}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{reviewResult.summary}</p>
            </CardContent>
          </Card>

          {/* Strengths */}
          {reviewResult.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {reviewResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Areas for Improvement */}
          {reviewResult.improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <TrendingUp className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {reviewResult.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Detailed Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewResult.feedback.map((item, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      {getIcon(item.type)}
                      <span className="font-medium">{item.category}</span>
                      {item.score && (
                        <Badge variant="outline">+{item.score} points</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.message}</p>
                    {item.suggestion && (
                      <p className="text-sm text-blue-600">
                        💡 {item.suggestion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
