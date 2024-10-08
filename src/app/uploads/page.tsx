'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../component/navbar';

// Definer en type for hver upload
interface Upload {
  id: number;
  fileName: string;
  name: string;
  description: string;
  company: string;
  status: string;
  feedback: any;
}

export default function UserUploads() {
  const [uploads, setUploads] = useState<Upload[]>([]);

  // Hent brugerens uploads ved page load
  useEffect(() => {
    async function fetchUploads() {
      const res = await fetch('/api/uploads');
      const data = await res.json();
      setUploads(data.uploads);
    }
    fetchUploads();
  }, []);

  return (
    <div className="upload-container">
      <Navbar/>
      <h1>Your Uploads</h1>
      {uploads.length === 0 ? (
        <p>No uploads yet</p>
      ) : (
        <ul>
          {uploads.map((upload) => (
            <li key={upload.id}>
              <p>
                <strong>File Name:</strong> {upload.fileName}<br />
                <strong>Status:</strong> {upload.status === 'pending' ? 'In Process' : upload.status === 'approved' ? 'Approved' : 'Rejected'}<br />
                {/* Tilføj feedback hvis det findes */}
                {upload.feedback && (
                  <p>
                    <strong>Feedback:</strong> {upload.feedback}
                  </p>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
