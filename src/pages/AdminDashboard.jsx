import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Star, Users, Database, RefreshCw } from 'lucide-react';
import { getUsers, getLeads } from '../services/db';
import './Admin.css';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsRefreshing(true);
    const [leadsData, membersData] = await Promise.all([
      getLeads(),
      getUsers()
    ]);
    setLeads(leadsData);
    setMembers(membersData);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown';
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar Nav */}
      <nav className="admin-sidebar glass-panel">
        <div className="sidebar-header">
          <h2>JR Admin</h2>
          <p>Command Center</p>
        </div>

        <ul className="sidebar-nav">
          <li>
            <button 
              className={`nav-btn ${activeTab === 'leads' ? 'active' : ''}`}
              onClick={() => setActiveTab('leads')}
            >
              <Star size={18} /> Elite Applications
              {leads.length > 0 && <span className="badge">{leads.length}</span>}
            </button>
          </li>
          <li>
            <button 
              className={`nav-btn ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              <Users size={18} /> Directory Members
              <span className="badge">{members.length}</span>
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button className="nav-btn" onClick={fetchData} disabled={isRefreshing} style={{marginBottom: '0.5rem'}}>
            <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} /> Refresh Data
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Terminate Session
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-topbar glass-panel">
          <h1>{activeTab === 'leads' ? 'Elite Core Applications' : 'Registered Directory Members'}</h1>
        </header>

        <div className="admin-content">
          {activeTab === 'leads' && (
            <div className="table-container glass-panel">
              {leads.length === 0 ? (
                <div className="empty-state">
                  <Database size={48} />
                  <p>No elite applications received yet.</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Role Interest</th>
                      <th>Contact</th>
                      <th>Experience Brief</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, idx) => (
                      <tr key={lead.id || idx}>
                        <td className="date-col">{formatDate(lead.submitted_at)}</td>
                        <td className="name-col">{lead.name}</td>
                        <td><span className="role-chip">{lead.role_interest}</span></td>
                        <td>{lead.contact}</td>
                        <td className="exp-col">
                          <div className="exp-text">{lead.experience}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Joined</th>
                    <th>Name / Location</th>
                    <th>Roles</th>
                    <th>Primary Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td className="date-col">{formatDate(member.created_at)}</td>
                      <td className="name-col">
                        <div>{member.name}</div>
                        <div style={{fontSize: '0.8rem', color: 'var(--color-text-secondary)'}}>{member.location}</div>
                      </td>
                      <td>
                        <div className="table-tags">
                          {member.role.map((r, i) => (
                            <span key={i} className="small-tag">{r}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div>{member.contact_email}</div>
                        <div style={{fontSize: '0.85rem'}}>{member.contact_phone}</div>
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
}
