import { prisma } from '../../lib/prisma';
import { Navbar } from '../component/navbar';
import AdminPanelClient from './AdminPanelClient';


export default async function AdminUploads() {
  const uploads = await prisma.upload.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
    
  });

  return (
      <div>
      <Navbar/>
      <AdminPanelClient uploads={uploads} />
      </div>
  );
}
