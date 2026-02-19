import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Experience, Education, Skill, Project, Certification, Language } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { User, Briefcase, GraduationCap, Wrench, FolderOpen, Award, Globe, Paperclip, Sparkles, Camera, Plus, Trash2 } from 'lucide-react';
import { generateAISummary, generateExperienceDescription } from '@/utils/aiSummary';
import { motion, AnimatePresence } from 'framer-motion';

const genId = () => Math.random().toString(36).slice(2, 9);

export default function FormPanel() {
  const { resumeData, setResumeData, updatePersonalInfo } = useResume();
  const [activeTab, setActiveTab] = useState('personal');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updatePersonalInfo('photoUrl', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { id: genId(), company: '', position: '', startDate: '', endDate: '', current: false, description: '', location: '' }],
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== id) }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: genId(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: genId(), name: '', level: 3, category: '' }],
    }));
  };

  const updateSkill = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: genId(), name: '', description: '', url: '', technologies: '' }],
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { id: genId(), name: '', issuer: '', date: '', url: '' }],
    }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c),
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  };

  const addLanguage = () => {
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, { id: genId(), name: '', proficiency: 'Intermediate' }],
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l),
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(f => ({
        id: genId(),
        name: f.name,
        file: f,
        url: URL.createObjectURL(f),
      }));
      setResumeData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }));
    }
  };

  const removeAttachment = (id: string) => {
    setResumeData(prev => ({ ...prev, attachments: prev.attachments.filter(a => a.id !== id) }));
  };

  const handleAISummary = () => {
    const summary = generateAISummary(resumeData);
    updatePersonalInfo('summary', summary);
  };

  const handleAIDescription = (expId: string) => {
    const exp = resumeData.experiences.find(e => e.id === expId);
    if (exp) {
      const desc = generateExperienceDescription(exp.position, exp.company);
      updateExperience(expId, 'description', desc);
    }
  };

  const tabItems = [
    { value: 'personal', icon: User, label: 'Personal' },
    { value: 'experience', icon: Briefcase, label: 'Experience' },
    { value: 'education', icon: GraduationCap, label: 'Education' },
    { value: 'skills', icon: Wrench, label: 'Skills' },
    { value: 'projects', icon: FolderOpen, label: 'Projects' },
    { value: 'certifications', icon: Award, label: 'Certs' },
    { value: 'languages', icon: Globe, label: 'Languages' },
    { value: 'extras', icon: Paperclip, label: 'Extras' },
  ];

  const p = resumeData.personalInfo;

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-1 p-1 bg-muted rounded-xl mb-4 h-auto">
          {tabItems.map(t => (
            <TabsTrigger key={t.value} value={t.value} className="flex flex-col items-center gap-1 py-2 px-1 text-xs data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">
              <t.icon className="w-4 h-4" />
              <span>{t.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto pr-1">
          <TabsContent value="personal" className="mt-0 space-y-4">
            {/* Photo Upload */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-primary/20 flex items-center justify-center">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Profile Photo</p>
                <p>Click to upload</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Full Name</Label>
                <Input value={p.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} placeholder="John Doe" />
              </div>
              <div className="col-span-2">
                <Label>Job Title</Label>
                <Input value={p.jobTitle} onChange={e => updatePersonalInfo('jobTitle', e.target.value)} placeholder="Software Engineer" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={p.email} onChange={e => updatePersonalInfo('email', e.target.value)} placeholder="john@example.com" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={p.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} placeholder="+1 234 567 8900" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={p.location} onChange={e => updatePersonalInfo('location', e.target.value)} placeholder="New York, NY" />
              </div>
              <div>
                <Label>Website</Label>
                <Input value={p.website} onChange={e => updatePersonalInfo('website', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input value={p.linkedin} onChange={e => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
              </div>
              <div>
                <Label>GitHub</Label>
                <Input value={p.github} onChange={e => updatePersonalInfo('github', e.target.value)} placeholder="github.com/..." />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Professional Summary</Label>
                <Button variant="ghost" size="sm" onClick={handleAISummary} className="text-xs gap-1 text-primary">
                  <Sparkles className="w-3 h-3" /> AI Generate
                </Button>
              </div>
              <Textarea value={p.summary} onChange={e => updatePersonalInfo('summary', e.target.value)} placeholder="Write a professional summary..." rows={4} />
            </div>
          </TabsContent>

          <TabsContent value="experience" className="mt-0 space-y-4">
            <AnimatePresence>
              {resumeData.experiences.map((exp) => (
                <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">Experience</h4>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleAIDescription(exp.id)} className="text-xs gap-1 text-primary">
                        <Sparkles className="w-3 h-3" /> AI
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)} className="text-destructive h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Position</Label><Input value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} placeholder="Job Title" /></div>
                    <div><Label>Company</Label><Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company Name" /></div>
                    <div><Label>Start Date</Label><Input type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} /></div>
                    <div><Label>End Date</Label><Input type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} /></div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Switch checked={exp.current} onCheckedChange={v => updateExperience(exp.id, 'current', v)} />
                      <Label>Currently working here</Label>
                    </div>
                    <div><Label>Location</Label><Input value={exp.location} onChange={e => updateExperience(exp.id, 'location', e.target.value)} placeholder="City, State" /></div>
                  </div>
                  <div><Label>Description</Label><Textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="Describe your role..." rows={3} /></div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" onClick={addExperience} className="w-full gap-2"><Plus className="w-4 h-4" /> Add Experience</Button>
          </TabsContent>

          <TabsContent value="education" className="mt-0 space-y-4">
            <AnimatePresence>
              {resumeData.education.map((edu) => (
                <motion.div key={edu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">Education</h4>
                    <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)} className="text-destructive h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><Label>Institution</Label><Input value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University Name" /></div>
                    <div><Label>Degree</Label><Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor's" /></div>
                    <div><Label>Field of Study</Label><Input value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" /></div>
                    <div><Label>Start Date</Label><Input type="month" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} /></div>
                    <div><Label>End Date</Label><Input type="month" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} /></div>
                    <div><Label>GPA</Label><Input value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.8/4.0" /></div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" onClick={addEducation} className="w-full gap-2"><Plus className="w-4 h-4" /> Add Education</Button>
          </TabsContent>

          <TabsContent value="skills" className="mt-0 space-y-4">
            <AnimatePresence>
              {resumeData.skills.map((skill) => (
                <motion.div key={skill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-xl border bg-card space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} placeholder="Skill name" />
                      <Input value={skill.category} onChange={e => updateSkill(skill.id, 'category', e.target.value)} placeholder="Category" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="text-destructive h-8 w-8 ml-2"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-12">Level: {skill.level}</span>
                    <Slider value={[skill.level]} onValueChange={v => updateSkill(skill.id, 'level', v[0])} min={1} max={5} step={1} className="flex-1" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" onClick={addSkill} className="w-full gap-2"><Plus className="w-4 h-4" /> Add Skill</Button>
          </TabsContent>

          <TabsContent value="projects" className="mt-0 space-y-4">
            <AnimatePresence>
              {resumeData.projects.map((proj) => (
                <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">Project</h4>
                    <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)} className="text-destructive h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Name</Label><Input value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} placeholder="Project Name" /></div>
                    <div><Label>URL</Label><Input value={proj.url} onChange={e => updateProject(proj.id, 'url', e.target.value)} placeholder="https://..." /></div>
                    <div className="col-span-2"><Label>Technologies</Label><Input value={proj.technologies} onChange={e => updateProject(proj.id, 'technologies', e.target.value)} placeholder="React, Node.js, etc." /></div>
                    <div className="col-span-2"><Label>Description</Label><Textarea value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} placeholder="Describe the project..." rows={2} /></div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" onClick={addProject} className="w-full gap-2"><Plus className="w-4 h-4" /> Add Project</Button>
          </TabsContent>

          <TabsContent value="certifications" className="mt-0 space-y-4">
            <AnimatePresence>
              {resumeData.certifications.map((cert) => (
                <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">Certification</h4>
                    <Button variant="ghost" size="icon" onClick={() => removeCertification(cert.id)} className="text-destructive h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><Label>Name</Label><Input value={cert.name} onChange={e => updateCertification(cert.id, 'name', e.target.value)} placeholder="Certification Name" /></div>
                    <div><Label>Issuer</Label><Input value={cert.issuer} onChange={e => updateCertification(cert.id, 'issuer', e.target.value)} placeholder="Issuing Org" /></div>
                    <div><Label>Date</Label><Input type="month" value={cert.date} onChange={e => updateCertification(cert.id, 'date', e.target.value)} /></div>
                    <div className="col-span-2"><Label>URL</Label><Input value={cert.url} onChange={e => updateCertification(cert.id, 'url', e.target.value)} placeholder="https://..." /></div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" onClick={addCertification} className="w-full gap-2"><Plus className="w-4 h-4" /> Add Certification</Button>
          </TabsContent>

          <TabsContent value="languages" className="mt-0 space-y-4">
            <AnimatePresence>
              {resumeData.languages.map((lang) => (
                <motion.div key={lang.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-xl border bg-card flex gap-3 items-center">
                  <Input value={lang.name} onChange={e => updateLanguage(lang.id, 'name', e.target.value)} placeholder="Language" className="flex-1" />
                  <select value={lang.proficiency} onChange={e => updateLanguage(lang.id, 'proficiency', e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
                    <option>Native</option><option>Fluent</option><option>Advanced</option><option>Intermediate</option><option>Basic</option>
                  </select>
                  <Button variant="ghost" size="icon" onClick={() => removeLanguage(lang.id)} className="text-destructive h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" onClick={addLanguage} className="w-full gap-2"><Plus className="w-4 h-4" /> Add Language</Button>
          </TabsContent>

          <TabsContent value="extras" className="mt-0 space-y-4">
            <div>
              <Label>Hobbies & Interests</Label>
              <Textarea value={resumeData.hobbies} onChange={e => setResumeData(prev => ({ ...prev, hobbies: e.target.value }))} placeholder="Reading, traveling, photography..." rows={3} />
            </div>
            <div>
              <Label>References</Label>
              <Textarea value={resumeData.references} onChange={e => setResumeData(prev => ({ ...prev, references: e.target.value }))} placeholder="Available upon request" rows={3} />
            </div>
            <div>
              <Label>Attachments</Label>
              <div className="mt-2 space-y-2">
                {resumeData.attachments.map(a => (
                  <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{a.name}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeAttachment(a.id)} className="h-6 w-6 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                ))}
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 cursor-pointer transition-colors">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Attach files</span>
                  <input type="file" multiple onChange={handleAttachment} className="hidden" />
                </label>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
