import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { LogOut, UploadCloud, PlusCircle, CheckCircle, AlertCircle, Image as ImageIcon, Trash2, Edit, Save } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Security & Data States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  
  // Form States
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // STRICT SECURITY CHECK & FETCH DATA
  useEffect(() => {
    const initializeDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin');
        return;
      }
      
      setIsAuthenticated(true);
      fetchProjects();
    };

    initializeDashboard();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTags(project.tags ? project.tags.join(', ') : '');
    setGithubUrl(project.github_url || '');
    setDemoUrl(project.demo_url || '');
    setImageFile(null); // Keep old image unless they select a new one
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== id));
      setStatusMessage({ type: 'success', text: 'Project deleted successfully!' });
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      alert("Error deleting project: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setStatusMessage({ type: '', text: '' });

    if (!imageFile && !editingId) {
      setStatusMessage({ type: 'error', text: 'Please select an image file.' });
      setUploading(false);
      return;
    }

    try {
      let imageUrl = null;

      // 1. Upload new image if one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `project-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrlData.publicUrl;
      }

      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      const projectData = {
        title: title,
        description: description,
        tags: tagsArray,
        github_url: githubUrl,
        demo_url: demoUrl,
      };

      if (imageUrl) {
        projectData.image_url = imageUrl;
      }

      // 2. Insert or Update Database
      if (editingId) {
        const { error: dbError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);
        if (dbError) throw dbError;
        setStatusMessage({ type: 'success', text: 'Project updated successfully!' });
      } else {
        const { error: dbError } = await supabase
          .from('projects')
          .insert([projectData]);
        if (dbError) throw dbError;
        setStatusMessage({ type: 'success', text: 'Project added successfully!' });
      }

      // Reset form & refresh list
      setEditingId(null);
      setTitle('');
      setDescription('');
      setTags('');
      setGithubUrl('');
      setDemoUrl('');
      setImageFile(null);
      fetchProjects();

      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);

    } catch (error) {
      console.error('Error:', error.message);
      setStatusMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setTags('');
    setGithubUrl('');
    setDemoUrl('');
    setImageFile(null);
  };

  // STRICT LOCK: Do not render anything until authenticated
  if (!isAuthenticated || loading) {
    return <div className="min-h-screen bg-[#060913] flex items-center justify-center text-cyan-400 font-bold">Securing Connection...</div>;
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-300 font-sans selection:bg-cyan-500/30 pb-20">
      
      {/* Top Navbar */}
      <header className="bg-[#060913]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-lg shadow-cyan-500/20">
              BD
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-bold transition-colors border border-red-500/20"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
            <p className="text-sm text-slate-400">
              {editingId ? 'Update the details below to modify your live portfolio.' : 'Fill out this form to instantly publish a new project.'}
            </p>
          </div>
          {editingId && (
            <button onClick={cancelEdit} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
              Cancel Edit
            </button>
          )}
        </div>

        {statusMessage.text && (
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${statusMessage.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'}`}>
            {statusMessage.type === 'error' ? <AlertCircle size={20} className="mt-0.5" /> : <CheckCircle size={20} className="mt-0.5" />}
            <p className="text-sm font-medium">{statusMessage.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl backdrop-blur-md space-y-6 shadow-2xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Project Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-[#060913] border border-white/10 text-white text-sm font-medium rounded-xl focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Description</label>
              <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-4 py-3 bg-[#060913] border border-white/10 text-white text-sm font-medium rounded-xl focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 resize-none"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Tech Stack Tags (Comma separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} required className="w-full px-4 py-3 bg-[#060913] border border-white/10 text-white text-sm font-medium rounded-xl focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">GitHub URL (Optional)</label>
              <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full px-4 py-3 bg-[#060913] border border-white/10 text-white text-sm font-medium rounded-xl focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Live Demo URL (Optional)</label>
              <input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} className="w-full px-4 py-3 bg-[#060913] border border-white/10 text-white text-sm font-medium rounded-xl focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Project Screenshot {editingId && "(Leave blank to keep existing)"}</label>
              <div className="relative group cursor-pointer">
                <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!editingId} />
                <div className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${imageFile ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10 hover:border-cyan-500/50 bg-[#060913]'}`}>
                  {imageFile ? (
                    <>
                      <ImageIcon size={32} className="text-cyan-400 mb-3" />
                      <p className="text-sm font-bold text-cyan-400">{imageFile.name}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={32} className="text-slate-500 mb-3 group-hover:text-cyan-400 transition-colors" />
                      <p className="text-sm font-bold text-white mb-1">Click to upload an image</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={uploading} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_20px_-5px_rgba(132,204,22,0.4)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
            {uploading ? 'Processing...' : editingId ? <><Save size={18} /> Save Changes</> : <><PlusCircle size={18} /> Publish Project</>}
          </button>
        </form>

        {/* Existing Projects List */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-6">Manage Projects</h2>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-10 bg-white/[0.02] border border-white/5 rounded-xl text-slate-400">No projects found.</div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/[0.04] transition-colors">
                  <img src={project.image_url} alt={project.title} className="w-20 h-14 object-cover rounded-md" />
                  <div className="flex-grow">
                    <h3 className="text-white font-bold text-lg">{project.title}</h3>
                    <p className="text-slate-400 text-xs truncate max-w-md">{project.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(project)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}