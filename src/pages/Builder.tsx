import { ResumeProvider } from '@/contexts/ResumeContext';
import FormPanel from '@/components/resume/FormPanel';
import ResumePreview from '@/components/resume/ResumePreview';
import TemplateSelector from '@/components/resume/TemplateSelector';
import PDFDownload from '@/components/resume/PDFDownload';
import SimplePDFDownload from '@/components/resume/SimplePDFDownload';
import ResumeManager from '@/components/resume/ResumeManager';
import ResumeReviewer from '@/components/resume/ResumeReviewer';
import ResumeUploader from '@/components/resume/ResumeUploader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Layout, Eye, FolderOpen, MessageSquare, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function BuilderContent() {
  const [showTemplates, setShowTemplates] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview' | 'resumes' | 'reviewer' | 'uploader'>('form');

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="text-lg font-bold gradient-text">Interactive Resume Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)} className="gap-1.5">
            <Layout className="w-4 h-4" /> Templates
          </Button>
          <PDFDownload />
          <SimplePDFDownload />
        </div>
      </header>

      {/* Template selector */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b bg-card overflow-hidden"
          >
            <div className="p-4">
              <TemplateSelector />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile toggle */}
      <div className="lg:hidden flex border-b">
        <button onClick={() => setMobileView('form')} className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${mobileView === 'form' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}>
          Edit
        </button>
        <button onClick={() => setMobileView('preview')} className={`flex-1 py-2 text-sm font-medium text-center transition-colors flex items-center justify-center gap-1 ${mobileView === 'preview' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}>
          <Eye className="w-4 h-4" /> Preview
        </button>
        <button onClick={() => setMobileView('resumes')} className={`flex-1 py-2 text-sm font-medium text-center transition-colors flex items-center justify-center gap-1 ${mobileView === 'resumes' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}>
          <FolderOpen className="w-4 h-4" /> My Resumes
        </button>
        <button onClick={() => setMobileView('reviewer')} className={`flex-1 py-2 text-sm font-medium text-center transition-colors flex items-center justify-center gap-1 ${mobileView === 'reviewer' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}>
          <MessageSquare className="w-4 h-4" /> Review
        </button>
        <button onClick={() => setMobileView('uploader')} className={`flex-1 py-2 text-sm font-medium text-center transition-colors flex items-center justify-center gap-1 ${mobileView === 'uploader' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}>
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Panel */}
        <div className={`w-full lg:w-[45%] xl:w-[40%] p-4 overflow-y-auto border-r ${mobileView === 'preview' || mobileView === 'resumes' || mobileView === 'reviewer' || mobileView === 'uploader' ? 'hidden lg:block' : ''}`}>
          <Tabs defaultValue="form" className="h-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="form">Edit Resume</TabsTrigger>
              <TabsTrigger value="resumes">My Resumes</TabsTrigger>
              <TabsTrigger value="reviewer">Resume Review</TabsTrigger>
              <TabsTrigger value="uploader">Upload Resume</TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="mt-0">
              <FormPanel />
            </TabsContent>
            <TabsContent value="resumes" className="mt-0">
              <ResumeManager />
            </TabsContent>
            <TabsContent value="reviewer" className="mt-0">
              <ResumeReviewer />
            </TabsContent>
            <TabsContent value="uploader" className="mt-0">
              <ResumeUploader />
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className={`flex-1 p-6 overflow-y-auto bg-muted/30 ${mobileView === 'form' || mobileView === 'resumes' ? 'hidden lg:block' : ''}`}>
          {mobileView === 'reviewer' ? (
            <div className="max-w-[800px] mx-auto">
              <ResumeReviewer />
            </div>
          ) : mobileView === 'uploader' ? (
            <div className="max-w-[800px] mx-auto">
              <ResumeUploader />
            </div>
          ) : (
            <div className="max-w-[650px] mx-auto">
              <ResumePreview />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Builder() {
  return (
    <ResumeProvider>
      <BuilderContent />
    </ResumeProvider>
  );
}
