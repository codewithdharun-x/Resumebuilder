import { TemplateConfig } from '@/types/resume';

export const templates: TemplateConfig[] = [
  // Classic (5)
  { id: 'classic-1', name: 'Classic Blue', category: 'Classic', primaryColor: '#2563eb', secondaryColor: '#1e40af', accentColor: '#3b82f6', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#2563eb', layout: 'single', fontFamily: "'Georgia', serif", headerStyle: 'banner' },
  { id: 'classic-2', name: 'Classic Navy', category: 'Classic', primaryColor: '#1e3a5f', secondaryColor: '#0f2744', accentColor: '#2563eb', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#1e3a5f', layout: 'single', fontFamily: "'Georgia', serif", headerStyle: 'banner' },
  { id: 'classic-3', name: 'Classic Green', category: 'Classic', primaryColor: '#166534', secondaryColor: '#14532d', accentColor: '#22c55e', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#166534', layout: 'single', fontFamily: "'Times New Roman', serif", headerStyle: 'banner' },
  { id: 'classic-4', name: 'Classic Burgundy', category: 'Classic', primaryColor: '#881337', secondaryColor: '#701a33', accentColor: '#e11d48', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#881337', layout: 'single', fontFamily: "'Georgia', serif", headerStyle: 'banner' },
  { id: 'classic-5', name: 'Classic Charcoal', category: 'Classic', primaryColor: '#374151', secondaryColor: '#1f2937', accentColor: '#6b7280', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#374151', layout: 'single', fontFamily: "'Georgia', serif", headerStyle: 'minimal' },

  // Modern (5)
  { id: 'modern-1', name: 'Modern Indigo', category: 'Modern', primaryColor: '#6366f1', secondaryColor: '#4f46e5', accentColor: '#818cf8', bgColor: '#ffffff', textColor: '#1e293b', headerBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', layout: 'double', fontFamily: "'Inter', sans-serif", headerStyle: 'gradient' },
  { id: 'modern-2', name: 'Modern Coral', category: 'Modern', primaryColor: '#f43f5e', secondaryColor: '#e11d48', accentColor: '#fb7185', bgColor: '#ffffff', textColor: '#1e293b', headerBg: 'linear-gradient(135deg, #f43f5e, #f97316)', layout: 'double', fontFamily: "'Inter', sans-serif", headerStyle: 'gradient' },
  { id: 'modern-3', name: 'Modern Teal', category: 'Modern', primaryColor: '#14b8a6', secondaryColor: '#0d9488', accentColor: '#2dd4bf', bgColor: '#ffffff', textColor: '#1e293b', headerBg: 'linear-gradient(135deg, #14b8a6, #06b6d4)', layout: 'double', fontFamily: "'Inter', sans-serif", headerStyle: 'gradient' },
  { id: 'modern-4', name: 'Modern Amber', category: 'Modern', primaryColor: '#f59e0b', secondaryColor: '#d97706', accentColor: '#fbbf24', bgColor: '#ffffff', textColor: '#1e293b', headerBg: 'linear-gradient(135deg, #f59e0b, #ef4444)', layout: 'double', fontFamily: "'Inter', sans-serif", headerStyle: 'gradient' },
  { id: 'modern-5', name: 'Modern Violet', category: 'Modern', primaryColor: '#8b5cf6', secondaryColor: '#7c3aed', accentColor: '#a78bfa', bgColor: '#ffffff', textColor: '#1e293b', headerBg: 'linear-gradient(135deg, #8b5cf6, #ec4899)', layout: 'double', fontFamily: "'Inter', sans-serif", headerStyle: 'gradient' },

  // Creative (5)
  { id: 'creative-1', name: 'Creative Sunset', category: 'Creative', primaryColor: '#f97316', secondaryColor: '#ea580c', accentColor: '#fb923c', bgColor: '#fffbf5', textColor: '#1e293b', headerBg: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'split' },
  { id: 'creative-2', name: 'Creative Ocean', category: 'Creative', primaryColor: '#0ea5e9', secondaryColor: '#0284c7', accentColor: '#38bdf8', bgColor: '#f0f9ff', textColor: '#1e293b', headerBg: 'linear-gradient(135deg, #0ea5e9, #6366f1)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'split' },
  { id: 'creative-3', name: 'Creative Forest', category: 'Creative', primaryColor: '#22c55e', secondaryColor: '#16a34a', accentColor: '#4ade80', bgColor: '#f0fdf4', textColor: '#1e293b', headerBg: 'linear-gradient(135deg, #22c55e, #14b8a6)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'split' },
  { id: 'creative-4', name: 'Creative Berry', category: 'Creative', primaryColor: '#d946ef', secondaryColor: '#c026d3', accentColor: '#e879f9', bgColor: '#fdf4ff', textColor: '#1e293b', headerBg: 'linear-gradient(135deg, #d946ef, #f43f5e)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'split' },
  { id: 'creative-5', name: 'Creative Neon', category: 'Creative', primaryColor: '#a3e635', secondaryColor: '#84cc16', accentColor: '#bef264', bgColor: '#1a1a2e', textColor: '#e2e8f0', headerBg: 'linear-gradient(135deg, #a3e635, #22d3ee)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'split' },

  // Minimalist (5)
  { id: 'minimal-1', name: 'Minimal Clean', category: 'Minimalist', primaryColor: '#0f172a', secondaryColor: '#1e293b', accentColor: '#475569', bgColor: '#ffffff', textColor: '#334155', headerBg: '#ffffff', layout: 'single', fontFamily: "'Inter', sans-serif", headerStyle: 'minimal' },
  { id: 'minimal-2', name: 'Minimal Warm', category: 'Minimalist', primaryColor: '#78350f', secondaryColor: '#92400e', accentColor: '#b45309', bgColor: '#fffbeb', textColor: '#451a03', headerBg: '#fffbeb', layout: 'single', fontFamily: "'Inter', sans-serif", headerStyle: 'minimal' },
  { id: 'minimal-3', name: 'Minimal Cool', category: 'Minimalist', primaryColor: '#164e63', secondaryColor: '#155e75', accentColor: '#0891b2', bgColor: '#f8fafc', textColor: '#1e293b', headerBg: '#f8fafc', layout: 'single', fontFamily: "'Inter', sans-serif", headerStyle: 'minimal' },
  { id: 'minimal-4', name: 'Minimal Rose', category: 'Minimalist', primaryColor: '#9f1239', secondaryColor: '#be123c', accentColor: '#f43f5e', bgColor: '#fff1f2', textColor: '#1e293b', headerBg: '#fff1f2', layout: 'single', fontFamily: "'Inter', sans-serif", headerStyle: 'minimal' },
  { id: 'minimal-5', name: 'Minimal Slate', category: 'Minimalist', primaryColor: '#334155', secondaryColor: '#475569', accentColor: '#64748b', bgColor: '#f1f5f9', textColor: '#0f172a', headerBg: '#f1f5f9', layout: 'single', fontFamily: "'Inter', sans-serif", headerStyle: 'minimal' },

  // Professional (5)
  { id: 'pro-1', name: 'Executive Blue', category: 'Professional', primaryColor: '#1e40af', secondaryColor: '#1e3a8a', accentColor: '#3b82f6', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#1e40af', layout: 'double', fontFamily: "'Georgia', serif", headerStyle: 'banner' },
  { id: 'pro-2', name: 'Executive Gray', category: 'Professional', primaryColor: '#374151', secondaryColor: '#1f2937', accentColor: '#4b5563', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#374151', layout: 'double', fontFamily: "'Georgia', serif", headerStyle: 'banner' },
  { id: 'pro-3', name: 'Executive Teal', category: 'Professional', primaryColor: '#115e59', secondaryColor: '#134e4a', accentColor: '#14b8a6', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#115e59', layout: 'double', fontFamily: "'Georgia', serif", headerStyle: 'banner' },
  { id: 'pro-4', name: 'Executive Plum', category: 'Professional', primaryColor: '#581c87', secondaryColor: '#4c1d95', accentColor: '#9333ea', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#581c87', layout: 'double', fontFamily: "'Georgia', serif", headerStyle: 'banner' },
  { id: 'pro-5', name: 'Executive Olive', category: 'Professional', primaryColor: '#3f6212', secondaryColor: '#365314', accentColor: '#65a30d', bgColor: '#ffffff', textColor: '#1e293b', headerBg: '#3f6212', layout: 'double', fontFamily: "'Georgia', serif", headerStyle: 'banner' },

  // Bold (5)
  { id: 'bold-1', name: 'Bold Fire', category: 'Bold', primaryColor: '#dc2626', secondaryColor: '#b91c1c', accentColor: '#f87171', bgColor: '#0f0f0f', textColor: '#f1f5f9', headerBg: 'linear-gradient(135deg, #dc2626, #f97316)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'gradient' },
  { id: 'bold-2', name: 'Bold Electric', category: 'Bold', primaryColor: '#2563eb', secondaryColor: '#1d4ed8', accentColor: '#60a5fa', bgColor: '#0a0a1a', textColor: '#e2e8f0', headerBg: 'linear-gradient(135deg, #2563eb, #7c3aed)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'gradient' },
  { id: 'bold-3', name: 'Bold Toxic', category: 'Bold', primaryColor: '#84cc16', secondaryColor: '#65a30d', accentColor: '#a3e635', bgColor: '#0a0f0a', textColor: '#e2e8f0', headerBg: 'linear-gradient(135deg, #84cc16, #22d3ee)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'gradient' },
  { id: 'bold-4', name: 'Bold Magenta', category: 'Bold', primaryColor: '#ec4899', secondaryColor: '#db2777', accentColor: '#f472b6', bgColor: '#0f0a12', textColor: '#e2e8f0', headerBg: 'linear-gradient(135deg, #ec4899, #8b5cf6)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'gradient' },
  { id: 'bold-5', name: 'Bold Gold', category: 'Bold', primaryColor: '#eab308', secondaryColor: '#ca8a04', accentColor: '#facc15', bgColor: '#0f0d08', textColor: '#e2e8f0', headerBg: 'linear-gradient(135deg, #eab308, #f97316)', layout: 'sidebar', fontFamily: "'Space Grotesk', sans-serif", headerStyle: 'gradient' },
];

export const templateCategories = ['Classic', 'Modern', 'Creative', 'Minimalist', 'Professional', 'Bold'];
