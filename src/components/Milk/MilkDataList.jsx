import React, { useState, useEffect } from 'react';
import { milkAPI } from '../../services/api';
import '../../styles/milk.css';

const MilkDataList = ({ userId, onAddNew, onEditMilkData }) => {
    const [milkData, setMilkData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');

    useEffect(() => {
        loadMilkData();
    }, [userId]);

    const loadMilkData = async () => {
        try {
            const response = await milkAPI.getUserMilkData(userId);
            if (Array.isArray(response.data)) {
                setMilkData(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setMilkData(response.data.data);
            } else {
                setMilkData([]);
            }
        } catch (error) {
            setMessage('Failed to load milk data');
            setMilkData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this milk record?')) {
            return;
        }

        try {
            await milkAPI.deleteMilkData(id, userId);
            setMessage('Milk record deleted successfully');
            loadMilkData();
        } catch (error) {
            setMessage('Failed to delete milk record');
        }
    };

    const getFilteredData = () => {
        let filtered = milkData;

        // Session filter
        if (filter !== 'all') {
            filtered = filtered.filter(item => item.session === filter);
        }

        // Date range filter
        if (dateRange !== 'all') {
            const today = new Date();
            const startDate = new Date();
            
            switch (dateRange) {
                case 'today':
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    startDate.setDate(today.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(today.getMonth() - 1);
                    break;
                default:
                    break;
            }

            filtered = filtered.filter(item => new Date(item.date) >= startDate);
        }

        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const calculateTotals = (data) => {
        return {
            totalLiters: data.reduce((sum, item) => sum + item.liters, 0),
            totalAmount: data.reduce((sum, item) => sum + item.amount, 0),
            avgFat: data.length > 0 ? data.reduce((sum, item) => sum + item.fat, 0) / data.length : 0,
            avgSNF: data.length > 0 ? data.reduce((sum, item) => sum + item.snf, 0) / data.length : 0,
            recordCount: data.length
        };
    };

    const filteredData = getFilteredData();
    const totals = calculateTotals(filteredData);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading milk records...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <i className="fas fa-wine-bottle"></i>
                        <h1>Milk Production Dashboard</h1>
                    </div>
                    <button className='btn-pr' onClick={onAddNew}>
                        + Add New Record
                    </button>
                </div>
            </div>

            {/* Alert Message */}
            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                    <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {message}
                </div>
            )}

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filter-group">
                    <label>Session Filter:</label>
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Sessions
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'morning' ? 'active' : ''}`}
                            onClick={() => setFilter('morning')}
                        >
                            <i className="fas fa-sun"></i> Morning
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'evening' ? 'active' : ''}`}
                            onClick={() => setFilter('evening')}
                        >
                            <i className="fas fa-moon"></i> Evening
                        </button>
                    </div>
                </div>

            </div>

         {/* Statistics Cards - FIXED SIZES */}
<div className="stats-grid">
    <div className="stat-card primary">
        {/* <div className="stat-icon">
            <i className="fas fa-wine-bottle"></i>
        </div> */}
        <div className="stat-content">
            <h3>{totals.totalLiters.toFixed(2)}L</h3>
            <p>Total Milk</p>
        </div>
    </div>

    <div className="stat-card success">
        {/* <div className="stat-icon">
            <i className="fas fa-rupee-sign"></i>
        </div> */}
        <div className="stat-content">
            <h3>₹{totals.totalAmount.toFixed(2)}</h3>
            <p>Total Revenue</p>
        </div>
    </div>

    <div className="stat-card warning">
        {/* <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
        </div> */}
        <div className="stat-content">
            <h3>{totals.avgFat.toFixed(2)}%</h3>
            <p>Avg Fat</p>
        </div>
    </div>

    <div className="stat-card info">
        {/* <div className="stat-icon">
            <i className="fas fa-list"></i>
        </div> */}
        <div className="stat-content">
            <h3>{totals.recordCount}</h3>
            <p>Total Records</p>
        </div>
    </div>
</div>

            {/* Data Table */}
            {filteredData.length === 0 ? (
                <div className="empty-state">
                    {/* <div className="empty-icon">
                        <i className="fas fa-wine-bottle"></i>
                    </div> */}
                    <h3>No Milk Records Found</h3>
                    <p>Start tracking your milk production by adding your first record</p>
                    <button className="btn btn-primary" onClick={onAddNew}>
                     
                        Add First Record
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Session</th>
                                    <th>Liters</th>
                                    <th>Rate/L</th>
                                    <th>Fat %</th>
                                    <th>SNF %</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((record) => (
                                    <tr key={record.id}>
                                        <td>
                                            <div className="date-cell">
                                                <div className="date-main">
                                                    {new Date(record.date).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short'
                                                    })}
                                                </div>
                                                <div className="date-year">
                                                    {new Date(record.date).getFullYear()}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`session-badge ${record.session}`}>
                                                <i className={`fas ${record.session === 'morning' ? 'fa-sun' : 'fa-moon'}`}></i>
                                                {record.session}
                                            </span>
                                        </td>
                                        <td className="number-cell">{record.liters}L</td>
                                        <td className="number-cell">₹{record.rate}</td>
                                        <td className="number-cell">{record.fat}%</td>
                                        <td className="number-cell">{record.snf}%</td>
                                        <td className="amount-cell">{record.amount?.toFixed(2)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn-action edit"
                                                    onClick={() => onEditMilkData(record)}
                                                    title="Edit Record"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="btn-action delete"
                                                    onClick={() => handleDelete(record.id)}
                                                    title="Delete Record"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MilkDataList;