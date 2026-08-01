import React, { useState } from 'react';
import './UploadForm.css';

export default function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title || file.name);
    formData.append('description', description);
    formData.append('category', category);

    try {
      setLoading(true);
      const res = await fetch('/api/pdfs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // NOTE: Do NOT set Content-Type for FormData; the browser sets the multipart boundary.
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      setSuccess('Upload successful');
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory('General');

      // Notify parent to refresh or append
      if (typeof onUpload === 'function') onUpload(data);
    } catch (err) {
      console.error(err);
      setError('Network error during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <div className="upload-row">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>

      <div className="upload-row">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="upload-row">
        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="upload-row">
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="upload-row">
        <button type="submit" disabled={loading} className="upload-submit">
          {loading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </div>

      {error && <div className="upload-error">{error}</div>}
      {success && <div className="upload-success">{success}</div>}
    </form>
  );
}
