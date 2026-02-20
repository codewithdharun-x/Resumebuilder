import { Button } from '@/components/ui/button';
import { Download, Loader2, Printer } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { useResume } from '@/contexts/ResumeContext';

export default function SimplePDFDownload() {
  const [loading, setLoading] = useState(false);
  const { resumeData, selectedTemplate } = useResume();

  const handleSimplePDF = async () => {
    setLoading(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(fontSize);
        if (isBold) {
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setFont('helvetica', 'normal');
        }
        
        const lines = pdf.splitTextToSize(text, pageWidth - 40);
        lines.forEach((line: string) => {
          pdf.text(line, 20, yPosition);
          yPosition += fontSize * 0.7;
        });
        
        yPosition += 5;
      };

      // Add personal info
      if (resumeData.personalInfo.fullName) {
        addText(resumeData.personalInfo.fullName, 20, true);
      }
      
      if (resumeData.personalInfo.jobTitle) {
        addText(resumeData.personalInfo.jobTitle, 14, false);
      }
      
      if (resumeData.personalInfo.email || resumeData.personalInfo.phone || resumeData.personalInfo.location) {
        const contactInfo = [
          resumeData.personalInfo.email,
          resumeData.personalInfo.phone,
          resumeData.personalInfo.location
        ].filter(Boolean).join(' | ');
        addText(contactInfo, 10, false);
      }

      yPosition += 10;

      // Add summary
      if (resumeData.personalInfo.summary) {
        addText('Professional Summary', 14, true);
        addText(resumeData.personalInfo.summary, 11, false);
        yPosition += 5;
      }

      // Add experience
      if (resumeData.experiences.length > 0) {
        addText('Experience', 14, true);
        resumeData.experiences.forEach((exp) => {
          addText(`${exp.position} at ${exp.company}`, 12, true);
          addText(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, 10, false);
          if (exp.location) {
            addText(exp.location, 10, false);
          }
          addText(exp.description, 11, false);
          yPosition += 5;
        });
      }

      // Add education
      if (resumeData.education.length > 0) {
        addText('Education', 14, true);
        resumeData.education.forEach((edu) => {
          addText(`${edu.degree} in ${edu.field}`, 12, true);
          addText(edu.institution, 11, false);
          addText(`${edu.startDate} - ${edu.endDate}`, 10, false);
          if (edu.gpa) {
            addText(`GPA: ${edu.gpa}`, 10, false);
          }
          yPosition += 5;
        });
      }

      // Add skills
      if (resumeData.skills.length > 0) {
        addText('Skills', 14, true);
        const skillsByCategory = resumeData.skills.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>);

        Object.entries(skillsByCategory).forEach(([category, skills]) => {
          addText(`${category}: ${skills.join(', ')}`, 11, false);
        });
        yPosition += 5;
      }

      // Add projects
      if (resumeData.projects.length > 0) {
        addText('Projects', 14, true);
        resumeData.projects.forEach((project) => {
          addText(project.name, 12, true);
          addText(project.description, 11, false);
          if (project.technologies) {
            addText(`Technologies: ${project.technologies}`, 10, false);
          }
          yPosition += 5;
        });
      }

      // Save the PDF
      pdf.save(`${resumeData.personalInfo.fullName || 'resume'}.pdf`);
      toast.success('Resume downloaded successfully!');
      
    } catch (error: any) {
      console.error('Simple PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try the print option.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // Create a simple text-only version for printing
    const printContent = `
      <html>
        <head>
          <title>Resume - ${resumeData.personalInfo.fullName || 'Untitled'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
            h1 { font-size: 20px; margin-bottom: 5px; }
            h2 { font-size: 14px; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            h3 { font-size: 12px; margin: 10px 0 5px 0; }
            p { font-size: 11px; margin: 5px 0; }
            .contact { font-size: 10px; margin-bottom: 20px; }
            @media print { body { margin: 10px; } }
          </style>
        </head>
        <body>
          <h1>${resumeData.personalInfo.fullName || 'Your Name'}</h1>
          <p class="contact">${resumeData.personalInfo.jobTitle || ''}</p>
          <p class="contact">${[
            resumeData.personalInfo.email,
            resumeData.personalInfo.phone,
            resumeData.personalInfo.location
          ].filter(Boolean).join(' | ')}</p>
          
          ${resumeData.personalInfo.summary ? `
            <h2>Professional Summary</h2>
            <p>${resumeData.personalInfo.summary}</p>
          ` : ''}
          
          ${resumeData.experiences.length > 0 ? `
            <h2>Experience</h2>
            ${resumeData.experiences.map(exp => `
              <h3>${exp.position} at ${exp.company}</h3>
              <p>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate} ${exp.location ? `| ${exp.location}` : ''}</p>
              <p>${exp.description}</p>
            `).join('')}
          ` : ''}
          
          ${resumeData.education.length > 0 ? `
            <h2>Education</h2>
            ${resumeData.education.map(edu => `
              <h3>${edu.degree} in ${edu.field}</h3>
              <p>${edu.institution} | ${edu.startDate} - ${edu.endDate} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</p>
            `).join('')}
          ` : ''}
          
          ${resumeData.skills.length > 0 ? `
            <h2>Skills</h2>
            ${Object.entries(resumeData.skills.reduce((acc, skill) => {
              if (!acc[skill.category]) acc[skill.category] = [];
              acc[skill.category].push(skill.name);
              return acc;
            }, {} as Record<string, string[]>)).map(([category, skills]) => `
              <p><strong>${category}:</strong> ${skills.join(', ')}</p>
            `).join('')}
          ` : ''}
          
          ${resumeData.projects.length > 0 ? `
            <h2>Projects</h2>
            ${resumeData.projects.map(project => `
              <h3>${project.name}</h3>
              <p>${project.description}</p>
              ${project.technologies ? `<p><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
            `).join('')}
          ` : ''}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
      
      toast.success('Print dialog opened. Use Ctrl+P to save as PDF.');
    } else {
      toast.error('Could not open print window.');
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handlePrint} className="gap-2" data-testid="simple-pdf-btn">
        <Printer className="w-4 h-4" />
        Simple PDF
      </Button>
    </div>
  );
}
