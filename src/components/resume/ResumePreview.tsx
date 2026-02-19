import { useResume } from '@/contexts/ResumeContext';
import { TemplateConfig } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export default function ResumePreview() {
  const { resumeData, selectedTemplate: t } = useResume();
  const p = resumeData.personalInfo;

  const ContactIcon = ({ icon: Icon, value }: { icon: any; value: string }) =>
    value ? <span className="flex items-center gap-1 text-xs"><Icon className="w-3 h-3" />{value}</span> : null;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 style={{ color: t.primaryColor, borderBottom: `2px solid ${t.primaryColor}`, paddingBottom: '4px', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{children}</h3>
  );

  const SkillBar = ({ level, color }: { level: number; color: string }) => (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="w-3 h-1.5 rounded-full" style={{ backgroundColor: i <= level ? color : '#e2e8f0' }} />
      ))}
    </div>
  );

  const renderHeader = () => {
    const isGradient = t.headerBg.includes('gradient');
    const headerStyle: React.CSSProperties = {
      background: t.headerBg,
      color: isGradient || t.headerStyle === 'banner' ? '#ffffff' : t.textColor,
      padding: t.headerStyle === 'minimal' ? '16px 24px' : '20px 24px',
      fontFamily: t.fontFamily,
    };

    return (
      <div style={headerStyle}>
        <div className="flex items-center gap-4">
          {p.photoUrl && (
            <img src={p.photoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: isGradient ? 'rgba(255,255,255,0.5)' : t.accentColor }} />
          )}
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>{p.fullName || 'Your Name'}</h1>
            <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>{p.jobTitle || 'Your Job Title'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3" style={{ fontSize: '10px' }}>
          <ContactIcon icon={Mail} value={p.email} />
          <ContactIcon icon={Phone} value={p.phone} />
          <ContactIcon icon={MapPin} value={p.location} />
          <ContactIcon icon={Globe} value={p.website} />
          <ContactIcon icon={Linkedin} value={p.linkedin} />
          <ContactIcon icon={Github} value={p.github} />
        </div>
      </div>
    );
  };

  const renderSummary = () => p.summary ? (
    <div className="mb-3">
      <SectionTitle>Summary</SectionTitle>
      <p className="text-xs leading-relaxed">{p.summary}</p>
    </div>
  ) : null;

  const renderExperience = () => resumeData.experiences.length > 0 ? (
    <div className="mb-3">
      <SectionTitle>Experience</SectionTitle>
      {resumeData.experiences.map(exp => (
        <div key={exp.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-xs">{exp.position}</span>
            <span className="text-[10px]" style={{ color: t.accentColor }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
          </div>
          <div className="text-xs" style={{ color: t.primaryColor }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
          {exp.description && <p className="text-[10px] mt-1 leading-relaxed opacity-80">{exp.description}</p>}
        </div>
      ))}
    </div>
  ) : null;

  const renderEducation = () => resumeData.education.length > 0 ? (
    <div className="mb-3">
      <SectionTitle>Education</SectionTitle>
      {resumeData.education.map(edu => (
        <div key={edu.id} className="mb-2">
          <div className="font-semibold text-xs">{edu.degree} in {edu.field}</div>
          <div className="text-xs" style={{ color: t.primaryColor }}>{edu.institution}</div>
          <div className="text-[10px] opacity-70">{edu.startDate} - {edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
        </div>
      ))}
    </div>
  ) : null;

  const renderSkills = () => resumeData.skills.length > 0 ? (
    <div className="mb-3">
      <SectionTitle>Skills</SectionTitle>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {resumeData.skills.map(skill => (
          <div key={skill.id}>
            <span className="text-xs">{skill.name}</span>
            <SkillBar level={skill.level} color={t.primaryColor} />
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const renderProjects = () => resumeData.projects.length > 0 ? (
    <div className="mb-3">
      <SectionTitle>Projects</SectionTitle>
      {resumeData.projects.map(proj => (
        <div key={proj.id} className="mb-2">
          <div className="font-semibold text-xs">{proj.name}</div>
          {proj.technologies && <div className="text-[10px]" style={{ color: t.accentColor }}>{proj.technologies}</div>}
          {proj.description && <p className="text-[10px] mt-0.5 opacity-80">{proj.description}</p>}
        </div>
      ))}
    </div>
  ) : null;

  const renderCertifications = () => resumeData.certifications.length > 0 ? (
    <div className="mb-3">
      <SectionTitle>Certifications</SectionTitle>
      {resumeData.certifications.map(cert => (
        <div key={cert.id} className="mb-1">
          <div className="font-semibold text-xs">{cert.name}</div>
          <div className="text-[10px] opacity-70">{cert.issuer} · {cert.date}</div>
        </div>
      ))}
    </div>
  ) : null;

  const renderLanguages = () => resumeData.languages.length > 0 ? (
    <div className="mb-3">
      <SectionTitle>Languages</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {resumeData.languages.map(lang => (
          <span key={lang.id} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${t.primaryColor}15`, color: t.primaryColor }}>
            {lang.name} · {lang.proficiency}
          </span>
        ))}
      </div>
    </div>
  ) : null;

  const renderExtras = () => (
    <>
      {resumeData.hobbies && (
        <div className="mb-3">
          <SectionTitle>Hobbies & Interests</SectionTitle>
          <p className="text-xs opacity-80">{resumeData.hobbies}</p>
        </div>
      )}
      {resumeData.references && (
        <div className="mb-3">
          <SectionTitle>References</SectionTitle>
          <p className="text-xs opacity-80">{resumeData.references}</p>
        </div>
      )}
    </>
  );

  const mainContent = () => (
    <>
      {renderSummary()}
      {renderExperience()}
      {renderProjects()}
    </>
  );

  const sideContent = () => (
    <>
      {renderSkills()}
      {renderEducation()}
      {renderCertifications()}
      {renderLanguages()}
      {renderExtras()}
    </>
  );

  return (
    <div id="resume-preview" style={{ fontFamily: t.fontFamily, backgroundColor: t.bgColor, color: t.textColor, width: '100%', minHeight: '700px' }} className="shadow-elevated rounded-lg overflow-hidden">
      {renderHeader()}
      <div style={{ padding: '16px 24px' }}>
        {t.layout === 'single' && (
          <div>{mainContent()}{sideContent()}</div>
        )}
        {t.layout === 'double' && (
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-6">
            <div>{mainContent()}</div>
            <div>{sideContent()}</div>
          </div>
        )}
        {t.layout === 'sidebar' && (
          <div className="grid grid-cols-[0.8fr_1.2fr] gap-6">
            <div style={{ borderRight: `1px solid ${t.primaryColor}20`, paddingRight: '16px' }}>{sideContent()}</div>
            <div>{mainContent()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
