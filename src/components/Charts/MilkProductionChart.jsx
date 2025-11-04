import React, { useState, useEffect } from 'react';
import { milkAPI } from '../../services/api';
import '../../styles/milk-chart.css';

const MilkProductionChart = ({ userId }) => {
    const [milkData, setMilkData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        loadMilkData();
    }, [userId]);

    const loadMilkData = async () => {
        try {
            setLoading(true);
            const response = await milkAPI.getUserMilkData(userId);
            let data = [];
            
            if (Array.isArray(response.data)) {
                data = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                data = response.data.data;
            }
            setMilkData(data);
        } catch (error) {
            console.error('Error loading milk data:', error);
            setMilkData([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStats = () => {
        const totalLiters = milkData.reduce((sum, item) => sum + (item.liters || 0), 0);
        const totalAmount = milkData.reduce((sum, item) => sum + (item.amount || 0), 0);
        const avgFat = milkData.length > 0 ? milkData.reduce((sum, item) => sum + (item.fat || 0), 0) / milkData.length : 0;
        const avgSNF = milkData.length > 0 ? milkData.reduce((sum, item) => sum + (item.snf || 0), 0) / milkData.length : 0;

        return {
            totalLiters,
            totalAmount,
            avgFat,
            avgSNF,
            recordCount: milkData.length
        };
    };

    // Prepare daily data for charts
    const getDailyData = () => {
        const dailyData = {};
        
        milkData.forEach(record => {
            if (!record.date) return;
            
            const date = new Date(record.date);
            const dateKey = date.toISOString().split('T')[0];
            const displayDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
            
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                    date: displayDate,
                    morning: 0,
                    evening: 0,
                    total: 0,
                    amount: 0
                };
            }
            
            if (record.session === 'morning') {
                dailyData[dateKey].morning += record.liters || 0;
            } else if (record.session === 'evening') {
                dailyData[dateKey].evening += record.liters || 0;
            }
            
            dailyData[dateKey].total += record.liters || 0;
            dailyData[dateKey].amount += record.amount || 0;
        });

        return Object.values(dailyData)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-15); // Last 15 days
    };

    // Prepare session comparison data
    const getSessionComparison = () => {
        const sessionData = {
            morning: { liters: 0, amount: 0, count: 0 },
            evening: { liters: 0, amount: 0, count: 0 }
        };

        milkData.forEach(record => {
            if (record.session === 'morning') {
                sessionData.morning.liters += record.liters || 0;
                sessionData.morning.amount += record.amount || 0;
                sessionData.morning.count += 1;
            } else if (record.session === 'evening') {
                sessionData.evening.liters += record.liters || 0;
                sessionData.evening.amount += record.amount || 0;
                sessionData.evening.count += 1;
            }
        });

        return sessionData;
    };

    // Bar Chart Component
    const BarChart = ({ data, title, valueType = 'total', color = '#3498db' }) => {
        if (!data || data.length === 0) {
            return (
                <div className="chart-container">
                    <h3>{title}</h3>
                    <div className="no-data">No data available</div>
                </div>
            );
        }

        const values = data.map(item => item[valueType]);
        const maxValue = Math.max(...values);

        return (
            <div className="chart-container">
                <h3>{title}</h3>
                <div className="bar-chart">
                    {data.map((item, index) => {
                        const value = item[valueType];
                        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        
                        return (
                            <div key={index} className="bar-item">
                                <div className="bar-label">{item.date}</div>
                                <div className="bar-track">
                                    <div 
                                        className="bar-fill" 
                                        style={{ 
                                            height: `${percentage}%`,
                                            backgroundColor: color
                                        }}
                                        title={`${value}L`}
                                    ></div>
                                </div>
                                <div className="bar-value">
                                    {value}L
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Stacked Bar Chart Component
    const StackedBarChart = ({ data, title }) => {
        if (!data || data.length === 0) {
            return (
                <div className="chart-container">
                    <h3>{title}</h3>
                    <div className="no-data">No data available</div>
                </div>
            );
        }

        const maxTotal = Math.max(...data.map(item => item.total));

        return (
            <div className="chart-container">
                <h3>{title}</h3>
                <div className="stacked-bar-chart">
                    {data.map((item, index) => (
                        <div key={index} className="stacked-bar-item">
                            <div className="bar-label">{item.date}</div>
                            <div className="stacked-bar-track">
                                <div
                                    className="stacked-bar-segment morning"
                                    style={{
                                        height: maxTotal > 0 ? (item.morning / maxTotal) * 100 : 0
                                    }}
                                    title={`Morning: ${item.morning}L`}
                                ></div>
                                <div
                                    className="stacked-bar-segment evening"
                                    style={{
                                        height: maxTotal > 0 ? (item.evening / maxTotal) * 100 : 0
                                    }}
                                    title={`Evening: ${item.evening}L`}
                                ></div>
                            </div>
                            <div className="bar-value">
                                {item.total}L
                            </div>
                        </div>
                    ))}
                </div>
                <div className="stacked-legend">
                    <div className="legend-item">
                        <div className="legend-color morning"></div>
                        <span>Morning</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color evening"></div>
                        <span>Evening</span>
                    </div>
                </div>
            </div>
        );
    };

    // Session Comparison Component
    const SessionComparison = ({ data, title }) => {
        if (!data || (data.morning.liters === 0 && data.evening.liters === 0)) {
            return (
                <div className="chart-container">
                    <h3>{title}</h3>
                    <div className="no-data">No session data available</div>
                </div>
            );
        }

        const totalLiters = data.morning.liters + data.evening.liters;
        const morningPercentage = totalLiters > 0 ? (data.morning.liters / totalLiters) * 100 : 0;
        const eveningPercentage = totalLiters > 0 ? (data.evening.liters / totalLiters) * 100 : 0;

        return (
            <div className="chart-container">
                <h3>{title}</h3>
                <div className="session-comparison">
                    <div className="session-bar">
                        <div 
                            className="session-fill morning"
                            style={{ width: `${morningPercentage}%` }}
                        >
                            <span className="session-label">
                                <i className="fas fa-sun"></i>
                                Morning: {data.morning.liters.toFixed(1)}L ({morningPercentage.toFixed(1)}%)
                            </span>
                        </div>
                        <div 
                            className="session-fill evening"
                            style={{ width: `${eveningPercentage}%` }}
                        >
                            <span className="session-label">
                                <i className="fas fa-moon"></i>
                                Evening: {data.evening.liters.toFixed(1)}L ({eveningPercentage.toFixed(1)}%)
                            </span>
                        </div>
                    </div>
                    <div className="session-stats">
                        <div className="session-stat">
                            <i className="fas fa-sun"></i>
                            <div>
                                <strong>{data.morning.liters.toFixed(1)}L</strong>
                                <span>Morning Production</span>
                            </div>
                        </div>
                        <div className="session-stat">
                            <i className="fas fa-moon"></i>
                            <div>
                                <strong>{data.evening.liters.toFixed(1)}L</strong>
                                <span>Evening Production</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const stats = calculateStats();
    const dailyData = getDailyData();
    const sessionData = getSessionComparison();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading milk production data...</p>
            </div>
        );
    }

    return (
        <div className="milk-production-chart">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <i className="fas fa-chart-line"></i>
                        <h1>Milk Production Analytics</h1>
                    </div>
                    <button className="btn-refresh" onClick={loadMilkData}>
                        <i className="fas fa-sync-alt"></i>
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-content">
                        <h3>{stats.totalLiters.toFixed(1)}L</h3>
                        <p>Total Milk Production</p>
                    </div>
                </div>
                <div className="stat-card success">
                    <div className="stat-content">
                        <h3>₹{stats.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="stat-card warning">
                    <div className="stat-content">
                        <h3>{stats.avgFat.toFixed(2)}%</h3>
                        <p>Average Fat</p>
                    </div>
                </div>
                <div className="stat-card info">
                    <div className="stat-content">
                        <h3>{stats.recordCount}</h3>
                        <p>Total Records</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-container">
                <div className="charts-row">
                    <StackedBarChart
                        data={dailyData}
                        title="Daily Milk Production by Session"
                    />
                    <BarChart
                        data={dailyData}
                        title="Total Daily Milk Production"
                        valueType="total"
                        color="#27ae60"
                    />
                </div>

                <div className="charts-row">
                    <SessionComparison
                        data={sessionData}
                        title="Session-wise Production Comparison"
                    />
                </div>

                <div className="charts-row">
                    <BarChart
                        data={dailyData}
                        title="Morning Session Production"
                        valueType="morning"
                        color="#f39c12"
                    />
                    <BarChart
                        data={dailyData}
                        title="Evening Session Production"
                        valueType="evening"
                        color="#3498db"
                    />
                </div>
            </div>
        </div>
    );
};

export default MilkProductionChart;