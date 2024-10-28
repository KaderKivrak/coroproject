'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  const { data: session, status } = useSession();
  const router = useRouter(); 
  const [uploads, setUploads] = useState<Upload[]>([]);


  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Hent brugerens uploads
  useEffect(() => {
    async function fetchUploads() {
      if (status === 'authenticated') {
        const res = await fetch('/api/uploads');
        const data = await res.json();
        setUploads(data.uploads);
      }
    }
    fetchUploads();
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="upload-container">
      <Navbar />
      <h1>Dine projekter</h1>
      {uploads.length === 0 ? (
        <p>Du har ingen projekter endnu</p>
      ) : (
        <ul>
          {uploads.map((upload) => (
            <li key={upload.id}>
              <p>
                <strong>Fil:</strong> {upload.fileName}<br />
                <strong>Status:</strong> {upload.status === 'pending' ? 'In Process' : upload.status === 'approved' ? 'Approved' : 'Rejected'}<br />
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
