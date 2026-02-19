import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData, TemplateConfig } from '@/types/resume';
import { templates } from '@/data/templates';

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '', jobTitle: '', email: '', phone: '', location: '',
    website: '', linkedin: '', github: '', photoUrl: '', summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  attachments: [],
  hobbies: '',
  references: '',
};

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  selectedTemplate: TemplateConfig;
  setSelectedTemplate: (t: TemplateConfig) => void;
  updatePersonalInfo: (field: string, value: string) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
};

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig>(templates[5]); // Modern Indigo

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, selectedTemplate, setSelectedTemplate, updatePersonalInfo }}>
      {children}
    </ResumeContext.Provider>
  );
};
