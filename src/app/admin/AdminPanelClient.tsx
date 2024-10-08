'use client';

import { useState } from 'react';
import React from 'react';

interface Upload {
  name: string;
  id: number;
  fileName: string;
  description: string;
  status: string;
  feedback?: any;
}

export default function AdminPanelClient({ uploads: initialUploads }: { uploads: Upload[] }) {
  const [uploads, setUploads] = useState(initialUploads);
  const [message, setMessage] = useState(''); // Til bekræftelse
  const [feedback, setFeedback] = useState(''); // Feedback-tilstand
  const [currentId, setCurrentId] = useState(1);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setMessage(''); // Nulstil beskeden før handling

    const res = await fetch(`/api/admin/update-upload-status`, {
      method: 'POST',
      body: JSON.stringify({ id, status: newStatus, feedback }), // Send feedback sammen med status
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      // Opdater upload-listen dynamisk
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === id ? { ...upload, status: newStatus, feedback } : upload
        )
      );
      // Vis en bekræftelsesbesked
      setMessage(`Upload status updated to ${newStatus}.`);
      setFeedback(''); // Nulstil feedback
    } else {
      setMessage('Failed to update upload status.');
    }
  };

  return (
    <div>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <ul>
        {uploads.length === 0 ? (
          <p>No pending uploads</p>
        ) : (
          uploads.map((upload) => (
            <li key={upload.id}>
              <p>
              <strong>Name:</strong> {upload.name}<br />
                <strong>File Name:</strong> {upload.fileName}<br />
                <strong>Description:</strong> {upload.description}<br />
                <strong>Status:</strong> {upload.status}<br />
                {upload.status === 'pending' && (
                  <>
                    <textarea
                      placeholder="Enter feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>
                    <button onClick={() => handleStatusChange(upload.id, 'approved')}>Approve</button>
                    <button onClick={() => handleStatusChange(upload.id, 'rejected')}>Reject</button>
                  </>
                )}
                {upload.feedback && <p><strong>Feedback:</strong> {upload.feedback}</p>}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
