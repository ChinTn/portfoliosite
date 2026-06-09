import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'blogs'
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [descOrContent, setDescOrContent] = useState('');
  const [link, setLink] = useState(''); // Old link (optional)
  const [imageUrl, setImageUrl] = useState('');
  // New Project specific states
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('completed');
  const [githubLink, setGithubLink] = useState('');
  const [deployedLink, setDeployedLink] = useState('');

  // Settings states
  const [settingsLocation, setSettingsLocation] = useState('');
  const [settingsTemp, setSettingsTemp] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && view === 'list') {
      fetchItems();
    }
  }, [activeTab, view, isAuthenticated]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email: loginEmail, password: loginPassword });
      localStorage.setItem('adminToken', res.data.token);
      setIsAuthenticated(true);
      setLoginError('');
    } catch (err) {
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const fetchItems = async () => {
    try {
      if (activeTab === 'settings') {
        const res = await axios.get(`${API_URL}/api/settings`);
        setSettingsLocation(res.data.location || '');
        setSettingsTemp(res.data.temperature || '');
      } else {
        const res = await axios.get(`${API_URL}/api/${activeTab}`);
        setItems(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/settings`, { location: settingsLocation, temperature: settingsTemp }, getAuthConfig());
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setDescOrContent(activeTab === 'projects' ? item.description || '' : item.content || '');
    setImageUrl(item.imageUrl || '');
    
    if (activeTab === 'projects') {
      setLink(item.link || '');
      setCategory(item.category || '');
      setStatus(item.status || 'completed');
      setGithubLink(item.githubLink || '');
      setDeployedLink(item.deployedLink || '');
    }
    setView('edit');
  };

  const requestDelete = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}/api/${activeTab}/${deleteTarget}`, getAuthConfig());
      fetchItems();
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) handleLogout();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = activeTab === 'projects' 
      ? { title, description: descOrContent, link, imageUrl, category, status, githubLink, deployedLink }
      : { title, content: descOrContent, imageUrl };

    try {
      if (view === 'create') {
        await axios.post(`${API_URL}/api/${activeTab}`, payload, getAuthConfig());
      } else if (view === 'edit') {
        await axios.put(`${API_URL}/api/${activeTab}/${editingItem._id}`, payload, getAuthConfig());
      }
      setView('list');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) handleLogout();
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setTitle(''); setDescOrContent(''); setLink(''); setImageUrl('');
    setCategory(''); setStatus('completed'); setGithubLink(''); setDeployedLink('');
    setView('create');
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-card-bg-light border border-border-dim p-10 shadow-xl relative">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card-bg-light border border-border-main text-2xl text-highlight mb-6">
              <i className="fas fa-lock"></i>
            </div>
            <h2 className="text-3xl font-bold text-text-main tracking-widest uppercase">Admin Access</h2>
            <p className="text-text-dim mt-2 text-sm">Restricted zone. Please log in.</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 border border-red-500/20 bg-red-500/10 text-red-400 text-center font-medium text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i> {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
                required 
                className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={loginPassword} 
                onChange={e => setLoginPassword(e.target.value)} 
                required 
                className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
              />
            </div>
            <button 
              type="submit" 
              className="mt-4 w-full py-4 font-bold text-text-main tracking-widest uppercase bg-highlight hover:bg-highlight/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
            >
              <i className="fas fa-sign-in-alt mr-2"></i> Authenticate
            </button>
          </form>

          <div className="text-center mt-8 border-t border-border-dim/50 pt-6">
            <a href="/" className="text-text-dim hover:text-highlight transition-colors text-sm font-medium inline-flex items-center gap-2">
              <i className="fas fa-arrow-left"></i> Return to Site
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header & Tabs */}
        <div className="flex justify-between items-center border-b border-border-main pb-6 mb-10">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold text-highlight tracking-widest uppercase">Dashboard</h1>
            <a href="/" target="_blank" rel="noreferrer" className="text-text-dim hover:text-text-main transition-colors text-sm font-medium flex items-center gap-2">
              <i className="fas fa-external-link-alt"></i> Preview Site
            </a>
          </div>
          
          <div className="flex items-center gap-6">
            {view === 'list' && (
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('projects')} 
                  className={`text-lg font-bold pb-2 border-b-2 transition-all ${activeTab === 'projects' ? 'border-highlight text-highlight' : 'border-transparent text-text-dim hover:text-text-main'}`}
                >
                  Projects
                </button>
                <button 
                  onClick={() => setActiveTab('blogs')} 
                  className={`text-lg font-bold pb-2 border-b-2 transition-all ${activeTab === 'blogs' ? 'border-highlight text-highlight' : 'border-transparent text-text-dim hover:text-text-main'}`}
                >
                  Blogs
                </button>
                <button 
                  onClick={() => { setActiveTab('settings'); setView('list'); }} 
                  className={`text-lg font-bold pb-2 border-b-2 transition-all ${activeTab === 'settings' ? 'border-highlight text-highlight' : 'border-transparent text-text-dim hover:text-text-main'}`}
                >
                  Settings
                </button>
              </div>
            )}
            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 transition-colors text-xl ml-4" title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          <AnimatePresence mode="wait">
            
            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="bg-card-bg-light border border-border-dim p-8 md:p-10 max-w-2xl mx-auto mt-10"
              >
                <h2 className="text-2xl font-bold text-highlight mb-8 uppercase tracking-widest">Global Site Settings</h2>
                
                {settingsSaved && (
                  <div className="mb-8 p-4 border border-green-500/20 bg-green-500/10 text-green-400 text-center font-medium">
                    Settings successfully saved!
                  </div>
                )}

                <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-text-dim text-sm font-bold mb-2 uppercase tracking-wider">City / State</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ahmedabad, GJ" 
                      value={settingsLocation} 
                      onChange={e => setSettingsLocation(e.target.value)} 
                      className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-text-dim text-sm font-bold mb-2 uppercase tracking-wider">Temperature</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 32°C" 
                      value={settingsTemp} 
                      onChange={e => setSettingsTemp(e.target.value)} 
                      className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="mt-6 w-full py-4 font-bold text-text-main tracking-widest uppercase bg-highlight hover:bg-highlight/90 transition-all shadow-glow"
                  >
                    Save Settings
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab !== 'settings' && view === 'list' && (
              <motion.div 
                key={"list" + activeTab}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div className="flex justify-end mb-8">
                  <button 
                    onClick={openCreate} 
                    className="bg-highlight hover:bg-highlight/90 text-text-main font-bold py-3 px-6 transition-all shadow-glow"
                  >
                    + New {activeTab === 'projects' ? 'Project' : 'Blog'}
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {items.length === 0 ? (
                    <p className="text-center text-text-dim text-lg py-10 border border-dashed border-border-main">No {activeTab} found.</p>
                  ) : (
                    items.map(item => (
                      <div 
                        key={item._id} 
                        onClick={() => navigate(activeTab === 'projects' ? `/project/${item._id}` : `/blog/${item._id}`, { state: { from: '/admin' } })}
                        className="bg-card-bg-light border border-border-dim p-6 hover:border-highlight/30 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-highlight mb-2">{item.title}</h3>
                            {activeTab === 'projects' && item.status && (
                              <span className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-wider bg-card-bg-light text-text-dim mb-2 border border-border-main">
                                {item.status}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-4 items-center">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEdit(item); }} 
                              className="text-text-dim hover:text-highlight transition-colors text-lg" 
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); requestDelete(item._id); }} 
                              className="text-text-dim hover:text-red-500 transition-colors text-lg" 
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <p className="text-text-dim line-clamp-2">
                          {activeTab === 'projects' ? item.description : item.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {(view === 'create' || view === 'edit') && (
              <motion.div
                key="form"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <button 
                  onClick={() => setView('list')} 
                  className="mb-8 text-text-dim hover:text-highlight transition-colors font-medium flex items-center gap-2"
                >
                  <i className="fas fa-arrow-left"></i> Back to List
                </button>

                <div className="bg-card-bg-light border border-border-dim p-8 md:p-10">
                  <h2 className="text-2xl font-bold text-highlight mb-8 uppercase tracking-widest">
                    {view === 'create' ? 'Create' : 'Edit'} {activeTab === 'projects' ? 'Project' : 'Blog'}
                  </h2>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input 
                      type="text" 
                      placeholder="Title" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      required 
                      className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
                    />
                    
                    {activeTab === 'projects' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <select 
                            value={status} 
                            onChange={e => setStatus(e.target.value)}
                            className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all appearance-none cursor-pointer"
                          >
                            <option value="current">Currently Working</option>
                            <option value="completed">Already Done</option>
                            <option value="future">Future Plans</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-dim">
                            <i className="fas fa-chevron-down"></i>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Category / Tags (e.g. Fullstack, React)" 
                          value={category} 
                          onChange={e => setCategory(e.target.value)} 
                          className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
                        />
                      </div>
                    )}

                      <textarea 
                        placeholder={activeTab === 'projects' ? 'Description' : 'Content (Markdown Supported)'} 
                        value={descOrContent} 
                        onChange={e => setDescOrContent(e.target.value)} 
                        required 
                        rows="6"
                        className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all resize-none"
                      />
                    
                    <input 
                      type="text" 
                      placeholder="Cover Image URL (Optional)" 
                      value={imageUrl} 
                      onChange={e => setImageUrl(e.target.value)} 
                      className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
                    />

                    {activeTab === 'projects' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input 
                          type="text" 
                          placeholder="GitHub Link (Optional)" 
                          value={githubLink} 
                          onChange={e => setGithubLink(e.target.value)} 
                          className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
                        />
                        <input 
                          type="text" 
                          placeholder="Deployed Live Link (Optional)" 
                          value={deployedLink} 
                          onChange={e => setDeployedLink(e.target.value)} 
                          className="w-full bg-bg-nav border border-border-dim px-4 py-4 text-text-main placeholder-text-dim/50 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
                        />
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="mt-6 w-full py-4 font-bold text-text-main tracking-widest uppercase bg-highlight hover:bg-highlight/90 transition-all shadow-glow"
                    >
                      {view === 'create' ? 'Publish' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] px-6"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-bg-dark border-2 border-red-500 p-10 text-center max-w-md w-full shadow-[0_0_40px_rgba(239,68,68,0.3)]"
            >
              <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-6"></i>
              <h3 className="text-2xl font-bold text-text-main mb-4 uppercase tracking-wider">Are you absolutely sure?</h3>
              <p className="text-text-dim mb-10 leading-relaxed">
                This action cannot be undone. This {activeTab.slice(0, -1)} will be permanently deleted from the database.
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setDeleteTarget(null)} 
                  className="bg-card-bg-light border border-border-dim hover:bg-bg-nav text-text-main font-bold py-3 px-8 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 transition-colors"
                >
                  Yes, Delete it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
