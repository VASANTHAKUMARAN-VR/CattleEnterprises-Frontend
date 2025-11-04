import React, { useState, useEffect } from 'react';
import { cowSaleAPI } from '../../services/api';
import '../../styles/cow-sale.css';

const CowSaleList = ({ userId, onAddNew, onEditSale }) => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadSales();
    }, [userId]);

    const loadSales = async () => {
        try {
            const response = await cowSaleAPI.getUserSales(userId);
            if (Array.isArray(response.data)) {
                setSales(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setSales(response.data.data);
            } else {
                setSales([]);
            }
        } catch (error) {
            setMessage('Failed to load sales');
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sale record?')) {
            return;
        }

        try {
            await cowSaleAPI.deleteCowSale(id, userId);
            setMessage('Sale record deleted successfully');
            loadSales();
        } catch (error) {
            setMessage('Failed to delete sale record');
        }
    };

    const calculateTotals = () => {
        return {
            totalCowsSold: sales.reduce((sum, sale) => sum + sale.quantity, 0),
            totalRevenue: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
            avgPricePerCow: sales.length > 0 ? 
                sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / 
                sales.reduce((sum, sale) => sum + sale.quantity, 0) : 0,
            saleCount: sales.length
        };
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading sale records...</p>
            </div>
        );
    }

    const totals = calculateTotals();

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <i className="fas fa-money-bill-wave"></i>
                        <h1>Cow Sale Management</h1>
                    </div>
                    <button className="btn-pr" onClick={onAddNew}>
                        + Add New Sale
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

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    {/* <div className="stat-icon">
                        <i className="fas fa-cow"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>{totals.totalCowsSold}</h3>
                        <p>Total Cows Sold</p>
                    </div>
                </div>

                <div className="stat-card success">
                    {/* <div className="stat-icon">
                        <i className="fas fa-money-bill-wave"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>₹{totals.totalRevenue.toLocaleString('en-IN')}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>

                <div className="stat-card warning">
                    {/* <div className="stat-icon">
                        <i className="fas fa-calculator"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>₹{totals.avgPricePerCow.toLocaleString('en-IN', {maximumFractionDigits: 0})}</h3>
                        <p>Avg Price/Cow</p>
                    </div>
                </div>

                <div className="stat-card info">
                    {/* <div className="stat-icon">
                        <i className="fas fa-list"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>{totals.saleCount}</h3>
                        <p>Total Sales</p>
                    </div>
                </div>
            </div>

            {/* Sales List */}
            {sales.length === 0 ? (
                <div className="empty-state">
                    {/* <div className="empty-icon">
                        <i className="fas fa-money-bill-wave"></i>
                    </div> */}
                    <h3>No Sale Records Found</h3>
                    <p>Start tracking your cow sales by adding your first record</p>
                    <button className="btn btn-primary" onClick={onAddNew}>
                        Add First Sale
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Buyer Name</th>
                                    <th>Quantity</th>
                                    <th>Total Amount</th>
                                    <th>Price/Cow</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale) => (
                                    <tr key={sale.id}>
                                        <td>
                                            <div className="date-cell">
                                                <div className="date-main">
                                                    {new Date(sale.date).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short'
                                                    })}
                                                </div>
                                                <div className="date-year">
                                                    {new Date(sale.date).getFullYear()}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="buyer-cell">
                                                <i className="fas fa-user"></i>
                                                {sale.buyerName}
                                            </div>
                                        </td>
                                        <td className="number-cell">
                                            <span className="quantity-badge">
                                                {sale.quantity}
                                            </span>
                                        </td>
                                        <td className="amount-cell">
                                            {sale.totalAmount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="number-cell">
                                            ₹{((sale.totalAmount / sale.quantity)).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn-action edit"
                                                    onClick={() => onEditSale(sale)}
                                                    title="Edit Sale"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="btn-action delete"
                                                    onClick={() => handleDelete(sale.id)}
                                                    title="Delete Sale"
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

export default CowSaleList;