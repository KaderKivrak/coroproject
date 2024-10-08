import { prisma } from '../../lib/prisma';
import { Navbar } from '../component/navbar';
import AdminPanelClient from './AdminPanelClient'; // Klient-side komponent

export default async function AdminUploads() {
  // Hent alle uploads med status 'pending' på serveren
  const uploads = await prisma.upload.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <Navbar/>
      <h1>Admin Panel - Pending Uploads</h1>
      {/* Send upload-dataen til klientkomponenten for at håndtere statusændringer */}
      <AdminPanelClient uploads={uploads} />
    </div>
  );
}
