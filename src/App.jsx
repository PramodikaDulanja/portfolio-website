import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, Mail, Phone, MapPin, 
  ExternalLink, GraduationCap, Award, Download,
  Code, Layout, Database, Cloud, Cpu, Wrench, Brain, Settings
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

// Skill Categories matching the new UI layout
const SKILL_CATEGORIES = [
  {
    title: "Programming Languages",
    icon: <Code size={18} className="text-blue-400" />,
    skills: [
      { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" /> },
      { name: "Python", icon: <FaPython className="text-blue-500" /> },
      { name: "Java", icon: <FaJava className="text-red-500" /> },
      { name: "C Language", icon: <SiC className="text-slate-300" /> },
      { name: "PHP", icon: <FaPhp className="text-indigo-400" /> },
    ]
  },
  {
    title: "Frontend Development",
    icon: <Layout size={18} className="text-purple-400" />,
    skills: [
      { name: "React.js", icon: <FaReact className="text-cyan-400" /> },
      { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-400" /> },
      { name: "HTML5", icon: <FaHtml5 className="text-orange-500" /> },
      { name: "CSS3", icon: <FaCss3Alt className="text-blue-500" /> },
      { name: "Bootstrap", icon: <FaBootstrap className="text-purple-500" /> },
    ]
  },
  {
    title: "Backend & Databases",
    icon: <Database size={18} className="text-emerald-400" />,
    skills: [
      { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-400" /> },
      { name: "MySQL", icon: <SiMysql className="text-blue-500" /> },
      { name: "Supabase", icon: <SiSupabase className="text-green-500" /> },
      { name: "Prisma ORM", icon: <SiPrisma className="text-white" /> },
    ]
  },
  {
    title: "Cloud & DevOps",
    icon: <Cloud size={18} className="text-orange-400" />,
    skills: [
      { name: "Docker", icon: <FaDocker className="text-blue-500" /> },
      { name: "AWS", icon: <FaAws className="text-orange-400" /> },
      { name: "CI/CD Pipelines", icon: <Settings className="text-slate-400" /> },
      { name: "Vercel", icon: <SiVercel className="text-white" /> },
    ]
  },

  {
    title: "Development Tools",
    icon: <Wrench size={18} className="text-cyan-400" />,
    skills: [
      { name: "Git", icon: <FaGitAlt className="text-red-500" /> },
      { name: "GitHub", icon: <FaGithub className="text-white" /> },
      { name: "VS Code", icon: <Code className="text-blue-500" /> },
      { name: "Figma", icon: <FaFigma className="text-pink-500" /> },
    ]
  }
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center text-sm shadow-md">PD</span>
            Pramodika Dulanja
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className={`text-sm font-medium transition-colors hover:text-blue-400 ${activeSection === link.id ? 'text-blue-500' : 'text-slate-400'}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
              Get in Touch
            </a>
          </nav>

          <button className="md:hidden text-slate-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-slate-800 shadow-xl md:hidden">
            <ul className="flex flex-col px-6 py-4">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className="block py-3 text-slate-400 hover:text-blue-400 font-medium border-b border-slate-800/50">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-6xl mx-auto min-h-[90vh] flex items-center">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 w-full">
            <div className="md:w-3/5 text-center md:text-left">
              <div className="text-blue-500 font-medium mb-4 tracking-wide text-sm uppercase flex items-center justify-center md:justify-start gap-2 h-6">
                <span className="w-8 h-[2px] bg-blue-500 inline-block"></span> 
                <span>{text}</span>
                <span className="border-r-2 border-blue-500 animate-pulse ml-0.5 h-4 inline-block"></span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                Hello, I'm <br className="hidden md:block"/> Pramodika Dulanja.
              </h1>
              <h2 className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed mb-10">
                Results-driven Computing & Information Systems undergraduate passionate about full-stack development and automated, scalable DevOps infrastructure.
              </h2>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                  View My Work <ChevronRight size={18} />
                </a>
                <a href="/22CIS0294_Dulanja.pdf" download="Bodipala_Dulanja_CV.pdf" className="px-6 py-3 bg-slate-900 text-slate-300 border border-slate-700 font-medium rounded hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2">
                  <Download size={18} className="text-blue-500" /> Download CV
                </a>
                <a href="https://www.linkedin.com/in/pramodika-dulanja-a65864369/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 text-slate-300 border border-slate-700 rounded hover:bg-slate-800 hover:text-blue-500 transition-colors flex items-center justify-center">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
            
            <div className="md:w-2/5 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-slate-800 overflow-hidden shadow-2xl shadow-blue-900/20">
                <img src="/images/profile.jpg" alt="Pramodika Dulanja" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Bodipala+Dulanja&size=512&background=0f172a&color=3b82f6' }} />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-24 bg-slate-900 border-y border-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4">
                <h2 className="text-3xl font-bold text-white mb-2">About Me</h2>
                <div className="w-12 h-1 bg-blue-500 rounded mb-6"></div>
              </div>
              <div className="md:col-span-8 text-lg text-slate-400 font-light leading-relaxed space-y-6">
                <p>I am a motivated undergraduate student pursuing a Bachelor of Science (Honours) in Computing and Information Systems at the Sabaragamuwa University of Sri Lanka. My academic and professional focus bridges the technical rigor of software development with the strategic scalability of DevOps engineering.</p>
                <p>Skilled in teamwork, problem-solving, and developing innovative solutions through real-world projects. I have a strong foundation in modern web technologies, database management, and cloud infrastructures, allowing me to build comprehensive full-stack applications.</p>
                <p>I am a strong communicator with a keen design sense, committed to continuous learning, exploring emerging technologies, and growing as a forward-thinking software developer.</p>
                
                <div className="pt-6 flex gap-4">
                  <a href="https://github.com/PramodikaDulanja" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                    <FaGithub size={22} />
                  </a>
                  <a href="https://www.linkedin.com/in/pramodika-dulanja-a65864369/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors">
                    <FaLinkedin size={22} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="education" className="py-24 bg-slate-950">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Education</h2>
                <div className="w-12 h-1 bg-blue-500 rounded mb-10"></div>
                <div className="space-y-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-slate-950 border border-slate-800 text-blue-500 rounded mt-1"><GraduationCap size={20} /></div>
                      <div>
                        <h3 className="text-lg font-bold text-white">BSc. (Hons) in Computing & Information Systems</h3>
                        <h4 className="text-md text-slate-400 mb-2">Sabaragamuwa University of Sri Lanka</h4>
                        <p className="text-xs font-medium text-blue-500 bg-blue-500/10 inline-block px-2 py-1 rounded">2024 - Present</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-600"></div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-slate-950 border border-slate-800 text-slate-400 rounded mt-1"><GraduationCap size={20} /></div>
                      <div>
                        <h3 className="text-lg font-bold text-white">G.C.E Advanced Level - Physical Science Stream</h3>
                        <h4 className="text-md text-slate-400 mb-2">Ananda Maithreya Central College, Balangoda</h4>
                        <p className="text-xs font-medium text-slate-400 bg-slate-800 inline-block px-2 py-1 rounded">2022</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Certifications</h2>
                <div className="w-12 h-1 bg-blue-500 rounded mb-10"></div>
                <div className="space-y-4">
                  {[
                    { title: 'Innovate With Ballerina', issuer: 'IEEE Student Branch UoM & WSO2' },
                    { title: 'Web Design for Beginners', issuer: 'University of Moratuwa' },
                    { title: 'Advanced Java Programming', issuer: 'Sabaragamuwa University of Sri Lanka' }
                  ].map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-lg">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-full"><Award size={20} /></div>
                      <div>
                        <h4 className="text-white font-medium">{cert.title}</h4>
                        <p className="text-sm text-slate-400">{cert.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-24 bg-slate-900 border-y border-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Technical Arsenal</h2>
            <div className="w-12 h-1 bg-blue-500 rounded mb-16 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKILL_CATEGORIES.map((category, idx) => (
                <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors shadow-lg shadow-black/20">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800/80">
                    {category.icon}
                    <h3 className="text-lg font-semibold text-slate-200">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-full hover:border-slate-600 transition-colors">
                        {skill.icon}
                        <span className="text-sm font-medium text-slate-300">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="py-24 bg-slate-950">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-2 text-center md:text-left">Featured Projects</h2>
            <div className="w-12 h-1 bg-blue-500 rounded mb-16 mx-auto md:mx-0"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col group">
                <div className="h-64 bg-slate-800 relative overflow-hidden">
                  <img src="/images/illamu-project.jpg" alt="Illamu.lk Platform" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=800' }} />
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Illamu.lk - Rental Marketplace</h3>
                    <p className="text-blue-500 text-sm font-medium mb-4">Individual Project</p>
                    <p className="text-slate-400 leading-relaxed font-light text-sm mb-6">A comprehensive peer-to-peer and business rental marketplace. Features user authentication, server-side database integrations with PostgreSQL via Prisma, and environment configurations for seamless deployment.</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">Next.js</span>
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">Supabase</span>
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">Prisma</span>
                    </div>
                    <div className="flex gap-4">
                      <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"><FaGithub size={16} /> GitHub</a>
                      <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"><ExternalLink size={16} /> Live Demo</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col group">
                <div className="h-64 bg-slate-800 relative overflow-hidden">
                  <img src="/images/volleyreel.png" alt="VolleyReel Analytics" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599058917212-97d142f155dc?auto=format&fit=crop&q=80&w=800' }} />
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">VolleyReel Analytics Platform</h3>
                    <p className="text-blue-500 text-sm font-medium mb-4">Group Project</p>
                    <p className="text-slate-400 leading-relaxed font-light text-sm mb-6">An AI-assisted platform generating automated highlight reels. Built a human-in-the-loop segmentation engine using FFmpeg, OpenAI Whisper, and Librosa for audio signal processing to detect referee whistles.</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">Python</span>
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">FastAPI</span>
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">React.js</span>
                    </div>
                    <div className="flex gap-4">
                      <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"><FaGithub size={16} /> GitHub</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col group">
                <div className="h-64 bg-slate-800 relative overflow-hidden">
                  <img src="/images/scanner.jpg" alt="World Item Scanner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800' }} />
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">World Item Scanner</h3>
                    <p className="text-blue-500 text-sm font-medium mb-4">Ongoing Individual Project</p>
                    <p className="text-slate-400 leading-relaxed font-light text-sm mb-6">Global visual intelligence sourcing hub utilizing Multimodal AI and reverse image search APIs. Engineered a FastAPI backend with web-scraping pipelines for real-time market data retrieval and price comparison.</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">Next.js</span>
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">Multimodal AI</span>
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">Python</span>
                    </div>
                    <div className="flex gap-4">
                      <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"><FaGithub size={16} /> GitHub</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col group">
                <div className="h-64 bg-slate-800 relative overflow-hidden">
                  <img src="/images/delish web.png" alt="Delish Food Restaurant" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800' }} />
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Delish Food Restaurant</h3>
                    <p className="text-blue-500 text-sm font-medium mb-4">Static Web Development</p>
                    <p className="text-slate-400 leading-relaxed font-light text-sm mb-6">A responsive restaurant website with an attractive and user-friendly interface for browsing menus. Deployed on Vercel ensuring reliable and accessible hosting with smooth interactive JavaScript features.</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">HTML5</span>
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">CSS3</span>
                      <span className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-full">JavaScript</span>
                    </div>
                    <div className="flex gap-4">
                      <a href="https://github.com/PramodikaDulanja/DELISH-Food-Restaurant-Website" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"><FaGithub size={16} /> GitHub</a>
                      <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"><ExternalLink size={16} /> Live Demo</a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="contact" className="py-24 bg-slate-900 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
                <div className="w-12 h-1 bg-blue-500 rounded mb-8"></div>
                <p className="text-slate-400 font-light leading-relaxed mb-10">I am currently open to new opportunities, collaborations, and discussions regarding software engineering and systems architecture. Please feel free to reach out.</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded flex items-center justify-center text-blue-500 shadow-md"><Mail size={20} /></div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Email</p>
                      <p className="text-white font-medium">dulanjapramodika@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded flex items-center justify-center text-blue-500 shadow-md"><Phone size={20} /></div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Phone</p>
                      <p className="text-white font-medium">+94 71 286 6339</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded flex items-center justify-center text-blue-500 shadow-md"><MapPin size={20} /></div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Location</p>
                      <p className="text-white font-medium">Balangoda, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-8 shadow-xl">
                {formStatus.submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4 border border-blue-500/20"><CheckCircle size={32} /></div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent</h3>
                    <p className="text-slate-400">Thank you for reaching out. I will respond to your inquiry promptly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                      <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-600" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                      <input type="email" id="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-600" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                      <textarea id="message" rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none placeholder:text-slate-600" placeholder="How can we collaborate?"></textarea>
                    </div>
                    <button type="submit" disabled={formStatus.submitting} className="w-full py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20">
                      {formStatus.submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-500 py-8 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Bodipala Dulanja. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://github.com/PramodikaDulanja" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FaGithub size={18} /></a>
            <a href="https://www.linkedin.com/in/pramodika-dulanja-a65864369/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FaLinkedin size={18} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
