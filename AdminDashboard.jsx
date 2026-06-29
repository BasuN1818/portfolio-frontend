import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dbMode, setDbMode] = useState('Checking...');

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contacts`);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      setContacts(data);

      // Determine database mode by checking the shape of the data or server output
      // (MySQL usually has raw timestamps, local usually has ISO strings, but we can also infer)
      if (data.length > 0) {
        // Just general success means backend is serving either mysql or fallback
        setDbMode('Active');
      } else {
        setDbMode('Active (0 entries)');
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Could not connect to the backend server. Make sure your server is running on port 5000.');
      setDbMode('Offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleGoBack = () => {
    // Navigate back to the home page by removing the query param
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Premium background gradient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-zinc-800 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              <h1 className="text-3xl md:text-5xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Control Center
              </h1>
            </div>
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
              Cinematic Message Hub & Data Table
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchContacts}
              className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl font-semibold text-sm hover:border-cyan-500/50 hover:bg-zinc-800/80 transition-all flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" className={`${loading ? 'animate-spin' : ''}`}>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleGoBack}
              className="px-6 py-2.5 bg-cyan-500 text-black rounded-xl font-bold text-sm hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
            >
              Back to Site
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-1">Total Submissions</p>
            <h2 className="text-4xl font-black text-white">{contacts.length}</h2>
          </div>

          <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-1">Server Connection</p>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dbMode === 'Offline' ? 'bg-red-500' : 'bg-emerald-400'}`} />
              {dbMode}
            </h2>
          </div>

          <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-pink-500" />
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-1">Filter Results</p>
            <h2 className="text-4xl font-black text-white">{filteredContacts.length}</h2>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or message content..."
            className="w-full bg-zinc-950/50 backdrop-blur-md border border-zinc-900 focus:border-cyan-500/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-zinc-600 outline-none transition-all"
          />
        </div>

        {/* Table/Card Container */}
        <div className="bg-zinc-950/40 backdrop-blur-md border border-zinc-900 rounded-3xl overflow-hidden">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-zinc-500 font-mono text-sm">Querying database...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Connection Failed</h3>
              <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed">{error}</p>
              <button 
                onClick={fetchContacts}
                className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold hover:border-cyan-500/50 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <p className="text-zinc-400 font-medium">No contact messages found</p>
              <p className="text-zinc-600 text-sm">Either the database is empty or no entries match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-950/90 text-zinc-400 font-mono text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold w-16 text-center">ID</th>
                    <th className="py-4 px-6 font-semibold">Sender Details</th>
                    <th className="py-4 px-6 font-semibold">Message</th>
                    <th className="py-4 px-6 font-semibold w-52">Received Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact, idx) => (
                    <tr 
                      key={contact.id || idx}
                      className="border-b border-zinc-900 hover:bg-zinc-900/20 transition-colors"
                    >
                      <td className="py-5 px-6 font-mono text-zinc-500 text-sm text-center">
                        {contact.id || idx + 1}
                      </td>
                      <td className="py-5 px-6 space-y-1">
                        <div className="text-white font-bold text-base tracking-wide">
                          {contact.name}
                        </div>
                        <div className="text-cyan-400/90 text-sm font-mono hover:text-cyan-300 transition-colors">
                          <a href={`mailto:${contact.email}`}>{contact.email}</a>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </td>
                      <td className="py-5 px-6 text-zinc-500 font-mono text-sm">
                        {contact.created_at ? new Date(contact.created_at).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
