import { useResume } from '@/contexts/ResumeContext';
import { templates, templateCategories } from '@/data/templates';
import { TemplateConfig } from '@/types/resume';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate } = useResume();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? templates : templates.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 flex-wrap">
        {['All', ...templateCategories].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
        {filtered.map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTemplate(t)}
            className={`relative p-1 rounded-lg border-2 transition-all ${selectedTemplate.id === t.id ? 'border-primary shadow-glow' : 'border-transparent hover:border-muted'}`}
          >
            <TemplateThumbnail template={t} />
            {selectedTemplate.id === t.id && (
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full gradient-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <p className="text-[9px] mt-1 truncate text-center text-muted-foreground">{t.name}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function TemplateThumbnail({ template: t }: { template: TemplateConfig }) {
  const isGradient = t.headerBg.includes('gradient');
  return (
    <div className="w-full aspect-[3/4] rounded overflow-hidden" style={{ backgroundColor: t.bgColor, fontSize: '3px' }}>
      <div className="h-[30%]" style={{ background: t.headerBg }} />
      <div className="p-1.5 space-y-1">
        {t.layout === 'double' ? (
          <div className="flex gap-1">
            <div className="flex-[1.2] space-y-0.5">
              <div className="h-0.5 rounded-full w-3/4" style={{ backgroundColor: t.primaryColor }} />
              <div className="h-0.5 rounded-full w-full bg-muted" />
              <div className="h-0.5 rounded-full w-2/3 bg-muted" />
            </div>
            <div className="flex-[0.8] space-y-0.5">
              <div className="h-0.5 rounded-full w-full" style={{ backgroundColor: t.accentColor }} />
              <div className="h-0.5 rounded-full w-2/3 bg-muted" />
            </div>
          </div>
        ) : t.layout === 'sidebar' ? (
          <div className="flex gap-1">
            <div className="flex-[0.8] space-y-0.5" style={{ borderRight: `0.5px solid ${t.primaryColor}30` }}>
              <div className="h-0.5 rounded-full w-full" style={{ backgroundColor: t.accentColor }} />
              <div className="h-0.5 rounded-full w-2/3 bg-muted" />
            </div>
            <div className="flex-[1.2] space-y-0.5">
              <div className="h-0.5 rounded-full w-3/4" style={{ backgroundColor: t.primaryColor }} />
              <div className="h-0.5 rounded-full w-full bg-muted" />
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="h-0.5 rounded-full w-3/4" style={{ backgroundColor: t.primaryColor }} />
            <div className="h-0.5 rounded-full w-full bg-muted" />
            <div className="h-0.5 rounded-full w-2/3 bg-muted" />
          </div>
        )}
      </div>
    </div>
  );
}
