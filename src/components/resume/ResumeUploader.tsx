import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';

interface ParsedResume {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experiences: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: Array<{
    category: string;
    name: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
}

export default function ResumeUploader() {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setResumeData } = useResume();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt') && !file.name.endsWith('.docx')) {
        toast.error('Please upload a text file (.txt) or Word document (.docx)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const parseResume = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    try {
      const text = await readFileContent(uploadedFile);
      
      // Simulate AI parsing (in real app, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const parsed = simulateResumeParsing(text);
      setParsedResume(parsed);
      
      // Calculate ATS score
      const score = calculateATSScore(parsed);
      setAtsScore(score);
      
      toast.success('Resume parsed successfully!');
    } catch (error) {
      console.error('Resume parsing error:', error);
      toast.error('Failed to parse resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const simulateResumeParsing = (text: string): ParsedResume => {
    // Simple parsing simulation - in real app, use AI/NLP
    const lines = text.split('\n').filter(line => line.trim());
    
    const parsed: ParsedResume = {
      personalInfo: {
        fullName: extractValue(lines, ['name', 'full name']) || 'John Doe',
        jobTitle: extractValue(lines, ['title', 'position', 'job title']) || 'Software Engineer',
        email: extractValue(lines, ['email', 'e-mail']) || 'john@example.com',
        phone: extractValue(lines, ['phone', 'mobile']) || '+1-234-567-8900',
        location: extractValue(lines, ['location', 'address']) || 'San Francisco, CA',
        summary: extractValue(lines, ['summary', 'objective', 'profile']) || 'Experienced professional with a proven track record...'
      },
      experiences: [{
        position: extractValue(lines, ['senior software engineer', 'software engineer']) || 'Software Engineer',
        company: extractValue(lines, ['tech corp', 'company']) || 'Tech Company',
        startDate: '2020-01',
        endDate: '2023-12',
        current: false,
        location: 'San Francisco, CA',
        description: extractValue(lines, ['developed', 'implemented', 'managed']) || 'Responsible for developing and maintaining software applications...'
      }],
      education: [{
        degree: extractValue(lines, ['bachelor', 'master', 'degree']) || 'Bachelor of Science',
        field: extractValue(lines, ['computer science', 'engineering']) || 'Computer Science',
        institution: extractValue(lines, ['university', 'college']) || 'University Name',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8'
      }],
      skills: [
        { category: 'Technical', name: 'JavaScript' },
        { category: 'Technical', name: 'React' },
        { category: 'Technical', name: 'Node.js' },
        { category: 'Technical', name: 'Python' },
        { category: 'Soft Skills', name: 'Communication' },
        { category: 'Soft Skills', name: 'Leadership' }
      ],
      projects: [{
        name: extractValue(lines, ['project', 'application']) || 'E-commerce Platform',
        description: extractValue(lines, ['built', 'created']) || 'Developed a full-stack e-commerce platform...',
        technologies: 'React, Node.js, MongoDB'
      }]
    };
    
    return parsed;
  };

  const extractValue = (lines: string[], keywords: string[]): string | null => {
    for (const keyword of keywords) {
      const line = lines.find(line => line.toLowerCase().includes(keyword.toLowerCase()));
      if (line) {
        // Extract value after the keyword
        const match = line.match(new RegExp(`${keyword}[:\\s]*(.+)`, 'i'));
        return match ? match[1].trim() : line.trim();
      }
    }
    return null;
  };

  const calculateATSScore = (parsed: ParsedResume): number => {
    let score = 0;
    const maxScore = 100;

    // Check for essential sections
    if (parsed.personalInfo.fullName) score += 10;
    if (parsed.personalInfo.summary && parsed.personalInfo.summary.length > 50) score += 15;
    if (parsed.experiences.length > 0) score += 25;
    if (parsed.education.length > 0) score += 15;
    if (parsed.skills.length > 0) score += 15;
    if (parsed.projects.length > 0) score += 10;

    // Bonus points for quality
    if (parsed.experiences.some(exp => exp.description.length > 100)) score += 10;
    if (parsed.skills.length >= 5) score += 10;

    return Math.min(score, maxScore);
  };

  const applyToBuilder = () => {
    if (!parsedResume) return;

    const resumeData = {
      personalInfo: {
        fullName: parsedResume.personalInfo.fullName,
        jobTitle: parsedResume.personalInfo.jobTitle,
        email: parsedResume.personalInfo.email,
        phone: parsedResume.personalInfo.phone,
        location: parsedResume.personalInfo.location,
        website: '',
        linkedin: '',
        github: '',
        photoUrl: '',
        summary: parsedResume.personalInfo.summary
      },
      experiences: parsedResume.experiences.map((exp, index) => ({
        ...exp,
        id: `exp-${index}`
      })),
      education: parsedResume.education.map((edu, index) => ({
        id: `edu-${index}`,
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: edu.gpa,
        description: ''
      })),
      skills: parsedResume.skills.map((skill, index) => ({
        ...skill,
        id: `skill-${index}`,
        level: 3
      })),
      projects: parsedResume.projects.map((project, index) => ({
        id: `project-${index}`,
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        url: ''
      })),
      certifications: [],
      languages: [],
      attachments: [],
      hobbies: '',
      references: ''
    };

    setResumeData(resumeData);
    toast.success('Resume data applied to builder!');
  };

  const downloadATSResume = () => {
    if (!parsedResume) return;

    // Create ATS-friendly resume content
    const atsContent = generateATSResume(parsedResume);
    
    // Create and download file
    const blob = new Blob([atsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ats-optimized-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('ATS-optimized resume downloaded!');
  };

  const generateATSResume = (parsed: ParsedResume): string => {
    return `
ATS-OPTIMIZED RESUME
====================

${parsed.personalInfo.fullName}
${parsed.personalInfo.email} | ${parsed.personalInfo.phone} | ${parsed.personalInfo.location}

PROFESSIONAL SUMMARY
-------------------
${parsed.personalInfo.summary}

WORK EXPERIENCE
---------------
${parsed.experiences.map(exp => `
${exp.position} at ${exp.company}
${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.location}
${exp.description}
`).join('\n')}

EDUCATION
----------
${parsed.education.map(edu => `
${edu.degree} in ${edu.field}
${edu.institution}
${edu.startDate} - ${edu.endDate}
${edu.gpa ? `GPA: ${edu.gpa}` : ''}
`).join('\n')}

SKILLS
-------
${parsed.skills.map(skill => `${skill.category}: ${skill.name}`).join('\n')}

PROJECTS
--------
${parsed.projects.map(project => `
${project.name}
${project.description}
Technologies: ${project.technologies}
`).join('\n')}
    `.trim();
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
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Resume Parser & ATS Optimizer
          </CardTitle>
          <CardDescription>
            Upload your existing resume to get an ATS-friendly version and import data into the builder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume-upload">Upload Resume (.txt or .docx)</Label>
            <Input
              id="resume-upload"
              type="file"
              accept=".txt,.docx"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="cursor-pointer"
            />
            {uploadedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          <Button 
            onClick={parseResume} 
            disabled={!uploadedFile || loading}
            className="w-full gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {loading ? 'Parsing...' : 'Parse Resume'}
          </Button>
        </CardContent>
      </Card>

      {/* Parsed Results */}
      {parsedResume && (
        <div className="space-y-6">
          {/* ATS Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                ATS Compatibility Score
                <div className={`text-2xl font-bold ${getScoreColor(atsScore || 0)}`}>
                  {atsScore}%
                </div>
              </CardTitle>
              <CardDescription>
                <Badge variant={atsScore && atsScore >= 60 ? 'default' : 'destructive'}>
                  {atsScore && getScoreLabel(atsScore)}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  {atsScore && atsScore >= 80 
                    ? 'Excellent! Your resume is well-optimized for ATS systems.'
                    : atsScore && atsScore >= 60
                    ? 'Good ATS compatibility. Minor improvements could help.'
                    : 'Your resume needs optimization for better ATS performance.'
                  }
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Parsed Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Parsed Resume Data</CardTitle>
              <CardDescription>
                Review and edit the parsed information before applying to builder
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Info */}
                <div className="space-y-2">
                  <h4 className="font-medium">Personal Information</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Name:</strong> {parsedResume.personalInfo.fullName}</p>
                    <p><strong>Title:</strong> {parsedResume.personalInfo.jobTitle}</p>
                    <p><strong>Email:</strong> {parsedResume.personalInfo.email}</p>
                    <p><strong>Phone:</strong> {parsedResume.personalInfo.phone}</p>
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <h4 className="font-medium">Experience</h4>
                  <div className="text-sm space-y-1">
                    {parsedResume.experiences.map((exp, index) => (
                      <div key={index} className="border-l-2 border-gray-200 pl-2">
                        <p><strong>{exp.position}</strong> at {exp.company}</p>
                        <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="font-medium">Skills</h4>
                  <div className="text-sm">
                    {parsedResume.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h4 className="font-medium">Education</h4>
                  <div className="text-sm space-y-1">
                    {parsedResume.education.map((edu, index) => (
                      <div key={index}>
                        <p><strong>{edu.degree}</strong> in {edu.field}</p>
                        <p className="text-xs text-muted-foreground">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={applyToBuilder} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Apply to Builder
            </Button>
            <Button onClick={downloadATSResume} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download ATS Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
