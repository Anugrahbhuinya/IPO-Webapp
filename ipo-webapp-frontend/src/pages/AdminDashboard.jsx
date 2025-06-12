import React from 'react';
import AddIPOForm from '../components/Admin/AddIPOForm';
import UserList from '../components/Admin/UserList';
import AdminIPOList from '../components/Admin/AdminIPOList';
import IPOSyncControl from '../components/Admin/IPOSyncControl'; // Add this import

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
      
      {/* Section for Real-Time IPO Data Sync */}
      <section className="mb-8">
        <IPOSyncControl />
      </section>
      
      {/* Section for Adding IPOs */}
      <section className="mb-8">
        <AddIPOForm />
      </section>

      {/* Section for Managing Users */}
      <section className="mb-8">
        <UserList />
      </section>

      {/* Section for Managing IPOs */}
      <section className="mb-8">
        <AdminIPOList />
      </section>

    </div>
  );
};

export default AdminDashboardPage;
