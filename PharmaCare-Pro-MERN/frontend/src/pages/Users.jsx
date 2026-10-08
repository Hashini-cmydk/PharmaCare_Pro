import React, {useMemo, useState} from 'react';
import {Plus, Search, ShieldCheck, UserCog, Users as UsersIcon} from 'lucide-react';

const initialUsers = [
  {id: 1, name: 'Mr. Supun Gamage', email: 'owner@pharmacarepro.com', role: 'Owner', branch: 'Main Branch - Colombo', status: 'Active', lastActive: '2 min ago'},
  {id: 2, name: 'System Administrator', email: 'admin@pharmacarepro.com', role: 'Administrator', branch: 'Main Branch - Colombo', status: 'Active', lastActive: '12 min ago'},
  {id: 3, name: 'Front Counter Cashier', email: 'cashier@pharmacarepro.com', role: 'Cashier', branch: 'Main Branch - Colombo', status: 'Active', lastActive: '1 hour ago'},
  {id: 4, name: 'Inventory Officer', email: 'inventory@pharmacarepro.com', role: 'Administrator', branch: 'Kandy Branch', status: 'On leave', lastActive: 'Yesterday'},
];

const roleColors = {
  Owner: 'bg-blue-100 text-blue-700',
  Administrator: 'bg-violet-100 text-violet-700',
  Cashier: 'bg-amber-100 text-amber-700',
};

const statusColors = {
  Active: 'bg-emerald-100 text-emerald-700',
  'On leave': 'bg-slate-200 text-slate-700',
  Inactive: 'bg-red-100 text-red-700',
};

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({name: '', email: '', role: 'Cashier', branch: 'Main Branch - Colombo'});

  const filteredUsers = useMemo(() => {
    const value = q.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) => [user.name, user.email, user.role, user.branch].some((field) => String(field).toLowerCase().includes(value)));
  }, [q, users]);

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'Active').length,
    admins: users.filter((u) => ['Owner', 'Administrator'].includes(u.role)).length,
    cashiers: users.filter((u) => u.role === 'Cashier').length,
  };

  const addUser = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setUsers((current) => [
      {
        id: Date.now(),
        name: form.name,
        email: form.email,
        role: form.role,
        branch: form.branch,
        status: 'Active',
        lastActive: 'Just now',
      },
      ...current,
    ]);

    setForm({name: '', email: '', role: 'Cashier', branch: 'Main Branch - Colombo'});
  };

  const toggleStatus = (id) => {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active', lastActive: 'Just now' } : user));
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold">User Management</h2>
          <p className="text-slate-500">Manage pharmacy staff, access levels, and branch assignment.</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span>Total users</span>
            <UsersIcon size={18} className="text-brand-600" />
          </div>
          <div className="mt-3 text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span>Active</span>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <div className="mt-3 text-3xl font-bold">{stats.active}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span>Admins</span>
            <UserCog size={18} className="text-violet-600" />
          </div>
          <div className="mt-3 text-3xl font-bold">{stats.admins}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span>Cashiers</span>
            <UsersIcon size={18} className="text-amber-600" />
          </div>
          <div className="mt-3 text-3xl font-bold">{stats.cashiers}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg font-semibold">Staff List</h3>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input className="input pl-10" placeholder="Search staff..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last active</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-4 py-4">
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${roleColors[user.role] || 'bg-slate-100 text-slate-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{user.branch}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[user.status] || 'bg-slate-100 text-slate-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{user.lastActive}</td>
                    <td className="px-4 py-4">
                      <button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => toggleStatus(user.id)}>
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!filteredUsers.length && (
              <div className="p-10 text-center text-slate-400">No staff match your search.</div>
            )}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-xl font-bold">Add New User</h3>
          <p className="mt-1 text-sm text-slate-500">Create a staff account for pharmacy operations.</p>

          <form className="mt-5 space-y-4" onSubmit={addUser}>
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pharmacy Assistant" />
            </div>

            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@pharmacare.com" />
            </div>

            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option>Owner</option>
                <option>Administrator</option>
                <option>Cashier</option>
              </select>
            </div>

            <div>
              <label className="label">Branch</label>
              <input className="input" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="Main Branch - Colombo" />
            </div>

            <button className="btn-primary w-full" type="submit">Create User</button>
          </form>
        </div>
      </div>
    </div>
  );
}
