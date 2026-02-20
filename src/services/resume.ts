import { supabase, isSupabaseConfigured } from './supabase';
import { ResumeData, TemplateConfig } from '@/types/resume';

export interface SavedResume {
  id: string;
  user_id: string;
  title: string;
  resume_data: ResumeData;
  template_config: TemplateConfig;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  share_url?: string;
}

export interface CreateResumeData {
  title: string;
  resume_data: ResumeData;
  template_config: TemplateConfig;
  is_public?: boolean;
}

export const resumeService = {
  // Create a new resume
  async createResume(data: CreateResumeData): Promise<SavedResume> {
    if (!isSupabaseConfigured) {
      throw new Error('Database not configured. Please set up Supabase environment variables.');
    }

    const { data: { user } } = await supabase!.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: resume, error } = await supabase!
      .from('resumes')
      .insert({
        user_id: user.id,
        title: data.title,
        resume_data: data.resume_data,
        template_config: data.template_config,
        is_public: data.is_public || false,
      })
      .select()
      .single();

    if (error) throw error;
    return resume;
  },

  // Get all resumes for the current user
  async getUserResumes(): Promise<SavedResume[]> {
    if (!isSupabaseConfigured) {
      return [];
    }

    const { data: { user } } = await supabase!.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase!
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a specific resume by ID
  async getResume(id: string): Promise<SavedResume> {
    if (!isSupabaseConfigured) {
      throw new Error('Database not configured. Please set up Supabase environment variables.');
    }

    const { data, error } = await supabase!
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a resume
  async updateResume(id: string, data: Partial<CreateResumeData>): Promise<SavedResume> {
    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.resume_data) updateData.resume_data = data.resume_data;
    if (data.template_config) updateData.template_config = data.template_config;
    if (data.is_public !== undefined) updateData.is_public = data.is_public;

    const { data: resume, error } = await supabase
      .from('resumes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return resume;
  },

  // Delete a resume
  async deleteResume(id: string): Promise<void> {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Duplicate a resume
  async duplicateResume(id: string, newTitle?: string): Promise<SavedResume> {
    const originalResume = await this.getResume(id);
    
    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        user_id: originalResume.user_id,
        title: newTitle || `${originalResume.title} (Copy)`,
        resume_data: originalResume.resume_data,
        template_config: originalResume.template_config,
        is_public: false,
      })
      .select()
      .single();

    if (error) throw error;
    return resume;
  },

  // Generate share URL for public resume
  async generateShareUrl(id: string): Promise<string> {
    const shareUrl = `${window.location.origin}/shared/${id}`;
    
    await this.updateResume(id, { is_public: true });
    
    const { error } = await supabase
      .from('resumes')
      .update({ share_url: shareUrl })
      .eq('id', id);

    if (error) throw error;
    return shareUrl;
  },

  // Get public resume by share URL
  async getPublicResume(shareId: string): Promise<SavedResume> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('share_url', `${window.location.origin}/shared/${shareId}`)
      .eq('is_public', true)
      .single();

    if (error) throw error;
    return data;
  },

  // Search public resumes
  async searchPublicResumes(query: string): Promise<SavedResume[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('is_public', true)
      .ilike('title', `%${query}%`)
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  },
};
