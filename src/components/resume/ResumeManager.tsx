import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useResume } from '@/contexts/ResumeContext';
import { useAuth } from '@/contexts/AuthContext';
import { resumeService, type SavedResume } from '@/services';
import { format } from 'date-fns';
import { Copy, Download, Eye, Trash2, Save, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function ResumeManager() {
  const { user } = useAuth();
  const { resumeData, selectedTemplate, setResumeData, setSelectedTemplate } = useResume();
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');

  useEffect(() => {
    if (user) {
      loadResumes();
    }
  }, [user]);

  const loadResumes = async () => {
    try {
      const resumes = await resumeService.getUserResumes();
      setSavedResumes(resumes);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      toast.error('Failed to load resumes');
    }
  };

  const saveResume = async () => {
    if (!user) {
      toast.error('Please sign in to save your resume');
      return;
    }

    if (!resumeTitle.trim()) {
      toast.error('Please enter a title for your resume');
      return;
    }

    setLoading(true);
    try {
      await resumeService.createResume({
        title: resumeTitle,
        resume_data: resumeData,
        template_config: selectedTemplate,
      });
      
      toast.success('Resume saved successfully!');
      setSaveDialogOpen(false);
      setResumeTitle('');
      loadResumes();
    } catch (error) {
      console.error('Failed to save resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async (resume: SavedResume) => {
    try {
      setResumeData(resume.resume_data);
      setSelectedTemplate(resume.template_config);
      toast.success('Resume loaded successfully!');
    } catch (error) {
      console.error('Failed to load resume:', error);
      toast.error('Failed to load resume');
    }
  };

  const duplicateResume = async (resume: SavedResume) => {
    try {
      await resumeService.duplicateResume(resume.id);
      toast.success('Resume duplicated successfully!');
      loadResumes();
    } catch (error) {
      console.error('Failed to duplicate resume:', error);
      toast.error('Failed to duplicate resume');
    }
  };

  const deleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeService.deleteResume(resumeId);
      toast.success('Resume deleted successfully!');
      loadResumes();
    } catch (error) {
      console.error('Failed to delete resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            My Resumes
          </CardTitle>
          <CardDescription>
            Sign in to save and manage your resumes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please sign in to access your saved resumes.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Resumes</h3>
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Save Current
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Resume</DialogTitle>
              <DialogDescription>
                Give your resume a title to save it for later
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resume Title</Label>
                <Input
                  id="title"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g., Software Developer Resume"
                />
              </div>
              <Button onClick={saveResume} disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Resume'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {savedResumes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No saved resumes yet</p>
              <p className="text-sm">Create and save your first resume to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedResumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{resume.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Template: {resume.template_config.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {format(new Date(resume.updated_at), 'MMM d, yyyy')}
                    </p>
                    {resume.is_public && (
                      <Badge variant="secondary" className="mt-2">
                        Public
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadResume(resume)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Load
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateResume(resume)}
                      className="gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteResume(resume.id)}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
