import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { 
  Menu, X, ChevronRight, Mail, Phone, MapPin, 
  ExternalLink, GraduationCap, Award, Download,
  Code, Layout, Database, Cloud, Cpu, Wrench, Brain, Settings,
  Users, Target, Lightbulb, MessageCircle, Compass, Clock
} from 'lucide-react';
import { 
  FaGithub, FaLinkedin, FaJava, FaPython, FaPhp, FaReact, 
  FaNodeJs, FaHtml5, FaCss3Alt, FaDocker, FaAws, FaGitAlt, 
  FaBootstrap, FaFigma 
} from 'react-icons/fa';
import { 
  SiJavascript, SiNextdotjs, SiTailwindcss, SiPostgresql, 
  SiSupabase, SiC, SiMysql, SiPrisma, SiVercel 
} from 'react-icons/si';

// Roles for the Typewriter Effect
const ROLES = ["Software Engineer Intern", "DevOps Engineer", "Full-Stack Developer"];

// Technical Skill Categories
const SKILL_CATEGORIES = [
  {
    title: "Programming Languages",
    icon: <Code size={20} className="text-cyan-400" />,
    skills: [
      { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" /> },
      { name: "Java", icon: <FaJava className="text-red-500" /> },
      { name: "Python", icon: <FaPython className="text-blue-500" /> },
      { name: "C Language", icon: <SiC className="text-slate-300" /> },
      { name: "PHP", icon: <FaPhp className="text-indigo-400" /> },
    ]
  },
  {
    title: "Frameworks",
    icon: <Cpu size={20} className="text-purple-400" />,
    skills: [
      { name: "ReactJS", icon: <FaReact className="text-cyan-400" /> },
      { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
      { name: "Node.js", icon: <FaNodeJs className="text-blue-500" /> },
    ]
  },
  {
    title: "Web Technologies",
    icon: <Layout size={20} className="text-pink-400" />,
    skills: [
      { name: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
      { name: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
      { name: "Bootstrap", icon: <FaBootstrap className="text-purple-500" /> },
    ]
  },
  {
    title: "Database Management",
    icon: <Database size={20} className="text-emerald-400" />,
    skills: [
      { name: "MySQL", icon: <SiMysql className="text-blue-500" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-400" /> },
      { name: "Supabase", icon: <SiSupabase className="text-blue-500" /> },
    ]
  },
  {
    title: "Design Tools",
    icon: <Brain size={20} className="text-rose-400" />,
    skills: [
      { name: "Figma", icon: <FaFigma className="text-pink-500" /> },
    ]
  },
  {
    title: "Version Control",
    icon: <Settings size={20} className="text-slate-400" />,
    skills: [
      { name: "Git", icon: <FaGitAlt className="text-red-500" /> },
      { name: "GitHub", icon: <FaGithub className="text-white" /> },
    ]
  },
  {
    title: "Cloud & DevOps",
    icon: <Cloud size={20} className="text-orange-400" />,
    skills: [
      { name: "Docker", icon: <FaDocker className="text-blue-500" /> },
      { name: "AWS", icon: <FaAws className="text-orange-400" /> },
    ]
  }
];

// Soft Skills
const SOFT_SKILLS = [
  { name: "Teamwork", icon: <Users size={20} className="text-blue-400" /> },
  { name: "Leadership", icon: <Target size={20} className="text-purple-400" /> },
  { name: "Problem Solving", icon: <Lightbulb size={20} className="text-yellow-400" /> },
  { name: "Clear Communication", icon: <MessageCircle size={20} className="text-blue-400" /> },
  { name: "Critical Thinking", icon: <Brain size={20} className="text-pink-400" /> },
  { name: "Adaptability", icon: <Compass size={20} className="text-cyan-400" /> },
  { name: "Time Management", icon: <Clock size={20} className="text-orange-400" /> },
];

export default function Portfolio() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [formStatus, setFormStatus] = useState({ submitted: false, submitting: false });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);

  // Typewriter Logic
  useEffect(() => {
    const i = loopNum % ROLES.length;
    const fullText = ROLES[i];

    const timer = setTimeout(() => {
      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );
      
      setTypingSpeed(isDeleting ? 50 : 120);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); 
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); 
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'education', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false });
    setTimeout(() => {
      setFormStatus({ submitting: false, submitted: true });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus({ submitting: false, submitted: false }), 5000);
    }, 1200);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];


  // 1. Set up state to hold your dynamic projects
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // 2. Fetch data from Supabase when the page loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch all projects, ordering them by newest first
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        if (data) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);
  

  return (
    <div className="min-h-screen bg-[#060913] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-hidden relative">
      
      {/* Abstract Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[30rem] h-[30rem] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#060913]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="text-2xl font-black tracking-tighter text-white flex items-center gap-3 group">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              PD
            </div> */}
            Pramodika Dulanja
          </a>

          <nav className="hidden md:flex items-center gap-10">
            <ul className="flex gap-8">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className={`text-sm font-semibold tracking-wide transition-all duration-300 hover:text-cyan-400 ${activeSection === link.id ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
              Get in Touch
            </a>
          </nav>

          <button className="md:hidden text-slate-300 hover:text-white transition-colors p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#060913]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl md:hidden">
            <ul className="flex flex-col px-6 py-4">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className="block py-4 text-slate-300 hover:text-cyan-400 font-semibold border-b border-white/5">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section id="home" className="pt-32 pb-20 md:pt-56 md:pb-32 px-6 max-w-6xl mx-auto min-h-[100vh] flex items-center">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-16 w-full">
            <div className="md:w-[55%] text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-cyan-400 font-semibold text-xs tracking-wider uppercase h-4 leading-4 flex items-center">
                  <span>{text}</span>
                  <span className="border-r-2 border-cyan-400 animate-pulse ml-0.5 h-3 inline-block"></span>
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] mb-6">
                Hello, I'm <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                  Pramodika Dulanja.
                </span>
              </h1>
              <h2 className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-10 max-w-2xl mx-auto md:mx-0">
                Results-driven Computing & Information Systems undergraduate engineering robust full-stack applications and automated, scalable DevOps infrastructure.
              </h2>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                  View My Work <ChevronRight size={18} strokeWidth={3} />
                </a>
                <a href="/Pramodika_Dulanja_CV.pdf" download="Bodipala_Dulanja_CV.pdf" className="px-7 py-3.5 bg-white/[0.03] border border-white/10 text-white font-bold rounded-xl hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 backdrop-blur-md">
                  <Download size={18} className="text-cyan-400" /> Download CV
                </a>
                <a href="https://www.linkedin.com/in/pramodika-dulanja-a65864369/" target="_blank" rel="noopener noreferrer" className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.08] hover:text-cyan-400 transition-all duration-300 flex items-center justify-center group hover:-translate-y-1 backdrop-blur-md">
                  <FaLinkedin size={22} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
                </a>
              </div>
            </div>
            
            <div className="md:w-[45%] flex justify-center md:justify-end">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-500 animate-pulse"></div>
                <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border border-white/10 overflow-hidden shadow-2xl bg-[#060913] p-2">
                  <img src="/images/profile.jpg" alt="Pramodika Dulanja" className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Bodipala+Dulanja&size=512&background=0a0a0a&color=22d3ee' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-32 relative">
          <div className="absolute inset-0 bg-slate-900/20 border-y border-white/5"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-12 gap-16 items-start">
              <div className="md:col-span-5">
                <p className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">Introduction</p>
                <h2 className="text-4xl font-black text-white mb-6 leading-tight">Engineering Solutions Through Clean Code.</h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"></div>
              </div>
              <div className="md:col-span-7 text-lg text-slate-400 font-medium leading-relaxed space-y-6">
                <p className="text-slate-300">
                  I am a motivated undergraduate pursuing a Bachelor of Science (Honours) in Computing and Information Systems at the Sabaragamuwa University of Sri Lanka. My focus bridges technical rigor with the strategic scalability of DevOps engineering.
                </p>
                <p>
                  Skilled in teamwork, problem-solving, and developing innovative solutions through real-world projects. I maintain a strong foundation in modern web technologies, database management, and cloud infrastructures, allowing me to build end-to-end full-stack applications.
                </p>
                <p>
                  I am committed to continuous learning, exploring emerging AI technologies, and growing as a forward-thinking software developer.
                </p>
                
                <div className="pt-6 flex gap-4">
                  <a href="https://github.com/PramodikaDulanja" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 hover:border-cyan-500/50 hover:-translate-y-1 transition-all">
                    <FaGithub size={24} />
                  </a>
                  <a href="https://www.linkedin.com/in/pramodika-dulanja-a65864369/" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-white/10 hover:border-cyan-500/50 hover:-translate-y-1 transition-all">
                    <FaLinkedin size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION & CERTS SECTION */}
        <section id="education" className="py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-20">
              
              <div>
                <p className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">Background</p>
                <h2 className="text-4xl font-black text-white mb-10">Education</h2>
                
                <div className="space-y-0 relative border-l border-white/10 ml-4">
                  <div className="relative pl-10 pb-12 group">
                    <div className="absolute top-0 -left-[17px] w-8 h-8 bg-[#060913] border-2 border-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                      <GraduationCap size={14} className="text-cyan-400" />
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-7 transition-all hover:bg-white/[0.04]">
                      <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase mb-2 block">2024 - Present</span>
                      <h3 className="text-xl font-bold text-white mb-2">BSc. (Hons) in Computing & Information Systems</h3>
                      <h4 className="text-md text-slate-400 font-medium">Sabaragamuwa University of Sri Lanka</h4>
                    </div>
                  </div>

                  <div className="relative pl-10 group">
                    <div className="absolute top-0 -left-[17px] w-8 h-8 bg-[#060913] border-2 border-slate-700 rounded-full flex items-center justify-center group-hover:border-cyan-500 transition-colors">
                      <GraduationCap size={14} className="text-slate-400 group-hover:text-cyan-400" />
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 hover:border-slate-600 rounded-2xl p-7 transition-all">
                      <span className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2 block">2022</span>
                      <h3 className="text-xl font-bold text-white mb-2">G.C.E A/L - Physical Science Stream</h3>
                      <h4 className="text-md text-slate-400 font-medium">Ananda Maithreya Central College, Balangoda</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">Achievements</p>
                <h2 className="text-4xl font-black text-white mb-10">Certifications</h2>

                <div className="space-y-5">
                  {[
                    { title: 'Innovate With Ballerina', issuer: 'IEEE Student Branch UoM & WSO2' },
                    { title: 'Web Design for Beginners', issuer: 'University of Moratuwa' },
                    { title: 'Advanced Java Programming', issuer: 'Sabaragamuwa University of Sri Lanka' }
                  ].map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-6 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] p-5 rounded-2xl transition-all group hover:-translate-y-1">
                      <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Award size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg text-white font-bold mb-1">{cert.title}</h4>
                        <p className="text-sm text-slate-400 font-medium">{cert.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-24 relative">
          <div className="absolute inset-0 bg-slate-900/20 border-y border-white/5"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-40">
            <div className="text-center mb-16">
              <p className="text-cyan-400 font-bold tracking-widest uppercase text-xs mb-2">Proficiency</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Technical Arsenal</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {SKILL_CATEGORIES.map((category, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 hover:bg-white/[0.04] backdrop-blur-md transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5 bg-[#060913]/80 border border-white/10 px-3 py-1.5 rounded-md hover:border-cyan-500/50 transition-colors cursor-default">
                        {skill.icon}
                        <span className="text-xs font-semibold text-slate-300">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Soft Skills Section */}
            <div className="mt-28">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-black text-white mb-4">Professional Attributes</h3>
                <p className="text-slate-400 font-medium">Core competencies driving effective collaboration and project success.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                {SOFT_SKILLS.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 px-6 py-4 rounded-2xl hover:bg-white/[0.04] transition-all group hover:-translate-y-1">
                    <div className="p-2 bg-[#060913] rounded-lg border border-white/10 group-hover:border-cyan-500/50 transition-colors shadow-inner">
                      {skill.icon}
                    </div>
                    <span className="text-slate-200 font-semibold">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 relative z-40">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center md:text-left mb-16">
              <p className="text-cyan-400 font-bold tracking-widest uppercase text-xs mb-2">Portfolio</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Featured Projects</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mx-auto md:mx-0"></div>
            </div>

            {/* Dynamic Projects Grid */}
            <div className="grid md:grid-cols-3 gap-8"> 
              {loadingProjects ? (
                <div className="col-span-3 text-center text-cyan-400 py-12 font-bold animate-pulse">Loading database...</div>
              ) : projects.length === 0 ? (
                <div className="col-span-3 text-center text-slate-500 py-12 font-medium">No projects published yet. Log into the admin dashboard to add some!</div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500 flex flex-col group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/10">
                    
                    {/* Project Image */}
                    <div className="h-48 bg-[#060913] relative overflow-hidden border-b border-white/5">
                      <div className="absolute inset-0 bg-cyan-500/20 group-hover:opacity-0 transition-opacity z-10 mix-blend-overlay"></div>
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=800' }} 
                      />
                    </div>

                    {/* Project Info */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-extrabold text-white">{project.title}</h3>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-5">
                          {project.description}
                        </p>
                      </div>

                      <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags && project.tags.map((tag, index) => (
                             <span key={index} className="px-2.5 py-1 bg-[#060913]/80 text-slate-300 border border-white/10 text-[11px] font-bold rounded-md">
                               {tag}
                             </span>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="flex gap-3 relative z-50">
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noreferrer" className="flex-1 text-center py-2.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"><FaGithub size={16} />
                              Code
                            </a>
                          )}
                          {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noreferrer" className="flex-1 text-center py-2.5 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-1.5"><ExternalLink size={16} />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-32 relative">
          <div className="absolute inset-0 bg-slate-900/20 border-t border-white/5"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20">
              
              <div>
                <p className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">Connect</p>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Let's Build Something.</h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mb-10"></div>
                <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12">
                  I am currently open to new opportunities, collaborations, and discussions regarding software engineering and systems architecture.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-colors group">
                    <div className="w-14 h-14 bg-[#060913] border border-white/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg"><Mail size={24} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                      <p className="text-lg text-white font-bold tracking-wide">dulanjapramodika@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-colors group">
                    <div className="w-14 h-14 bg-[#060913] border border-white/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg"><Phone size={24} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-lg text-white font-bold tracking-wide">+94 71 286 6339</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-colors group">
                    <div className="w-14 h-14 bg-[#060913] border border-white/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg"><MapPin size={24} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</p>
                      <p className="text-lg text-white font-bold tracking-wide">Balangoda, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-[#060913]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                {formStatus.submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 relative z-10">
                    <div className="w-20 h-20 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Message Sent</h3>
                    <p className="text-slate-400 text-lg font-medium">Thank you for reaching out. I will respond to your inquiry promptly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                      <input 
                        type="text" id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all placeholder:text-slate-600 shadow-inner"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
                      <input 
                        type="email" id="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all placeholder:text-slate-600 shadow-inner"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-slate-300 mb-2">Message</label>
                      <textarea 
                        id="message" rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all resize-none placeholder:text-slate-600 shadow-inner"
                        placeholder="How can we collaborate?"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" disabled={formStatus.submitting}
                      className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                      {formStatus.submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#060913] text-slate-500 py-10 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-semibold tracking-wide">
            &copy; {new Date().getFullYear()} Pramodika Dulanja. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="https://github.com/PramodikaDulanja" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-lg hover:bg-white/10 hover:text-white transition-all">
              <FaGithub size={20} />
            </a>
            <a href="https://www.linkedin.com/in/pramodika-dulanja-a65864369/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-lg hover:bg-white/10 hover:text-cyan-400 transition-all">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );}
