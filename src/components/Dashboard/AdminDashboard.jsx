import React from 'react';
import './../../styles/main.css';
import './../../styles/dashboard.css';

const AdminDashboard = ({ userEmail, onLogout }) => {
    return (
        <div>
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>CattleEnterprise Administration Panel</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <i className="fas fa-users"></i>
                        <h3>Total Users</h3>
                        <p>156</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-cow"></i>
                        <h3>Total Cattle</h3>
                        <p>1,245</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-industry"></i>
                        <h3>Daily Production</h3>
                        <p>5,670L</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-money-bill-wave"></i>
                        <h3>Total Revenue</h3>
                        <p>₹12.5L</p>
                    </div>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <i className="fas fa-user-cog"></i>
                        <h3>User Management</h3>
                        <p>Manage all user accounts, permissions, and system access controls.</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-database"></i>
                        <h3>Data Analytics</h3>
                        <p>Comprehensive analytics and reports for business intelligence.</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-cogs"></i>
                        <h3>System Settings</h3>
                        <p>Configure system parameters, OTP settings, and application preferences.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;