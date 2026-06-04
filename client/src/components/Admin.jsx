import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
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
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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
      const res = await axios.get(`${API_URL}/api/${activeTab}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescOrContent(activeTab === 'projects' ? item.description : item.content);
    if (activeTab === 'projects') setLink(item.link || '');
    if (activeTab === 'blogs') setImageUrl(item.imageUrl || '');
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
      ? { title, description: descOrContent, link }
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
    setView('create');
  };

  if (!isAuthenticated) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: '400px', margin: '0 auto', ...cardStyle, marginTop: '100px', padding: '40px' }}>
          <h2 style={{ color: '#2196f3', textAlign: 'center', marginBottom: '30px' }}>Admin Login</h2>
          {loginError && <p style={{ color: '#c41e3a', textAlign: 'center', marginBottom: '15px' }}>{loginError}</p>}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required style={inputStyle} />
            <button type="submit" style={submitBtnStyle}>Login</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
              <i className="fas fa-arrow-left"></i> Back to Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        
        {/* Header & Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ color: '#2196f3', margin: 0 }}>Dashboard</h1>
            <a href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
              <i className="fas fa-external-link-alt"></i> Preview Site
            </a>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {view === 'list' && (
              <>
                <button onClick={() => setActiveTab('projects')} style={activeTab === 'projects' ? activeTabStyle : inactiveTabStyle}>Projects</button>
                <button onClick={() => setActiveTab('blogs')} style={activeTab === 'blogs' ? activeTabStyle : inactiveTabStyle}>Blogs</button>
              </>
            )}
            <button onClick={handleLogout} style={{ ...inactiveTabStyle, color: '#c41e3a', border: 'none' }} title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            
            {view === 'list' && (
              <motion.div 
                key={"list" + activeTab}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <button onClick={openCreate} style={createBtnStyle}>
                    + New {activeTab === 'projects' ? 'Project' : 'Blog'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {items.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>No {activeTab} found.</p>
                  ) : (
                    items.map(item => (
                      <div key={item._id} style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ margin: '0 0 10px 0', color: '#2196f3' }}>{item.title}</h3>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleEdit(item)} style={iconBtnStyle} title="Edit">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => requestDelete(item._id)} style={{...iconBtnStyle, color: '#c41e3a'}} title="Delete">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <p style={truncateStyle}>
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
                <button onClick={() => setView('list')} style={{...createBtnStyle, background: '#444', marginBottom: '20px'}}>
                  <i className="fas fa-arrow-left"></i> Back to List
                </button>

                <div style={{ background: '#272727', padding: '30px', borderRadius: '12px' }}>
                  <h2 style={{ color: '#2196f3', marginBottom: '20px' }}>
                    {view === 'create' ? 'Create' : 'Edit'} {activeTab === 'projects' ? 'Project' : 'Blog'}
                  </h2>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
                    <textarea placeholder={activeTab === 'projects' ? 'Description' : 'Content'} value={descOrContent} onChange={e => setDescOrContent(e.target.value)} required style={{...inputStyle, minHeight: '150px'}} />
                    {activeTab === 'projects' && (
                      <input type="text" placeholder="Link (Optional)" value={link} onChange={e => setLink(e.target.value)} style={inputStyle} />
                    )}
                    {activeTab === 'blogs' && (
                      <input type="text" placeholder="Cover Image URL (Optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
                    )}
                    <button type="submit" style={submitBtnStyle}>
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
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
              display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
            }}
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{ ...cardStyle, background: '#1a1a1a', padding: '40px', textAlign: 'center', maxWidth: '400px', border: '1px solid #c41e3a' }}
            >
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '40px', color: '#c41e3a', marginBottom: '20px' }}></i>
              <h3 style={{ marginBottom: '15px', color: 'white' }}>Are you absolutely sure?</h3>
              <p style={{ color: '#888', marginBottom: '30px', lineHeight: '1.5' }}>
                This action cannot be undone. This {activeTab.slice(0, -1)} will be permanently deleted from the database.
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button onClick={() => setDeleteTarget(null)} style={{ ...createBtnStyle, background: '#444' }}>
                  Cancel
                </button>
                <button onClick={confirmDelete} style={{ ...createBtnStyle, background: '#c41e3a' }}>
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

// Styles
const pageStyle = { minHeight: '100vh', background: '#1a1a1a', paddingTop: '100px', paddingBottom: '50px' };
const containerStyle = { maxWidth: '800px', margin: '0 auto', padding: '0 20px' };
const activeTabStyle = {
  background: 'transparent', border: 'none', color: '#2196f3', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', borderBottom: '2px solid #2196f3', paddingBottom: '5px'
};
const inactiveTabStyle = {
  background: 'transparent', border: 'none', color: '#888', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', paddingBottom: '5px'
};
const createBtnStyle = {
  background: '#2196f3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
};
const cardStyle = {
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))', 
  backdropFilter: 'blur(20px)', 
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
  borderRight: '1px solid rgba(255, 255, 255, 0.02)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
  padding: '20px', 
  borderRadius: '16px', 
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.05)'
};
const truncateStyle = {
  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: 'rgba(253, 237, 217, 0.768)', margin: 0, lineHeight: '1.5'
};
const iconBtnStyle = {
  background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '16px', transition: 'color 0.2s'
};
const inputStyle = {
  padding: '15px', borderRadius: '8px', border: '1px solid #444', background: '#1a1a1a', color: 'white', fontSize: '16px', outline: 'none', width: '100%', boxSizing: 'border-box'
};
const submitBtnStyle = {
  padding: '15px', borderRadius: '8px', border: 'none', background: '#2196f3', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px'
};

export default Admin;
