import { ResumeData } from '@/types/resume';

export function generateAISummary(data: ResumeData): string {
  const { personalInfo, experiences, skills, education } = data;
  const name = personalInfo.fullName || 'A professional';
  const title = personalInfo.jobTitle || 'experienced professional';
  const totalYears = experiences.length > 0 ? `${Math.max(1, experiences.length * 2)}+` : '';
  const topSkills = skills.slice(0, 4).map(s => s.name).filter(Boolean);
  const latestEdu = education[0];
  const latestExp = experiences[0];

  const parts: string[] = [];
  
  parts.push(`${name} is a dedicated ${title}`);
  
  if (totalYears) {
    parts[0] += ` with ${totalYears} years of experience`;
  }
  
  if (latestExp) {
    parts.push(`Most recently served as ${latestExp.position} at ${latestExp.company}`);
  }
  
  if (topSkills.length > 0) {
    parts.push(`Key expertise includes ${topSkills.join(', ')}`);
  }
  
  if (latestEdu) {
    parts.push(`Holds a ${latestEdu.degree} in ${latestEdu.field} from ${latestEdu.institution}`);
  }
  
  parts.push('Passionate about delivering high-quality results and driving innovation in every project undertaken.');
  
  return parts.filter(p => p && !p.includes('undefined') && !p.includes(' in  from ')).join('. ') + '.';
}

export function generateExperienceDescription(position: string, company: string): string {
  const descriptions: Record<string, string[]> = {
    default: [
      `Led key initiatives and contributed to team success at ${company}.`,
      `Collaborated with cross-functional teams to deliver impactful solutions.`,
      `Drove continuous improvement and innovation in daily responsibilities.`,
    ],
    developer: [
      `Developed and maintained scalable applications at ${company}.`,
      `Implemented best practices for code quality and performance optimization.`,
      `Collaborated with designers and product managers to deliver user-centric solutions.`,
    ],
    manager: [
      `Led and mentored a team of professionals at ${company}.`,
      `Drove strategic initiatives resulting in measurable business outcomes.`,
      `Established processes and workflows to improve team productivity.`,
    ],
    designer: [
      `Created compelling visual designs and user experiences at ${company}.`,
      `Conducted user research to inform design decisions and improve usability.`,
      `Maintained design systems and ensured brand consistency across products.`,
    ],
  };

  const posLower = position.toLowerCase();
  let key = 'default';
  if (posLower.includes('develop') || posLower.includes('engineer') || posLower.includes('program')) key = 'developer';
  else if (posLower.includes('manag') || posLower.includes('lead') || posLower.includes('director')) key = 'manager';
  else if (posLower.includes('design') || posLower.includes('ux') || posLower.includes('ui')) key = 'designer';

  return descriptions[key].join(' ');
}
