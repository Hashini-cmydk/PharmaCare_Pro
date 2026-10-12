import React from 'react';
import { useEffect, useState } from 'react';
import { api, useAuth } from '../context/AuthContext';
import { Plus, Search, Edit3, Trash2, X, Pill, AlertTriangle, CalendarX } from 'lucide-react';

// Empty form values used when adding a new medicine
const empty = {
  name: '',
  category: '',
  batchNumber: '',
  quantity: 0,
  unitPrice: 0,
  expiryDate: '',
  reorderLevel: 10,
  supplier: '',
};

// Medicines expiring within this many days are shown as "Expiring soon"
const EXPIRY_WARNING_DAYS = 30;

// Work out the status of one medicine: expired, expiring soon, low stock or normal
function getStatus(m) {
  const today = new Date();
  const expiry = new Date(m.expiryDate);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (expiry < today) return 'Expired';
  if (daysLeft <= EXPIRY_WARNING_DAYS) return 'Expiring soon';
  if (m.quantity <= m.reorderLevel) return 'Low stock';
  return 'Normal';
}

// Colour of the small status badge for each status
const badgeStyle = {
  Expired: 'bg-red-100 text-red-700',
  'Expiring soon': 'bg-orange-100 text-orange-700',
  'Low stock': 'bg-amber-100 text-amber-700',
  Normal: 'bg-emerald-100 text-emerald-700',
};

export default function Inventory() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // NEW: status filter
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [edit, setEdit] = useState(null);

  // Load medicines from the backend (uses the search text q)
  const load = () => api.get('/medicines', { params: { q } }).then((r) => setItems(r.data));

  useEffect(() => {
    load();
    api.get('/suppliers').then((r) => setSuppliers(r.data));
  }, []);

  // Save a new medicine, or update an existing one
  const save = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
      reorderLevel: Number(form.reorderLevel),
      supplier: form.supplier || undefined,
    };
    if (edit) await api.put(`/medicines/${edit}`, body);
    else await api.post('/medicines', body);
    setOpen(false);
    setEdit(null);
    setForm(empty);
    load();
  };

  // Cashiers can only view, they cannot add / edit / delete
  const canEdit = user.role !== 'CASHIER';

  // NEW: numbers for the summary cards
  const total = items.length;
  const lowCount = items.filter((m) => getStatus(m) === 'Low stock').length;
  const expiringCount = items.filter((m) => ['Expired', 'Expiring soon'].includes(getStatus(m))).length;

  // NEW: apply the status filter on the loaded list
  const visibleItems = items.filter((m) => statusFilter === 'All' || getStatus(m) === statusFilter);

  return (
    <div className="space-y-5">
      {/* Page heading + Add button */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Medicine Inventory</h2>
          <p className="text-slate-500">Manage medicines, batches, stock and expiry dates.</p>
        </div>
        {canEdit && (
          <button
            className="btn-primary"
            onClick={() => {
              setForm(empty);
              setEdit(null);
              setOpen(true);
            }}
          >
            <Plus size={18} />
            Add Medicine
          </button>
        )}
      </div>

      {/* NEW: summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={<Pill size={20} />} label="Total medicines" value={total} color="bg-sky-100 text-sky-700" />
        <StatCard icon={<AlertTriangle size={20} />} label="Low stock" value={lowCount} color="bg-amber-100 text-amber-700" />
        <StatCard icon={<CalendarX size={20} />} label="Expired / expiring soon" value={expiringCount} color="bg-red-100 text-red-700" />
      </div>

      {/* Search box + NEW status filter */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            className="input pl-10"
            placeholder="Search medicine, category or batch..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
        </div>
        <select className="input !w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {['All', 'Normal', 'Low stock', 'Expiring soon', 'Expired'].map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All statuses' : s}
            </option>
          ))}
        </select>
      </div>

      {/* Medicine table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['Medicine', 'Category', 'Batch', 'Stock', 'Price', 'Expiry', 'Supplier', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((m) => {
                const status = getStatus(m);
                const expired = status === 'Expired';
                const lowStock = m.quantity <= m.reorderLevel;
                return (
                  <tr key={m._id} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold">{m.name}</td>
                    <td className="px-4 py-4">{m.category}</td>
                    <td className="px-4 py-4">{m.batchNumber}</td>
                    {/* Stock number turns red when it is at or below the reorder level */}
                    <td className={`px-4 py-4 ${lowStock ? 'text-red-600 font-semibold' : ''}`}>{m.quantity}</td>
                    <td className="px-4 py-4">LKR {m.unitPrice.toFixed(2)}</td>
                    <td className={`px-4 py-4 ${expired ? 'text-red-600 font-semibold' : ''}`}>
                      {new Date(m.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">{m.supplier?.name || '—'}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyle[status]}`}>{status}</span>
                    </td>
                    <td className="px-4 py-4">
                      {canEdit && (
                        <div className="flex gap-2">
                          <button
                            className="btn-secondary !p-2"
                            onClick={() => {
                              setForm({ ...m, expiryDate: m.expiryDate.slice(0, 10), supplier: m.supplier?._id || '' });
                              setEdit(m._id);
                              setOpen(true);
                            }}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            className="btn-secondary !p-2 text-red-600"
                            onClick={async () => {
                              if (confirm('Deactivate this medicine?')) {
                                await api.delete(`/medicines/${m._id}`);
                                load();
                              }
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!visibleItems.length && <div className="p-10 text-center text-slate-400">No medicines found.</div>}
        </div>
      </div>

      {/* Add / Edit popup */}
      {open && (
        <Modal title={edit ? 'Edit Medicine' : 'Add Medicine'} close={() => setOpen(false)}>
          <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
            {[
              ['name', 'Medicine Name'],
              ['category', 'Category'],
              ['batchNumber', 'Batch Number'],
              ['quantity', 'Quantity'],
              ['unitPrice', 'Unit Price'],
              ['expiryDate', 'Expiry Date'],
              ['reorderLevel', 'Reorder Level'],
            ].map(([k, l]) => (
              <div key={k}>
                <label className="label">{l}</label>
                <input
                  className="input"
                  required
                  value={form[k] ?? ''}
                  type={['quantity', 'unitPrice', 'reorderLevel'].includes(k) ? 'number' : k === 'expiryDate' ? 'date' : 'text'}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label className="label">Supplier</label>
              <select className="input" value={form.supplier || ''} onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
                <option value="">Select supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary">Save Medicine</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// NEW: small summary card used at the top of the page
function StatCard({ icon, label, value, color }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-slate-500 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// Popup window used for the Add / Edit form
function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={close}>
            <X />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
