import { supabase, isSupabaseConfigured } from './supabase';

export interface AnalyticsEvent {
  event_type: string;
  event_data: Record<string, any>;
  user_id?: string;
  session_id?: string;
  timestamp: string;
}

export const analyticsService = {
  // Track an event
  async trackEvent(eventType: string, eventData: Record<string, any> = {}) {
    if (!isSupabaseConfigured) {
      console.log('Analytics not configured:', eventType, eventData);
      return;
    }

    const { data: { user } } = await supabase!.auth.getUser();
    
    const event: AnalyticsEvent = {
      event_type: eventType,
      event_data: eventData,
      user_id: user?.id,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase!
      .from('analytics_events')
      .insert(event);

    if (error) {
      console.error('Failed to track event:', error);
    }
  },

  // Track resume creation
  async trackResumeCreated(resumeId: string, templateId: string) {
    await this.trackEvent('resume_created', {
      resume_id: resumeId,
      template_id: templateId,
    });
  },

  // Track resume update
  async trackResumeUpdated(resumeId: string) {
    await this.trackEvent('resume_updated', {
      resume_id: resumeId,
    });
  },

  // Track PDF download
  async trackPDFDownload(resumeId: string) {
    await this.trackEvent('pdf_downloaded', {
      resume_id: resumeId,
    });
  },

  // Track template change
  async trackTemplateChanged(resumeId: string, fromTemplate: string, toTemplate: string) {
    await this.trackEvent('template_changed', {
      resume_id: resumeId,
      from_template: fromTemplate,
      to_template: toTemplate,
    });
  },

  // Track user session
  async trackSessionStart() {
    await this.trackEvent('session_start', {
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
    });
  },

  // Get user analytics
  async getUserAnalytics(userId: string) {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  },
};
