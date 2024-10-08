'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../component/navbar';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');

  // Handle file upload
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('company', company);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setMessage('File uploaded successfully!');
      setFile(null);
      setName('');
      setDescription('');
      setCompany('');
    } else {
      setMessage('File upload failed.');
    }
  };

  return (
    <div className="upload-page">
      <Navbar/>
      <h1>Upload New File</h1>
      <div className="button-container">
        <Link href="/uploads">
          <button type="button" className="button">Go to Uploads</button>
        </Link>
      </div>

      <div className="upload-container">
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">File</label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <button type="submit">Upload</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

