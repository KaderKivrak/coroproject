'use client';

import { useState } from 'react';
import React from 'react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';

//upload felt
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
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState<{ [id: number]: string }>({});
  const {data: session} = useSession();
  const handleStatusChange = async (id: number, newStatus: string) => {
    setMessage('');

    //opdater status
    const res = await fetch(`/api/admin/update-upload-status`, {
      method: 'POST',
      body: JSON.stringify({ id, status: newStatus, feedback: feedbacks[id] }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === id ? { ...upload, status: newStatus, feedbacks } : upload
        )
      );

      //besked
      setMessage(`Status opdateret ${newStatus}.`);
      setFeedbacks('');
    } else {
      setMessage('Status kan ikke opdateres');
    }
  };

  return (
    <div>
      {session?.user.role === "admin" ? (
    <div>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <ul>
        {uploads.length === 0 ? (
          <p>Ingen projekter</p>
        ) : (
          uploads.map((upload) => (
            <li key={upload.id}>
              <p>
              <h1>Projekter til godkendelse</h1>
              <strong>Navn:</strong> {upload.name}<br />
                <strong>Fil:</strong> {upload.fileName}<br />
                <strong>Beskrivelse:</strong> {upload.description}<br />
                <strong>Status:</strong> {upload.status}<br />
                {upload.status === 'pending' && (
                  <>
                    <textarea
                     placeholder="Enter feedback"
                     value={feedbacks[upload.id] || ''}
                     onChange={(e) =>
                      setFeedbacks((prevFeedbacks) => ({
                       ...prevFeedbacks,
                       [upload.id]: e.target.value,
                      }))
                     }
                    ></textarea>

                    <button onClick={() => handleStatusChange(upload.id, 'approved')}>Godkend</button>
                    <button onClick={() => handleStatusChange(upload.id, 'rejected')}>Afvis</button>
                  </>
                )}
                {upload.feedback && <p><strong>Feedback:</strong> {upload.feedback}</p>}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
      ): notFound()}
    </div>
  );
}
