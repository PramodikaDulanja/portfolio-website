import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import {
  LayoutDashboard, FolderKanban, Award, LogOut, Plus, Search, ExternalLink,
  Code, Globe, Pencil, Trash2, X, Save, UploadCloud, Image as ImageIcon,
  CheckCircle, AlertCircle, Loader, ArrowUpRight, Layers, Calendar,
  ChevronRight, RefreshCw
} from "lucide-react";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#060913] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:bg-white/5";
const labelClass = "text-sm font-bold text-slate-300";
const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)] transition hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] disabled:cursor-not-allowed disabled:opacity-60";
const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white";

const emptyProject = {
  title: "", description: "", projectType: "Individual", tags: "",
  githubUrl: "", demoUrl: "", imageFile: null
};
const emptyCertificate = {
  title: "", issuer: "", date: "", imageFile: null
};

function StatCard({ icon: Icon, label, value, hint, tone = "cyan" }) {
  const tones = {
    cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  };
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-sm hover:bg-white/[0.04] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#060913] border border-white/10 text-slate-400">
        <Icon size={23} />
      </div>
      <h3 className="mt-4 font-bold text-white">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [uploading, setUploading] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [certificateSearch, setCertificateSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [certificateForm, setCertificateForm] = useState(emptyCertificate);
  const [projectImagePreview, setProjectImagePreview] = useState("");
  const [certificateImagePreview, setCertificateImagePreview] = useState("");

  const notify = (type, text) => {
    setStatusMessage({ type, text });
    if (typeof window !== "undefined") {
      window.clearTimeout(window.__portfolioAdminMessageTimer);
      window.__portfolioAdminMessageTimer = window.setTimeout(
        () => setStatusMessage({ type: "", text: "" }), 4500
      );
    }
  };

  const loadData = async () => {
    const [projectResult, certificateResult] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("certificates").select("*").order("created_at", { ascending: false })
    ]);
    if (projectResult.error) throw projectResult.error;
    if (certificateResult.error) throw certificateResult.error;
    setProjects(projectResult.data || []);
    setCertificates(certificateResult.data || []);
  };

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) {
          navigate("/admin");
          return;
        }
        if (!active) return;
        setIsAuthenticated(true);
        await loadData();
      } catch (error) {
        console.error("Unable to initialize admin dashboard:", error);
        if (active) notify("error", error.message || "Could not load dashboard data.");
      } finally {
        if (active) setLoading(false);
      }
    };
    initialize();
    return () => { active = false; };
  }, [navigate]);

  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) =>
      [project.title, project.description, project.project_type, ...(project.tags || [])]
        .filter(Boolean).join(" ").toLowerCase().includes(query)
    );
  }, [projects, projectSearch]);

  const filteredCertificates = useMemo(() => {
    const query = certificateSearch.trim().toLowerCase();
    if (!query) return certificates;
    return certificates.filter((cert) =>
      [cert.title, cert.issuer, cert.date].filter(Boolean).join(" ").toLowerCase().includes(query)
    );
  }, [certificates, certificateSearch]);

  const updateProjectField = (field, value) =>
    setProjectForm((current) => ({ ...current, [field]: value }));
  const updateCertificateField = (field, value) =>
    setCertificateForm((current) => ({ ...current, [field]: value }));

  const resetProjectForm = () => {
    setEditingId(null);
    setProjectForm(emptyProject);
    setProjectImagePreview("");
  };
  const resetCertificateForm = () => {
    setEditingCertId(null);
    setCertificateForm(emptyCertificate);
    setCertificateImagePreview("");
  };

  const startProjectEdit = (project) => {
    setEditingId(project.id);
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      projectType: project.project_type || "Individual",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
      githubUrl: project.github_url || "",
      demoUrl: project.demo_url || "",
      imageFile: null
    });
    setProjectImagePreview(project.image_url || "");
    setActiveTab("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startCertificateEdit = (cert) => {
    setEditingCertId(cert.id);
    setCertificateForm({
      title: cert.title || "", issuer: cert.issuer || "",
      date: cert.date || "", imageFile: null
    });
    setCertificateImagePreview(cert.image_url || "");
    setActiveTab("certificates");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async (file, folder) => {
    if (!file) return null;
    if (!file.type.startsWith("image/")) throw new Error("Please choose a valid image file.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const filePath = `${folder}/${uniqueId}.${extension}`;
    const { error } = await supabase.storage.from("portfolio-images").upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from("portfolio-images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    setStatusMessage({ type: "", text: "" });
    try {
      if (!editingId && !projectForm.imageFile) throw new Error("Please add a project cover image.");
      const imageUrl = await uploadImage(projectForm.imageFile, "project-images");
      const projectData = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        project_type: projectForm.projectType,
        tags: projectForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        github_url: projectForm.githubUrl.trim(),
        demo_url: projectForm.demoUrl.trim(),
        ...(imageUrl ? { image_url: imageUrl } : {})
      };
      if (editingId) {
        const { error } = await supabase.from("projects").update(projectData).eq("id", editingId);
        if (error) throw error;
        notify("success", "Project updated successfully.");
      } else {
        const { error } = await supabase.from("projects").insert([projectData]);
        if (error) throw error;
        notify("success", "Project published successfully.");
      }
      resetProjectForm();
      await loadData();
    } catch (error) {
      notify("error", error.message || "Unable to save project.");
    } finally {
      setUploading(false);
    }
  };

  const handleCertificateSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    setStatusMessage({ type: "", text: "" });
    try {
      const imageUrl = await uploadImage(certificateForm.imageFile, "certificate-images");
      const certificateData = {
        title: certificateForm.title.trim(),
        issuer: certificateForm.issuer.trim(),
        date: certificateForm.date.trim(),
        ...(imageUrl ? { image_url: imageUrl } : {})
      };
      if (editingCertId) {
        const { error } = await supabase.from("certificates").update(certificateData).eq("id", editingCertId);
        if (error) throw error;
        notify("success", "Certificate updated successfully.");
      } else {
        const { error } = await supabase.from("certificates").insert([certificateData]);
        if (error) throw error;
        notify("success", "Certificate added successfully.");
      }
      resetCertificateForm();
      await loadData();
    } catch (error) {
      notify("error", error.message || "Unable to save certificate.");
    } finally {
      setUploading(false);
    }
  };

  const deleteRecord = async (table, id, label) => {
    if (!window.confirm(`Delete this ${label.toLowerCase()}? This action cannot be undone.`)) return;
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      if (table === "projects") setProjects((items) => items.filter((item) => item.id !== id));
      else setCertificates((items) => items.filter((item) => item.id !== id));
      notify("success", `${label} deleted successfully.`);
    } catch (error) {
      notify("error", error.message || `Unable to delete ${label.toLowerCase()}.`);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      notify("error", error.message || "Could not sign out.");
      return;
    }
    navigate("/admin");
  };

  const chooseProjectImage = (file) => {
    updateProjectField("imageFile", file || null);
    setProjectImagePreview(file ? URL.createObjectURL(file) : "");
  };
  const chooseCertificateImage = (file) => {
    updateCertificateField("imageFile", file || null);
    setCertificateImagePreview(file ? URL.createObjectURL(file) : "");
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060913] px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Loader className="animate-spin" size={28} />
          </div>
          <p className="mt-6 text-sm font-bold text-white">Preparing your workspace…</p>
          <p className="mt-2 text-xs text-slate-400">Checking access and loading portfolio content</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderKanban, count: projects.length },
    { id: "certificates", label: "Certificates", icon: Award, count: certificates.length }
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-300 font-sans selection:bg-cyan-500/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-[#060913] lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/5 px-6">
          {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-extrabold text-white shadow-lg shadow-cyan-500/20">BD</div> */}
          <div>
            <p className="font-bold tracking-tight text-white">Pramodika Dulanja</p>
            
          </div>
        </div>
        <div className="px-4 pt-7">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
          <nav className="mt-3 space-y-1">
            {navItems.map(({ id, label, icon: Icon, count }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${activeTab === id ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {count !== undefined && <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${activeTab === id ? "bg-cyan-500/20 text-cyan-400" : "bg-white/10 text-slate-400"}`}>{count}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t border-white/5 p-4">
          
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-400">
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#060913]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
            <div>
              <p className="text-xs font-medium text-slate-400">Portfolio management</p>
              <h1 className="mt-0.5 text-lg font-bold tracking-tight text-white">
                {activeTab === "overview" ? "Overview" : activeTab === "projects" ? "Projects" : "Certificates"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" target="_blank" rel="noreferrer" className={`${buttonSecondary} hidden sm:inline-flex`}>
                <ExternalLink size={16} /> View portfolio
              </a>
              <button onClick={async () => { try { await loadData(); notify("success", "Content refreshed."); } catch (error) { notify("error", error.message); } }} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white" title="Refresh content" aria-label="Refresh content">
                <RefreshCw size={17} />
              </button>
              <button onClick={handleLogout} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-300 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 lg:hidden">
                <LogOut size={16} /><span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-2 lg:hidden">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === id ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-white/5"}`}>
                <Icon size={16} />{label}
              </button>
            ))}
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
          {statusMessage.text && (
            <div role="status" className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${statusMessage.type === "error" ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"}`}>
              {statusMessage.type === "error" ? <AlertCircle size={19} className="mt-0.5 shrink-0" /> : <CheckCircle size={19} className="mt-0.5 shrink-0" />}
              <p className="flex-1 text-sm font-medium">{statusMessage.text}</p>
              <button onClick={() => setStatusMessage({ type: "", text: "" })} aria-label="Dismiss message" className="hover:opacity-70"><X size={17} /></button>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="overflow-hidden rounded-3xl bg-cyan border border-white/10 p-6 text-white shadow-lg sm:p-9 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center relative z-10">
                  <div className="max-w-2xl">
                    {/* <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" /> Admin workspace</span> */}
                    <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Manage your work.<br className="hidden sm:block" /> Keep your portfolio fresh.</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">Add projects, showcase the technologies you use, and keep your achievements up to date from one place.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => { resetProjectForm(); setActiveTab("projects"); }} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 text-white px-4 py-3 text-sm font-bold transition hover:bg-cyan-400 hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"><Plus size={17} /> Add project</button>
                    <button onClick={() => { resetCertificateForm(); setActiveTab("certificates"); }} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"><Award size={17} /> Add certificate</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard icon={FolderKanban} label="Total projects" value={projects.length} hint="Projects in your portfolio" tone="cyan" />
                <StatCard icon={Award} label="Certificates" value={certificates.length} hint="Achievements showcased" tone="emerald" />
                <StatCard icon={Layers} label="Ongoing projects" value={projects.filter((p) => p.project_type === "Ongoing").length} hint="Work currently in progress" tone="amber" />
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div><h3 className="font-bold text-white">Recent projects</h3><p className="mt-1 text-sm text-slate-400">Your latest portfolio entries</p></div>
                    <button onClick={() => setActiveTab("projects")} className="inline-flex items-center gap-1 text-sm font-bold text-cyan-400 hover:text-cyan-300">View all <ChevronRight size={16} /></button>
                  </div>
                  {projects.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">No projects added yet.</p> : (
                    <div className="space-y-3">
                      {projects.slice(0, 4).map((project) => (
                        <div key={project.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#060913] p-3">
                          {project.image_url ? <img src={project.image_url} alt="" className="h-14 w-16 rounded-lg object-cover" /> : <div className="flex h-14 w-16 items-center justify-center rounded-lg bg-white/5 text-slate-500 border border-white/10"><ImageIcon size={20} /></div>}
                          <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">{project.title}</p><p className="mt-1 truncate text-xs text-slate-400">{project.project_type || "Project"} · {(project.tags || []).slice(0, 3).join(", ")}</p></div>
                          <button onClick={() => startProjectEdit(project)} className="rounded-lg p-2 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400" title="Edit project"><Pencil size={16} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div><h3 className="font-bold text-white">Recent certificates</h3><p className="mt-1 text-sm text-slate-400">Your latest achievements</p></div>
                    <button onClick={() => setActiveTab("certificates")} className="inline-flex items-center gap-1 text-sm font-bold text-cyan-400 hover:text-cyan-300">View all <ChevronRight size={16} /></button>
                  </div>
                  {certificates.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">No certificates added yet.</p> : (
                    <div className="space-y-3">
                      {certificates.slice(0, 4).map((cert) => (
                        <div key={cert.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#060913] p-3">
                          {cert.image_url ? <img src={cert.image_url} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Award size={21} /></div>}
                          <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">{cert.title}</p><p className="mt-1 truncate text-xs text-slate-400">{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p></div>
                          <button onClick={() => startCertificateEdit(cert)} className="rounded-lg p-2 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400" title="Edit certificate"><Pencil size={16} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div>
              <SectionHeading eyebrow="Portfolio content" title={editingId ? "Edit project" : "Projects"} description={editingId ? "Update the project details below. Leave the image unchanged if you don't want to replace it." : "Add a new project or maintain the projects already displayed on your portfolio."} action={!editingId && <button onClick={() => { resetProjectForm(); document.getElementById("project-form")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={buttonPrimary}><Plus size={17} /> New project</button>} />
              <form id="project-form" onSubmit={handleProjectSubmit} className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
                  <div><h3 className="font-bold text-white">{editingId ? "Project details" : "Create a project"}</h3><p className="mt-1 text-xs text-slate-400">Fields marked * are required.</p></div>
                  {editingId && <button type="button" onClick={resetProjectForm} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white"><X size={16} /> Cancel</button>}
                </div>
                <div className="grid grid-cols-1 gap-x-7 gap-y-5 p-5 sm:p-7 lg:grid-cols-3">
                  <div className="space-y-5 lg:col-span-2">
                    <div><label className={labelClass}>Project title *</label><input className={inputClass} value={projectForm.title} onChange={(e) => updateProjectField("title", e.target.value)} placeholder="e.g. Smart Inventory Management System" required /></div>
                    <div><label className={labelClass}>Description *</label><textarea className={`${inputClass} resize-y`} rows={4} value={projectForm.description} onChange={(e) => updateProjectField("description", e.target.value)} placeholder="What does this project do? Mention its purpose and key features." required /><p className="mt-1.5 text-xs text-slate-500">Keep it clear and focused on the value and main features.</p></div>
                    <div><label className={labelClass}>Technologies / tags *</label><input className={inputClass} value={projectForm.tags} onChange={(e) => updateProjectField("tags", e.target.value)} placeholder="React, Node.js, PostgreSQL, Docker" required /><p className="mt-1.5 text-xs text-slate-500">Separate each technology with a comma.</p></div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div><label className={labelClass}>Project type *</label><select className={`${inputClass} appearance-none`} value={projectForm.projectType} onChange={(e) => updateProjectField("projectType", e.target.value)}><option>Individual</option><option>Group</option><option>Ongoing</option></select></div>
                      <div><label className={labelClass}>GitHub URL</label><div className="relative"><Code size={17} className="absolute left-3 top-[23px] text-slate-500" /><input type="url" className={`${inputClass} pl-10`} value={projectForm.githubUrl} onChange={(e) => updateProjectField("githubUrl", e.target.value)} placeholder="https://github.com/..." /></div></div>
                    </div>
                    <div><label className={labelClass}>Live demo URL</label><div className="relative"><Globe size={17} className="absolute left-3 top-[23px] text-slate-500" /><input type="url" className={`${inputClass} pl-10`} value={projectForm.demoUrl} onChange={(e) => updateProjectField("demoUrl", e.target.value)} placeholder="https://your-project.com" /></div></div>
                  </div>
                  <div>
                    <label className={labelClass}>Cover image {!editingId && "*"}</label>
                    <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#060913]">
                      {projectImagePreview ? <img src={projectImagePreview} alt="Project preview" className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] flex-col items-center justify-center px-5 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-500 shadow-sm"><ImageIcon size={23} /></div><p className="mt-3 text-sm font-bold text-slate-300">Add a project image</p><p className="mt-1 text-xs text-slate-500">PNG, JPG or WebP · Max 5 MB</p></div>}
                      <div className="border-t border-white/10 bg-[#060913] p-3">
                        <label className={`${buttonSecondary} w-full cursor-pointer`}>
                          <UploadCloud size={16} /> {projectForm.imageFile ? "Change image" : "Choose image"}
                          <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => chooseProjectImage(e.target.files?.[0] || null)} />
                        </label>
                        {projectForm.imageFile && <p className="mt-2 break-all text-xs text-cyan-400">{projectForm.imageFile.name}</p>}
                        {editingId && <p className="mt-2 text-xs leading-5 text-slate-500">No new image selected? Your current cover will be kept.</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-[#060913]/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7 rounded-b-2xl">
                  {editingId && <button type="button" onClick={resetProjectForm} className={buttonSecondary}>Cancel</button>}
                  <button type="submit" disabled={uploading} className={buttonPrimary}>{uploading ? <Loader size={17} className="animate-spin" /> : editingId ? <Save size={17} /> : <Plus size={17} />}{uploading ? "Saving..." : editingId ? "Save changes" : "Publish project"}</button>
                </div>
              </form>

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="font-bold text-white">All projects <span className="ml-1 rounded-lg bg-white/10 border border-white/10 px-2 py-0.5 text-xs text-slate-300">{projects.length}</span></h3><p className="mt-1 text-sm text-slate-400">Search and manage your published entries.</p></div>
                <div className="relative w-full sm:max-w-xs"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#060913] py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-600" placeholder="Search projects..." /></div>
              </div>
              {filteredProjects.length === 0 ? <EmptyState icon={FolderKanban} title={projectSearch ? "No matching projects" : "No projects yet"} description={projectSearch ? "Try another title or technology keyword." : "Add your first project using the form above."} /> : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <article key={project.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30">
                      {project.image_url ? <img src={project.image_url} alt={project.title} className="aspect-[16/9] w-full bg-[#060913] object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="flex aspect-[16/9] items-center justify-center bg-[#060913] border-b border-white/5 text-slate-600"><ImageIcon size={28} /></div>}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3"><h4 className="font-bold text-white">{project.title}</h4><span className="shrink-0 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">{project.project_type || "Project"}</span></div>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{project.description}</p>
                        <div className="mt-4 flex flex-wrap gap-1.5">{(project.tags || []).slice(0, 5).map((tag) => <span key={tag} className="rounded-md bg-[#060913] border border-white/10 px-2 py-1 text-[11px] font-bold text-slate-300">{tag}</span>)}</div>
                        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                          <div className="flex gap-1">{project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" title="GitHub repository" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><Code size={17} /></a>}{project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" title="Live demo" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><ArrowUpRight size={17} /></a>}</div>
                          <div className="flex gap-2"><button onClick={() => startProjectEdit(project)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"><Pencil size={14} /> Edit</button><button onClick={() => deleteRecord("projects", project.id, "Project")} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 size={14} /> Delete</button></div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "certificates" && (
            <div>
              <SectionHeading eyebrow="Achievements" title={editingCertId ? "Edit certificate" : "Certificates"} description={editingCertId ? "Update the certificate information. You can keep the existing image." : "Showcase courses, professional training, and certifications on your portfolio."} action={!editingCertId && <button onClick={() => { resetCertificateForm(); document.getElementById("certificate-form")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={buttonPrimary}><Plus size={17} /> New certificate</button>} />
              <form id="certificate-form" onSubmit={handleCertificateSubmit} className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
                  <div><h3 className="font-bold text-white">{editingCertId ? "Certificate details" : "Add a certificate"}</h3><p className="mt-1 text-xs text-slate-400">Enter the information as it appears on your certificate.</p></div>
                  {editingCertId && <button type="button" onClick={resetCertificateForm} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white"><X size={16} /> Cancel</button>}
                </div>
                <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-3">
                  <div className="space-y-5 lg:col-span-2">
                    <div><label className={labelClass}>Certificate title *</label><input className={inputClass} value={certificateForm.title} onChange={(e) => updateCertificateField("title", e.target.value)} placeholder="e.g. Introduction to DevOps Tools" required /></div>
                    <div><label className={labelClass}>Issuing organization *</label><input className={inputClass} value={certificateForm.issuer} onChange={(e) => updateCertificateField("issuer", e.target.value)} placeholder="e.g. Simplilearn, AWS, University of Moratuwa" required /></div>
                    <div><label className={labelClass}>Date or year</label><div className="relative"><Calendar size={17} className="absolute left-3 top-[23px] text-slate-500" /><input className={`${inputClass} pl-10`} value={certificateForm.date} onChange={(e) => updateCertificateField("date", e.target.value)} placeholder="e.g. October 2026" /></div></div>
                  </div>
                  <div>
                    <label className={labelClass}>Certificate image</label>
                    <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#060913]">
                      {certificateImagePreview ? <img src={certificateImagePreview} alt="Certificate preview" className="aspect-[4/3] w-full object-contain p-3" /> : <div className="flex aspect-[4/3] flex-col items-center justify-center"><Award size={32} className="text-slate-600" /><p className="mt-3 text-sm font-bold text-slate-300">Certificate preview</p><p className="mt-1 text-xs text-slate-500">Image is optional</p></div>}
                      <div className="border-t border-white/10 bg-[#060913] p-3"><label className={`${buttonSecondary} w-full cursor-pointer`}><UploadCloud size={16} /> Choose image<input type="file" accept="image/*" className="sr-only" onChange={(e) => chooseCertificateImage(e.target.files?.[0] || null)} /></label>{certificateForm.imageFile && <p className="mt-2 break-all text-xs text-cyan-400">{certificateForm.imageFile.name}</p>}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-[#060913]/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7 rounded-b-2xl">
                  {editingCertId && <button type="button" onClick={resetCertificateForm} className={buttonSecondary}>Cancel</button>}
                  <button type="submit" disabled={uploading} className={buttonPrimary}>{uploading ? <Loader size={17} className="animate-spin" /> : editingCertId ? <Save size={17} /> : <Plus size={17} />}{uploading ? "Saving..." : editingCertId ? "Save changes" : "Add certificate"}</button>
                </div>
              </form>

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="font-bold text-white">All certificates <span className="ml-1 rounded-lg bg-white/10 border border-white/10 px-2 py-0.5 text-xs text-slate-300">{certificates.length}</span></h3><p className="mt-1 text-sm text-slate-400">Manage the achievements displayed on your portfolio.</p></div>
                <div className="relative w-full sm:max-w-xs"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={certificateSearch} onChange={(e) => setCertificateSearch(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#060913] py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-600" placeholder="Search certificates..." /></div>
              </div>
              {filteredCertificates.length === 0 ? <EmptyState icon={Award} title={certificateSearch ? "No matching certificates" : "No certificates yet"} description={certificateSearch ? "Try searching by title, issuer, or year." : "Add your first certificate using the form above."} /> : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCertificates.map((cert) => (
                    <article key={cert.id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-sm transition hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30">
                      {cert.image_url ? <img src={cert.image_url} alt={cert.title} className="h-24 w-24 shrink-0 rounded-xl border border-white/10 bg-[#060913] object-contain p-1" /> : <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"><Award size={30} /></div>}
                      <div className="min-w-0 flex-1"><h4 className="font-bold leading-5 text-white">{cert.title}</h4><p className="mt-1.5 text-sm font-semibold text-cyan-400">{cert.issuer}</p>{cert.date && <p className="mt-1 text-xs text-slate-400">{cert.date}</p>}
                        <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => startCertificateEdit(cert)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"><Pencil size={13} /> Edit</button><button onClick={() => deleteRecord("certificates", cert.id, "Certificate")} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 size={13} /> Delete</button></div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          
        </main>
      </div>
    </div>
  );
}