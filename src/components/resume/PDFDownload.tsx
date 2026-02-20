import { Button } from '@/components/ui/button';
import { Download, Loader2, Printer } from 'lucide-react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { analyticsService } from '@/services';

export default function PDFDownload() {
  const [loading, setLoading] = useState(false);

  const handlePrintFallback = () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      toast.error('Resume preview not found');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume</title>
            <style>
              body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; }
              @media print { body { margin: 0; } }
              .no-print { display: none !important; }
              .gradient-text { color: #000 !important; background: none !important; }
              .gradient-primary, .gradient-secondary, .gradient-warm, .gradient-hero { 
                background: #ffffff !important; 
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
      
      toast.success('Print dialog opened. Use Ctrl+P to print as PDF.');
    } else {
      toast.error('Could not open print window. Please check your browser settings.');
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      toast.error('Resume preview not found');
      return;
    }

    setLoading(true);
    try {
      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Starting PDF generation for element:', element);
      console.log('Element offset dimensions:', element.offsetWidth, 'x', element.offsetHeight);
      console.log('Element scroll dimensions:', element.scrollWidth, 'x', element.scrollHeight);
      console.log('Element client dimensions:', element.clientWidth, 'x', element.clientHeight);
      console.log('Element bounding rect:', element.getBoundingClientRect());
      
      // Pre-process element to remove all gradient-related styles
      const processedElement = element.cloneNode(true) as HTMLElement;
      
      // Function to recursively clean gradients
      const cleanGradients = (el: HTMLElement) => {
        const computedStyle = window.getComputedStyle(el);
        
        // Remove gradient backgrounds
        if (computedStyle.background && computedStyle.background.includes('gradient')) {
          el.style.background = '#ffffff';
          console.log('Removed gradient background from:', el);
        }
        
        // Remove gradient text effects
        if (computedStyle.backgroundImage && computedStyle.backgroundImage.includes('gradient')) {
          el.style.backgroundImage = 'none';
          console.log('Removed gradient background-image from:', el);
        }
        
        // Clean text fill for gradient text
        if (el.classList.contains('gradient-text')) {
          el.style.background = 'none';
          el.style.color = '#000000';
          console.log('Cleaned gradient-text element:', el);
        }
        
        // Recursively process children
        Array.from(el.children).forEach(child => {
          if (child instanceof HTMLElement) {
            cleanGradients(child);
          }
        });
      };
      
      // Apply gradient cleaning
      cleanGradients(processedElement);
      
      // Ensure the element has proper dimensions
      processedElement.style.width = '100%';
      processedElement.style.minWidth = '650px';
      processedElement.style.minHeight = '400px';
      processedElement.style.backgroundColor = '#ffffff';
      processedElement.style.padding = '20px';
      processedElement.style.boxSizing = 'border-box';
      
      // Create a temporary container for the cleaned element
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '800px'; // Fixed width
      container.style.height = '600px'; // Fixed height
      container.style.backgroundColor = '#ffffff';
      container.style.padding = '0';
      container.style.overflow = 'visible';
      container.appendChild(processedElement);
      document.body.appendChild(container);
      
      console.log('Created temporary container with cleaned element');
      console.log('Container dimensions:', container.offsetWidth, 'x', container.offsetHeight);
      
      // Generate canvas from the cleaned element
      const canvas = await html2canvas(container, {
        scale: 1.2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: 600,
        scrollX: 0,
        scrollY: 0,
        removeContainer: true,
        foreignObjectRendering: false,
        imageTimeout: 10000,
      });
      
      // Remove temporary container
      document.body.removeChild(container);
      
      console.log('Canvas generated:', canvas);
      console.log('Canvas dimensions:', canvas?.width, 'x', canvas?.height);
      
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error(`Canvas generation failed: ${canvas?.width}x${canvas?.height}`);
      }

      // Generate image data
      let imgData;
      try {
        imgData = canvas.toDataURL('image/png');
        console.log('Image data generated successfully, length:', imgData.length);
      } catch (imgError) {
        console.error('Failed to generate image data:', imgError);
        throw new Error(`Image conversion failed: ${imgError.message}`);
      }

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      console.log('PDF dimensions calculated:', pdfWidth, 'x', pdfHeight);
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Handle multi-page
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (pdfHeight > pageHeight) {
        console.log('Content spans multiple pages');
        let remainingHeight = pdfHeight - pageHeight;
        let position = -pageHeight;
        while (remainingHeight > 0) {
          pdf.addPage();
          position -= pageHeight;
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          remainingHeight -= pageHeight;
        }
      }

      pdf.save('resume.pdf');
      toast.success('Resume downloaded as PDF!');
      
      // Track successful download
      try {
        await analyticsService.trackPDFDownload('resume-preview');
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }
      
    } catch (error: any) {
      console.error('PDF generation error:', error);
      console.error('Error stack:', error.stack);
      
      // Provide specific error messages
      if (error.message?.includes('addColorStop') || error.message?.includes('non-finite')) {
        toast.error('Template styling incompatible with PDF. Try a simpler template or use Simple PDF option.', {
          duration: 5000,
        });
      } else if (error.message?.includes('Canvas generation failed')) {
        toast.error('Could not capture resume content. Please try refreshing the page.', {
          duration: 5000,
        });
      } else if (error.message?.includes('Image conversion failed')) {
        toast.error('Failed to convert resume to image. Please try the Simple PDF option.', {
          duration: 5000,
        });
      } else {
        toast.error(`PDF generation failed: ${error.message || 'Unknown error'}. Try the Simple PDF option.`, {
          duration: 5000,
          action: {
            label: 'Try Simple PDF',
            onClick: () => {
              const simpleBtn = document.querySelector('[data-testid="simple-pdf-btn"]');
              if (simpleBtn) {
                (simpleBtn as HTMLElement).click();
              } else {
                toast.info('Simple PDF option available in the menu');
              }
            },
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="gradient" onClick={handleDownload} disabled={loading} className="gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {loading ? 'Generating...' : 'Download PDF'}
      </Button>
      <Button variant="outline" onClick={handlePrintFallback} className="gap-2">
        <Printer className="w-4 h-4" />
        Print
      </Button>
    </div>
  );
}
