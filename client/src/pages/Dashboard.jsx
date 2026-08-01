import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import UploadForm from '../components/UploadForm';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchPDFs();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        window.location.href = '/auth';
      }
    } catch (err) {
      setError('Failed to fetch user data');
    }
  };

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/pdfs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPdfs(data);
      } else if (response.status === 401) {
        window.location.href = '/auth';
      } else {
        setError('Failed to fetch PDFs');
      }
    } catch (err) {
      setError('Failed to fetch PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
  };

  // Called when UploadForm finishes and returns the created PDF object
  const handleUpload = (newPdf) => {
    // Prepend the newly uploaded pdf so it appears immediately in the list
    setPdfs(prev => [newPdf, ...(prev || [])]);
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>PDF Learning Guide</h1>
          <div className="user-menu">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Available Learning Materials</h2>
            {/* Replaced the simple upload button with a full upload form component */}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <UploadForm onUpload={handleUpload} />
          </div>

          {error && <div className="error-message">{error}</div>}

          {pdfs.length === 0 ? (
            <div className="empty-state">
              <p>No PDFs available yet. Upload one to get started!</p>
            </div>
          ) : (
            <div className="pdf-grid">
              {pdfs.map(pdf => (
                <div key={pdf._id} className="pdf-card">
                  <div className="pdf-icon">📄</div>
                  <h3>{pdf.title}</h3>
                  <p className="pdf-description">{pdf.description}</p>
                  <div className="pdf-meta">
                    <span className="pdf-category">{pdf.category}</span>
                    <span className="pdf-pages">{pdf.totalPages} pages</span>
                  </div>
                  <a href={`/api/pdfs/download/${pdf._id}`} className="view-btn">View / Download</a>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Your Progress</h2>
          <div className="progress-stats">
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">Modules Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">Quizzes Passed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0%</div>
              <div className="stat-label">Overall Progress</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
