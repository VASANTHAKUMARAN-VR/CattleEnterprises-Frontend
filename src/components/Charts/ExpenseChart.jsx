import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../../services/api';
import './../../styles/expense-chart.css';

const ExpenseChart = ({ userId }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExpenses();
    }, [userId]);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const response = await expenseAPI.getUserExpenses(userId);
            setExpenses(response.data || []);
        } catch (error) {
            console.error('Error loading expenses:', error);
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate category totals
    const getCategoryTotals = () => {
        return {
            feed: expenses.reduce((sum, expense) => sum + expense.feedCost, 0),
            powder: expenses.reduce((sum, expense) => sum + expense.powderCost, 0),
            labour: expenses.reduce((sum, expense) => sum + expense.labourCost, 0),
            medical: expenses.reduce((sum, expense) => sum + expense.medicalCost, 0),
            machinery: expenses.reduce((sum, expense) => sum + expense.machineryCost, 0)
        };
    };

    // Pie Chart Component
    const PieChart = ({ data, title }) => {
        if (!data || Object.keys(data).length === 0) {
            return (
                <div className="chart-container">
                    <h3>{title}</h3>
                    <div className="no-data">No data available</div>
                </div>
            );
        }

        const total = Object.values(data).reduce((sum, value) => sum + value, 0);
        if (total === 0) {
            return (
                <div className="chart-container">
                    <h3>{title}</h3>
                    <div className="no-data">No expense data</div>
                </div>
            );
        }

        const categories = [
            { name: 'Feed', value: data.feed, color: '#27ae60', icon: 'fas fa-seedling' },
            { name: 'Powder', value: data.powder, color: '#3498db', icon: 'fas fa-bowl-rice' },
            { name: 'Labour', value: data.labour, color: '#e74c3c', icon: 'fas fa-users' },
            { name: 'Medical', value: data.medical, color: '#9b59b6', icon: 'fas fa-first-aid' },
            { name: 'Machinery', value: data.machinery, color: '#f39c12', icon: 'fas fa-tractor' }
        ].filter(cat => cat.value > 0);

        let currentAngle = 0;

        return (
            <div className="chart-container">
                <h3>{title}</h3>
                <div className="pie-chart-container">
                    <div className="pie-chart">
                        <svg viewBox="0 0 100 100" className="pie-svg">
                            {categories.map((category, index) => {
                                const percentage = (category.value / total) * 100;
                                const angle = (percentage / 100) * 360;
                                const largeArc = angle > 180 ? 1 : 0;
                                
                                const x1 = 50 + 40 * Math.cos(currentAngle * Math.PI / 180);
                                const y1 = 50 + 40 * Math.sin(currentAngle * Math.PI / 180);
                                const x2 = 50 + 40 * Math.cos((currentAngle + angle) * Math.PI / 180);
                                const y2 = 50 + 40 * Math.sin((currentAngle + angle) * Math.PI / 180);
                                
                                const pathData = [
                                    `M 50 50`,
                                    `L ${x1} ${y1}`,
                                    `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                                    `Z`
                                ].join(' ');
                                
                                const slice = (
                                    <path
                                        key={index}
                                        d={pathData}
                                        fill={category.color}
                                        stroke="#fff"
                                        strokeWidth="1"
                                        className="pie-slice"
                                    />
                                );
                                
                                currentAngle += angle;
                                return slice;
                            })}
                        </svg>
                    </div>
                    <div className="pie-legend">
                        {categories.map((category, index) => (
                            <div key={index} className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: category.color }}></div>
                                <div className="legend-content">
                                    <div className="legend-title">
                                        <i className={category.icon}></i>
                                        {category.name}
                                    </div>
                                    <div className="legend-value">
                                        ₹{category.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        <span className="legend-percentage">
                                            ({((category.value / total) * 100).toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const categoryTotals = getCategoryTotals();
    const totalExpenses = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading expense data...</p>
            </div>
        );
    }

    return (
        <div className="expense-chart">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <i className="fas fa-chart-pie"></i>
                        <h1>Expense Analytics</h1>
                    </div>
                    <button className="btn-refresh" onClick={loadExpenses}>
                        <i className="fas fa-sync-alt"></i>
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-content">
                        <h3>₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                        <p>Total Expenses</p>
                    </div>
                </div>
                <div className="stat-card feed">
                    <div className="stat-content">
                        <h3>₹{categoryTotals.feed.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                        <p>Feed Expenses</p>
                    </div>
                </div>
                <div className="stat-card labour">
                    <div className="stat-content">
                        <h3>₹{categoryTotals.labour.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                        <p>Labour Expenses</p>
                    </div>
                </div>
                <div className="stat-card records">
                    <div className="stat-content">
                        <h3>{expenses.length}</h3>
                        <p>Total Records</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-container">
                <PieChart
                    data={categoryTotals}
                    title="Expense Distribution"
                />
            </div>
        </div>
    );
};

export default ExpenseChart;