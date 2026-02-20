import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Download, Layout, Camera, Palette, ArrowRight, Check, User, LogOut, Upload, TrendingUp } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import ResumeUploader from '@/components/resume/SimpleUploader';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useState } from 'react';

const features = [
  { icon: Layout, title: '30+ Templates', desc: 'Professional, creative, and bold designs to match your style.' },
  { icon: Sparkles, title: 'AI-Powered', desc: 'Generate summaries and descriptions with smart AI assistance.' },
  { icon: Download, title: 'PDF Export', desc: 'Download your resume as a polished PDF in one click.' },
  { icon: Camera, title: 'Photo Upload', desc: 'Add a professional profile photo to stand out.' },
  { icon: Palette, title: 'Colorful Designs', desc: 'From minimalist to bold — find your perfect look.' },
  { icon: FileText, title: 'All Details', desc: 'Experience, education, skills, projects, certifications & more.' },
  { icon: Upload, title: 'Resume Parser', desc: 'Upload existing resume and get ATS-optimized version.' },
];

const steps = [
  { num: '01', title: 'Fill Your Details', desc: 'Enter your information across intuitive sections.' },
  { num: '02', title: 'Pick a Template', desc: 'Choose from 30 stunning templates across 6 categories.' },
  { num: '03', title: 'Download & Share', desc: 'Export as PDF and start landing interviews.' },
];

export default function Index() {
  const { user, signOut, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg gradient-text">Interactive Resume Builder</span>
          </div>
          <div className="flex gap-3">
            <Link to="/builder">
              <Button variant="gradient" size="sm" className="gap-1.5">
                Build Resume <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setShowUploader(true)} className="gap-1.5">
              <Upload className="w-4 h-4" />
              Upload Resume
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <User className="w-4 h-4" />
                  {user.email?.split('@')[0]}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)} className="gap-1.5">
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> AI-Powered Resume Builder
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Create{' '}
              <span className="gradient-text">Stunning Resumes</span>
              {' '}in Minutes
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              30+ beautiful templates, AI-generated summaries, and instant PDF download. 
              Build a resume that gets you noticed.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/builder">
                <Button variant="gradient" size="lg" className="gap-2 text-base px-8">
                  Start Building <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={() => setShowUploader(true)} className="gap-2 text-base px-8">
                <Upload className="w-5 h-5" />
                Upload Resume
              </Button>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything You Need</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Powerful features to create the perfect resume, no design skills required.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to your dream resume.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-5xl font-bold gradient-text mb-4">{s.num}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-3xl p-10 md:p-16 text-center text-primary-foreground"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Resume?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-md mx-auto">
              Join thousands of professionals creating stunning resumes with our builder.
            </p>
            <Link to="/builder">
              <Button size="lg" className="bg-card text-foreground hover:bg-card/90 text-base px-10 gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
              <FileText className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Interactive Resume Builder</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 All rights reserved.</p>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      {/* Resume Uploader Modal */}
      {showUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Upload & Parse Resume</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowUploader(false)}>
                <User className="w-4 h-4" />
              </Button>
            </div>
            <ErrorBoundary>
              <ResumeUploader />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
}
