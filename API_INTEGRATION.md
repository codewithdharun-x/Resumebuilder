# API Integration Guide

This document explains the API integration implemented in the Resume Builder application using Supabase.

## Overview

The application now includes a comprehensive API integration with the following features:
- User authentication (email/password and OAuth)
- Resume data storage and retrieval
- Analytics tracking
- Public resume sharing

## Setup Instructions

### 1. Supabase Project Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Enable the following authentication providers in Supabase Dashboard:
   - Email/Password (enabled by default)
   - Google OAuth (optional)

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

The required dependencies are already included in `package.json`:
- `@supabase/supabase-js`
- `@tanstack/react-query`

## API Services

### Authentication Service (`src/services/auth.ts`)

Handles user authentication operations:
- `signUp(email, password, name)` - Register new user
- `signIn(email, password)` - Login with email/password
- `signInWithGoogle()` - Login with Google OAuth
- `signOut()` - Logout current user
- `getCurrentUser()` - Get current authenticated user
- `resetPassword(email)` - Send password reset email
- `updatePassword(newPassword)` - Update user password

### Resume Service (`src/services/resume.ts`)

Manages resume data operations:
- `createResume(data)` - Save new resume
- `getUserResumes()` - Get all user's resumes
- `getResume(id)` - Get specific resume
- `updateResume(id, data)` - Update existing resume
- `deleteResume(id)` - Delete resume
- `duplicateResume(id, newTitle)` - Create copy of resume
- `generateShareUrl(id)` - Create public share link
- `getPublicResume(shareId)` - Access public resume
- `searchPublicResumes(query)` - Search public resumes

### Analytics Service (`src/services/analytics.ts`)

Tracks user behavior and application usage:
- `trackEvent(eventType, eventData)` - Track custom events
- `trackResumeCreated(resumeId, templateId)` - Track resume creation
- `trackResumeUpdated(resumeId)` - Track resume updates
- `trackPDFDownload(resumeId)` - Track PDF downloads
- `trackTemplateChanged(resumeId, from, to)` - Track template changes
- `trackSessionStart()` - Track user sessions

## React Context

### AuthContext (`src/contexts/AuthContext.tsx`)

Provides authentication state and methods throughout the app:
```tsx
const { user, loading, signIn, signUp, signOut } = useAuth();
```

### ResumeContext (Enhanced)

The existing ResumeContext is maintained and works with the API services for data persistence.

## Components

### AuthModal (`src/components/auth/AuthModal.tsx`)

Modal component for user authentication:
- Email/password sign in and sign up
- Google OAuth integration
- Form validation and error handling

### ResumeManager (`src/components/resume/ResumeManager.tsx`)

Component for managing saved resumes:
- List all user's resumes
- Load, duplicate, and delete resumes
- Save current resume with custom title
- Public sharing options

## Database Schema

### Tables

1. **user_profiles** - Extended user information
2. **resumes** - Resume data and metadata
3. **analytics_events** - User activity tracking
4. **resume_shares** - Public sharing tokens

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public resumes can be viewed by anyone
- Analytics data is isolated per user

## Usage Examples

### Saving a Resume

```tsx
const { resumeData, selectedTemplate } = useResume();

await resumeService.createResume({
  title: 'Software Developer Resume',
  resume_data: resumeData,
  template_config: selectedTemplate,
  is_public: false,
});
```

### Loading User Resumes

```tsx
const resumes = await resumeService.getUserResumes();
// resumes array contains all user's saved resumes
```

### Tracking Analytics

```tsx
import { analyticsService } from '@/services';

// Track resume creation
await analyticsService.trackResumeCreated(resumeId, templateId);

// Track PDF download
await analyticsService.trackPDFDownload(resumeId);
```

## API Endpoints

The application uses Supabase's auto-generated REST API endpoints. All requests are handled through the Supabase client library, which provides:

- Automatic authentication headers
- Real-time subscriptions
- Type-safe queries
- Built-in error handling

## Error Handling

All API services include comprehensive error handling:
- Network errors are caught and logged
- User-friendly error messages are displayed
- Loading states prevent duplicate requests
- Toast notifications inform users of actions

## Performance Optimizations

- React Query for caching and background refetching
- Indexed database queries for fast retrieval
- Lazy loading of resume data
- Optimistic updates for better UX

## Security Considerations

- All API requests require authentication
- RLS policies prevent data leakage
- Environment variables keep secrets secure
- Input validation on all user data
- CSRF protection via Supabase
