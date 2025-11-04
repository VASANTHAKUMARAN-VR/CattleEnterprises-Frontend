import React, { useState, useEffect } from 'react';
import { cowSaleAPI, cowPurchaseAPI } from '../../services/api';
import '../../styles/cow-transaction-chart.css';

const CowTransactionChart = ({ userId }) => {
    const [sales, setSales] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        loadData();
    }, [userId]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Sales data fetch
            const salesResponse = await cowSaleAPI.getUserSales(userId);
            let salesData = [];
            
            if (Array.isArray(salesResponse.data)) {
                salesData = salesResponse.data;
            } else if (salesResponse.data && Array.isArray(salesResponse.data.data)) {
                salesData = salesResponse.data.data;
            }
            setSales(salesData);
            
            // Purchase data fetch
            const purchaseResponse = await cowPurchaseAPI.getUserPurchases(userId);
            let purchaseData = [];
            
            if (Array.isArray(purchaseResponse.data)) {
                purchaseData = purchaseResponse.data;
            } else if (purchaseResponse.data && Array.isArray(purchaseResponse.data.data)) {
                purchaseData = purchaseResponse.data.data;
            }
            setPurchases(purchaseData);

            console.log('Sales Data:', salesData);
            console.log('Purchase Data:', purchaseData);
            
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStats = () => {
        const totalCowsPurchased = purchases.reduce((sum, p) => sum + (p.quantity || 0), 0);
        const totalInvestment = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
        const avgPurchasePrice = totalCowsPurchased > 0 ? totalInvestment / totalCowsPurchased : 0;
        
        const totalCowsSold = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
        const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        const avgSalePrice = totalCowsSold > 0 ? totalRevenue / totalCowsSold : 0;
        
        const netProfit = totalRevenue - totalInvestment;
        const currentStock = totalCowsPurchased - totalCowsSold;

        return {
            totalCowsPurchased,
            totalInvestment,
            avgPurchasePrice,
            totalCowsSold,
            totalRevenue,
            avgSalePrice,
            netProfit,
            currentStock
        };
    };

    // Prepare monthly chart data
    const prepareMonthlyData = (transactions, isSale = true) => {
        const monthlyData = {};
        
        transactions.forEach(transaction => {
            if (!transaction.date) return;
            
            const date = new Date(transaction.date);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = {
                    month: monthName,
                    quantity: 0,
                    amount: 0,
                    count: 0
                };
            }
            
            monthlyData[monthYear].quantity += transaction.quantity || 0;
            monthlyData[monthYear].amount += transaction.totalAmount || 0;
            monthlyData[monthYear].count += 1;
        });

        return Object.values(monthlyData).slice(-6); // Last 6 months
    };

    // Bar Chart Component
    const BarChart = ({ data, title, valueType = 'amount', color = '#3498db' }) => {
        if (!data || data.length === 0) {
            return (
                <div className="chart-container">
                    <h3>{title}</h3>
                    <div className="no-data">No data available for {title.toLowerCase()}</div>
                </div>
            );
        }

        const values = data.map(item => item[valueType === 'amount' ? 'amount' : 'quantity']);
        const maxValue = Math.max(...values);

        return (
            <div className="chart-container">
                <h3>{title}</h3>
                <div className="bar-chart">
                    {data.map((item, index) => {
                        const value = valueType === 'amount' ? item.amount : item.quantity;
                        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        
                        return (
                            <div key={index} className="bar-item">
                                <div className="bar-label">{item.month}</div>
                                <div className="bar-track">
                                    <div 
                                        className="bar-fill" 
                                        style={{ 
                                            height: `${percentage}%`,
                                            backgroundColor: color
                                        }}
                                        title={`${valueType === 'amount' ? '₹' : ''}${value.toLocaleString('en-IN')}`}
                                    ></div>
                                </div>
                                <div className="bar-value">
                                    {valueType === 'amount' 
                                        ? `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                                        : value
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const stats = calculateStats();
    const salesMonthlyData = prepareMonthlyData(sales, true);
    const purchasesMonthlyData = prepareMonthlyData(purchases, false);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading transaction data...</p>
            </div>
        );
    }

    return (
        <div className="cow-transaction-chart">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <i className="fas fa-chart-line"></i>
                        <h1>Cow Transaction Analytics</h1>
                    </div>
                    <button className="btn-refresh" onClick={loadData}>
                        <i className="fas fa-sync-alt"></i>
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="chart-tabs">
                <button 
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <i className="fas fa-chart-pie"></i>
                    Overview
                </button>
                <button 
                    className={`tab-button ${activeTab === 'sales' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sales')}
                >
                    <i className="fas fa-money-bill-wave"></i>
                    Sales Analytics
                </button>
                <button 
                    className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
                    onClick={() => setActiveTab('purchases')}
                >
                    <i className="fas fa-shopping-cart"></i>
                    Purchase Analytics
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="tab-content">
                    {/* Statistics Cards */}
                    <div className="stats-grid-overview">
                        <div className="stat-card profit">
                            <div className="stat-content">
                                <h3>₹{stats.netProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                                <p>Net Profit/Loss</p>
                            </div>
                        </div>

                        <div className="stat-card stock">
                            <div className="stat-content">
                                <h3>{stats.currentStock}</h3>
                                <p>Current Stock</p>
                            </div>
                        </div>

                        <div className="stat-card revenue">
                            <div className="stat-content">
                                <h3>₹{stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                                <p>Total Revenue</p>
                            </div>
                        </div>

                        <div className="stat-card investment">
                            <div className="stat-content">
                                <h3>₹{stats.totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                                <p>Total Investment</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="charts-row">
                        <BarChart
                            data={salesMonthlyData}
                            title="Monthly Sales Revenue"
                            valueType="amount"
                            color="#27ae60"
                        />
                        <BarChart
                            data={purchasesMonthlyData}
                            title="Monthly Purchase Investment"
                            valueType="amount"
                            color="#e74c3c"
                        />
                    </div>
                </div>
            )}

            {/* Sales Analytics Tab */}
            {activeTab === 'sales' && (
                <div className="tab-content">
                    <div className="stats-grid-sales">
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>{stats.totalCowsSold}</h3>
                                <p>Total Cows Sold</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>₹{stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                                <p>Total Revenue</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>₹{stats.avgSalePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                                <p>Avg Price/Cow</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>{sales.length}</h3>
                                <p>Total Sales</p>
                            </div>
                        </div>
                    </div>

                    <div className="charts-row">
                        <BarChart
                            data={salesMonthlyData}
                            title="Cows Sold per Month"
                            valueType="quantity"
                            color="#27ae60"
                        />
                        <BarChart
                            data={salesMonthlyData}
                            title="Sales Revenue per Month"
                            valueType="amount"
                            color="#3498db"
                        />
                    </div>
                </div>
            )}

            {/* Purchase Analytics Tab */}
            {activeTab === 'purchases' && (
                <div className="tab-content">
                    <div className="stats-grid-purchases">
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>{stats.totalCowsPurchased}</h3>
                                <p>Total Cows Purchased</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>₹{stats.totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                                <p>Total Investment</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>₹{stats.avgPurchasePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                                <p>Avg Price/Cow</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>{purchases.length}</h3>
                                <p>Total Purchases</p>
                            </div>
                        </div>
                    </div>

                    <div className="charts-row">
                        <BarChart
                            data={purchasesMonthlyData}
                            title="Cows Purchased per Month"
                            valueType="quantity"
                            color="#e74c3c"
                        />
                        <BarChart
                            data={purchasesMonthlyData}
                            title="Purchase Investment per Month"
                            valueType="amount"
                            color="#f39c12"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CowTransactionChart;