// import React, { useState, useEffect } from 'react';
// import ExpenseList from '../Expenses/ExpenseList';
// import AddExpense from '../Expenses/AddExpense';
// import EditExpense from '../Expenses/EditExpense';
// import MilkDataList from '../Milk/MilkDataList';
// import AddMilkData from '../Milk/AddMilkData';
// import EditMilkData from '../Milk/EditMilkData';
// import CowPurchaseList from '../CowPurchase/CowPurchaseList';
// import AddCowPurchase from '../CowPurchase/AddCowPurchase';
// import EditCowPurchase from '../CowPurchase/EditCowPurchase';
// import CowSaleList from '../CowSale/CowSaleList';
// import AddCowSale from '../CowSale/AddCowSale';
// import EditCowSale from '../CowSale/EditCowSale';
// import CowSaleMarketplace from '../Marketplace/CowSaleMarketplace';
// import AddCowSalePost from '../Marketplace/AddCowSalePost';
// import EditCowSalePost from '../Marketplace/EditCowSalePost';
// import MarketPostList from '../Marketplace/MarketPostList';
// import AddMarketPost from '../Marketplace/AddMarketPost';
// import EditMarketPost from '../Marketplace/EditMarketPost';
// import BuyRecordList from '../BuyRecords/BuyRecordList';
// import AddBuyRecord from '../BuyRecords/AddBuyRecord';
// import EditBuyRecord from '../BuyRecords/EditBuyRecord';
// import SaleRecordList from '../SaleRecords/SaleRecordList';
// import AddSaleRecord from '../SaleRecords/AddSaleRecord';
// import EditSaleRecord from '../SaleRecords/EditSaleRecord';
// import { profitLossAPI, milkAPI, cowPurchaseAPI, cowSaleAPI, buyRecordAPI, saleRecordAPI, expenseAPI } from '../../services/api';
// import '../../styles/main.css';

// const UserDashboard = ({ userEmail, onLogout }) => {
//     const [currentView, setCurrentView] = useState('dashboard');
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//     const [profitLossData, setProfitLossData] = useState(null);
//     const [dashboardData, setDashboardData] = useState({
//         totalCattle: 0,
//         milkProduction: 0,
//         growthRate: 0,
//         totalRevenue: 0,
//         totalExpenses: 0,
//         netProfit: 0
//     });
//     const [loading, setLoading] = useState(false);
//     const [selectedExpense, setSelectedExpense] = useState(null);
//     const [selectedMilkData, setSelectedMilkData] = useState(null);
//     const [selectedPurchase, setSelectedPurchase] = useState(null);
//     const [selectedSale, setSelectedSale] = useState(null);
//     const [selectedMarketplacePost, setSelectedMarketplacePost] = useState(null);
//     const [selectedMarketPost, setSelectedMarketPost] = useState(null);
//     const [selectedBuyRecord, setSelectedBuyRecord] = useState(null);
//     const [selectedSaleRecord, setSelectedSaleRecord] = useState(null);

//     const userId = userEmail;

//     // Get user info from email
//     const getUserName = () => {
//         if (!userEmail) return 'User';
//         return userEmail.split('@')[0].toUpperCase();
//     };

//     const getUserInitials = () => {
//         if (!userEmail) return 'U';
//         const name = userEmail.split('@')[0];
//         return name.substring(0, 2).toUpperCase();
//     };

//     // Fetch Dashboard Data
//     const fetchDashboardData = async () => {
//         setLoading(true);
//         try {
//             const profitResponse = await profitLossAPI.getProfitLoss(userId);
//             setProfitLossData(profitResponse.data);

//             const milkResponse = await milkAPI.getUserMilkData(userId);
//             const totalMilkProduction = milkResponse.data.reduce((sum, milk) => sum + (milk.liters || 0), 0);

//             const purchaseResponse = await cowPurchaseAPI.getUserPurchases(userId);
//             const saleResponse = await cowSaleAPI.getUserSales(userId);
            
//             const totalPurchased = purchaseResponse.data.length;
//             const totalSold = saleResponse.data.length;
//             const totalCattle = totalPurchased - totalSold;

//             const buyResponse = await buyRecordAPI.getUserBuys(userId);
//             const totalBuyExpenses = buyResponse.data.reduce((sum, buy) => sum + (buy.price || 0), 0);

//             const saleRecordResponse = await saleRecordAPI.getSalesByUser(userId);
//             const totalSaleRevenue = saleRecordResponse.data.reduce((sum, sale) => sum + (sale.price || 0), 0);

//             const expenseResponse = await expenseAPI.getUserExpenses(userId);
//             const totalExpenseAmount = expenseResponse.data.reduce((sum, expense) => 
//                 sum + (expense.feedCost || 0) + (expense.powderCost || 0) + 
//                 (expense.labourCost || 0) + (expense.medicalCost || 0) + 
//                 (expense.machineryCost || 0), 0
//             );

//             const growthRate = totalPurchased > 0 ? ((totalPurchased - totalSold) / totalPurchased * 100).toFixed(1) : 0;

//             setDashboardData({
//                 totalCattle: Math.max(0, totalCattle),
//                 milkProduction: totalMilkProduction,
//                 growthRate: growthRate,
//                 totalRevenue: totalSaleRevenue,
//                 totalExpenses: totalBuyExpenses + totalExpenseAmount,
//                 netProfit: totalSaleRevenue - (totalBuyExpenses + totalExpenseAmount)
//             });

//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (currentView === 'dashboard') {
//             fetchDashboardData();
//         }
//     }, [currentView, userId]);

//     // All handlers
//     const handleAddNewExpense = () => setCurrentView('add-expense');
//     const handleEditExpense = (expense) => { setSelectedExpense(expense); setCurrentView('edit-expense'); };
//     const handleSaveExpense = () => { setCurrentView('expense-data'); setSelectedExpense(null); fetchDashboardData(); };
//     const handleCancelExpense = () => { setCurrentView('expense-data'); setSelectedExpense(null); };

//     const handleAddMilkRecord = () => setCurrentView('add-milk');
//     const handleEditMilkData = (milkData) => { setSelectedMilkData(milkData); setCurrentView('edit-milk'); };
//     const handleSaveMilkData = () => { setCurrentView('milk-data'); setSelectedMilkData(null); fetchDashboardData(); };
//     const handleCancelMilk = () => { setCurrentView('milk-data'); setSelectedMilkData(null); };

//     const handleAddPurchase = () => setCurrentView('add-purchase');
//     const handleEditPurchase = (purchase) => { setSelectedPurchase(purchase); setCurrentView('edit-purchase'); };
//     const handleSavePurchase = () => { setCurrentView('cow-purchase'); setSelectedPurchase(null); fetchDashboardData(); };
//     const handleCancelPurchase = () => { setCurrentView('cow-purchase'); setSelectedPurchase(null); };

//     const handleAddSale = () => setCurrentView('add-sale');
//     const handleEditSale = (sale) => { setSelectedSale(sale); setCurrentView('edit-sale'); };
//     const handleCancelSale = () => { setCurrentView('cow-sale'); setSelectedSale(null); };
//     const handleSaveSale = () => { setCurrentView('cow-sale'); setSelectedSale(null); fetchDashboardData(); };

//     const handleAddMarketplacePost = () => setCurrentView('add-marketplace-post');
//     const handleEditMarketplacePost = (post) => { setSelectedMarketplacePost(post); setCurrentView('edit-marketplace-post'); };
//     const handleSaveMarketplacePost = () => { setCurrentView('cow-marketplace'); setSelectedMarketplacePost(null); };
//     const handleCancelMarketplace = () => { setCurrentView('cow-marketplace'); setSelectedMarketplacePost(null); };

//     const handleAddMarketPost = () => setCurrentView('add-market-post');
//     const handleEditMarketPost = (post) => { setSelectedMarketPost(post); setCurrentView('edit-market-post'); };
//     const handleSaveMarketPost = () => { setCurrentView('farm-market'); setSelectedMarketPost(null); };
//     const handleCancelMarketPost = () => { setCurrentView('farm-market'); setSelectedMarketPost(null); };

//     const handleAddBuyRecord = () => setCurrentView('add-buy-record');
//     const handleEditBuyRecord = (buyRecord) => { setSelectedBuyRecord(buyRecord); setCurrentView('edit-buy-record'); };
//     const handleSaveBuyRecord = () => { setCurrentView('my-purchases'); setSelectedBuyRecord(null); fetchDashboardData(); };
//     const handleCancelBuyRecord = () => { setCurrentView('my-purchases'); setSelectedBuyRecord(null); };

//     const handleAddSaleRecord = () => setCurrentView('add-sale-record');
//     const handleEditSaleRecord = (saleRecord) => { setSelectedSaleRecord(saleRecord); setCurrentView('edit-sale-record'); };
//     const handleSaveSaleRecord = () => { setCurrentView('my-sales'); setSelectedSaleRecord(null); fetchDashboardData(); };
//     const handleCancelSaleRecord = () => { setCurrentView('my-sales'); setSelectedSaleRecord(null); };

//     // Render Main Dashboard
//     const renderDashboard = () => {
//         return (
//             <div className="campusram-main-content">
//                 {/* Top Header Bar */}
//                 <div className="campusram-top-bar">
//                     <div className="top-bar-left">
//                         <i className="fas fa-cow" style={{color: '#4a9fc7'}}></i>
//                         <h2>CattleEnterprise Management System</h2>
//                     </div>
//                     <div className="top-bar-right">
//                         <span className="breadcrumb-separator">›</span>
//                         <div className="top-bar-user">
//                             <span>{getUserName()}</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Dashboard Title */}
//                 <div className="campusram-dashboard-header">
//                     <h1>Dashboard <span className="subtitle">Control panel</span></h1>
//                 </div>

//                 {/* Dashboard Cards Grid */}
//                 <div className="campusram-cards-grid">
//                     {/* Row 1 */}
//                     <div className="campusram-card blue" onClick={() => setCurrentView('profit-loss')}>
//                         <div className="card-hash"></div>
//                         <div className="card-icon-section">
//                             <i className="fas fa-chart-line"></i>
//                         </div>
//                         <div className="card-content-section">
//                             <h3>Profit & Loss</h3>
//                             <button className="card-more-btn">More info</button>
//                         </div>
//                     </div>

//                     <div className="campusram-card red" onClick={() => setCurrentView('milk-data')}>
//                         <div className="card-hash"></div>
//                         <div className="card-icon-section">
//                             <i className="fas fa-wine-bottle"></i>
//                         </div>
//                         <div className="card-content-section">
//                             <h3>Milk Records</h3>
//                             <button className="card-more-btn">More info</button>
//                         </div>
//                     </div>

//                     <div className="campusram-card purple" onClick={() => setCurrentView('expense-data')}>
//                         <div className="card-hash"></div>
//                         <div className="card-icon-section">
//                             <i className="fas fa-money-bill-wave"></i>
//                         </div>
//                         <div className="card-content-section">
//                             <h3>Expense Data</h3>
//                             <button className="card-more-btn">More info</button>
//                         </div>
//                     </div>

//                     <div className="campusram-card orange" onClick={() => setCurrentView('cow-purchase')}>
//                         <div className="card-hash"></div>
//                         <div className="card-icon-section">
//                             <i className="fas fa-shopping-cart"></i>
//                         </div>
//                         <div className="card-content-section">
//                             <h3>Cow Purchase</h3>
//                             <button className="card-more-btn">More info</button>
//                         </div>
//                     </div>

//                     {/* Row 2 */}
//                     <div className="campusram-card blue" onClick={() => setCurrentView('cow-sale')}>
//                         <div className="card-hash"></div>
//                         <div className="card-icon-section">
//                             <i className="fas fa-receipt"></i>
//                         </div>
//                         <div className="card-content-section">
//                             <h3>Cow Sale</h3>
//                             <button className="card-more-btn">More info</button>
//                         </div>
//                     </div>

//                     <div className="campusram-card pink" onClick={() => setCurrentView('cow-marketplace')}>
//                         <div className="card-hash"></div>
//                         <div className="card-icon-section">
//                             <i className="fas fa-store"></i>
//                         </div>
//                         <div className="card-content-section">
//                             <h3>Marketplace</h3>
//                             <button className="card-more-btn">More info</button>
//                         </div>
//                     </div>

//                     <div className="campusram-card teal" onClick={() => setCurrentView('farm-market')}>
//                         <div className="card-hash"></div>
//                         <div className="card-icon-section">
//                             <i className="fas fa-tractor"></i>
//                         </div>
//                         <div className="card-content-section">
//                             <h3>Farm Market</h3>
//                             <button className="card-more-btn">More info</button>
//                         </div>
//                     </div>

//                     <div className="campusram-card green" onClick={() => setCurrentView('my-sales')}>
//                         <div className="card-hash"></div>
//                         <div className="card-icon-section">
//                             <i className="fas fa-chart-line"></i>
//                         </div>
//                         <div className="card-content-section">
//                             <h3>My Sales</h3>
//                             <button className="card-more-btn">More info</button>
//                         </div>
//                     </div>

//                     <div className="campusram-card indigo" onClick={() => setCurrentView('my-purchases')}>
//                         <div className="card-hash"></div>
//                         <div className="card-icon-section">
//                             <i className="fas fa-shopping-bag"></i>
//                         </div>
//                         <div className="card-content-section">
//                             <h3>My Purchases</h3>
//                             <button className="card-more-btn">More info</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // Render Current View
//     const renderCurrentView = () => {
//         switch (currentView) {
//             case 'profit-loss':
//                 return (
//                     <div className="campusram-main-content">
//                         <button className="btn-back" onClick={() => setCurrentView('dashboard')}>
//                             <i className="fas fa-arrow-left"></i> Back to Dashboard
//                         </button>
//                         <div className="financial-summary">
//                             <div className="financial-card income">
//                                 <i className="fas fa-rupee-sign"></i>
//                                 <div className="financial-content">
//                                     <h3>Total Revenue</h3>
//                                     <p>₹{dashboardData.totalRevenue.toLocaleString()}</p>
//                                 </div>
//                             </div>
//                             <div className="financial-card expense">
//                                 <i className="fas fa-money-bill-wave"></i>
//                                 <div className="financial-content">
//                                     <h3>Total Expenses</h3>
//                                     <p>₹{dashboardData.totalExpenses.toLocaleString()}</p>
//                                 </div>
//                             </div>
//                             <div className="financial-card profit">
//                                 <i className="fas fa-chart-line"></i>
//                                 <div className="financial-content">
//                                     <h3>Net Profit/Loss</h3>
//                                     <p style={{ color: dashboardData.netProfit >= 0 ? '#10b981' : '#ef4444' }}>
//                                         ₹{dashboardData.netProfit.toLocaleString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             case 'milk-data':
//                 return (
//                     <div className="campusram-main-content">
//                         <MilkDataList userId={userId} onAddNew={handleAddMilkRecord} onEditMilkData={handleEditMilkData} onBack={() => setCurrentView('dashboard')} />
//                     </div>
//                 );
//             case 'add-milk':
//                 return (
//                     <div className="campusram-main-content">
//                         <AddMilkData userId={userId} onSave={handleSaveMilkData} onCancel={() => setCurrentView('milk-data')} />
//                     </div>
//                 );
//             case 'edit-milk':
//                 return (
//                     <div className="campusram-main-content">
//                         <EditMilkData milkData={selectedMilkData} userId={userId} onSave={handleSaveMilkData} onCancel={() => setCurrentView('milk-data')} />
//                     </div>
//                 );
//             case 'expense-data':
//                 return (
//                     <div className="campusram-main-content">
//                         <ExpenseList userId={userId} onAddNew={handleAddNewExpense} onEditExpense={handleEditExpense} onBack={() => setCurrentView('dashboard')} />
//                     </div>
//                 );
//             case 'add-expense':
//                 return (
//                     <div className="campusram-main-content">
//                         <AddExpense userId={userId} onSave={handleSaveExpense} onCancel={() => setCurrentView('expense-data')} />
//                     </div>
//                 );
//             case 'edit-expense':
//                 return (
//                     <div className="campusram-main-content">
//                         <EditExpense expense={selectedExpense} userId={userId} onSave={handleSaveExpense} onCancel={() => setCurrentView('expense-data')} />
//                     </div>
//                 );
//             case 'cow-purchase':
//                 return (
//                     <div className="campusram-main-content">
//                         <CowPurchaseList userId={userId} onAddNew={handleAddPurchase} onEditPurchase={handleEditPurchase} onBack={() => setCurrentView('dashboard')} />
//                     </div>
//                 );
//             case 'add-purchase':
//                 return (
//                     <div className="campusram-main-content">
//                         <AddCowPurchase userId={userId} onSave={handleSavePurchase} onCancel={() => setCurrentView('cow-purchase')} />
//                     </div>
//                 );
//             case 'edit-purchase':
//                 return (
//                     <div className="campusram-main-content">
//                         <EditCowPurchase purchase={selectedPurchase} userId={userId} onSave={handleSavePurchase} onCancel={() => setCurrentView('cow-purchase')} />
//                     </div>
//                 );
//             case 'cow-sale':
//                 return (
//                     <div className="campusram-main-content">
//                         <CowSaleList userId={userId} onAddNew={handleAddSale} onEditSale={handleEditSale} onBack={() => setCurrentView('dashboard')} />
//                     </div>
//                 );
//             case 'add-sale':
//                 return (
//                     <div className="campusram-main-content">
//                         <AddCowSale userId={userId} onSave={handleSaveSale} onCancel={() => setCurrentView('cow-sale')} />
//                     </div>
//                 );
//             case 'edit-sale':
//                 return (
//                     <div className="campusram-main-content">
//                         <EditCowSale sale={selectedSale} userId={userId} onSave={handleSaveSale} onCancel={() => setCurrentView('cow-sale')} />
//                     </div>
//                 );
//             case 'cow-marketplace':
//                 return (
//                     <div className="campusram-main-content">
//                         <CowSaleMarketplace userEmail={userId} onAddNew={handleAddMarketplacePost} onEditPost={handleEditMarketplacePost} onBack={() => setCurrentView('dashboard')} />
//                     </div>
//                 );
//             case 'add-marketplace-post':
//                 return (
//                     <div className="campusram-main-content">
//                         <AddCowSalePost userEmail={userId} onSuccess={handleSaveMarketplacePost} onCancel={() => setCurrentView('cow-marketplace')} />
//                     </div>
//                 );
//             case 'edit-marketplace-post':
//                 return (
//                     <div className="campusram-main-content">
//                         <EditCowSalePost post={selectedMarketplacePost} userEmail={userId} onSuccess={handleSaveMarketplacePost} onCancel={() => setCurrentView('cow-marketplace')} />
//                     </div>
//                 );
//             case 'farm-market':
//                 return (
//                     <div className="campusram-main-content">
//                         <MarketPostList userEmail={userId} onAddNew={handleAddMarketPost} onEditPost={handleEditMarketPost} onBack={() => setCurrentView('dashboard')} />
//                     </div>
//                 );
//             case 'add-market-post':
//                 return (
//                     <div className="campusram-main-content">
//                         <AddMarketPost userEmail={userId} onSuccess={handleSaveMarketPost} onCancel={() => setCurrentView('farm-market')} />
//                     </div>
//                 );
//             case 'edit-market-post':
//                 return (
//                     <div className="campusram-main-content">
//                         <EditMarketPost post={selectedMarketPost} userEmail={userId} onSuccess={handleSaveMarketPost} onCancel={() => setCurrentView('farm-market')} />
//                     </div>
//                 );
//             case 'my-sales':
//                 return (
//                     <div className="campusram-main-content">
//                         <SaleRecordList userId={userId} onAddNew={handleAddSaleRecord} onEditSale={handleEditSaleRecord} onBack={() => setCurrentView('dashboard')} />
//                     </div>
//                 );
//             case 'add-sale-record':
//                 return (
//                     <div className="campusram-main-content">
//                         <AddSaleRecord userId={userId} onSuccess={handleSaveSaleRecord} onCancel={() => setCurrentView('my-sales')} />
//                     </div>
//                 );
//             case 'edit-sale-record':
//                 return (
//                     <div className="campusram-main-content">
//                         <EditSaleRecord sale={selectedSaleRecord} userId={userId} onSuccess={handleSaveSaleRecord} onCancel={() => setCurrentView('my-sales')} />
//                     </div>
//                 );
//             case 'my-purchases':
//                 return (
//                     <div className="campusram-main-content">
//                         <BuyRecordList userId={userId} onAddNew={handleAddBuyRecord} onEditBuy={handleEditBuyRecord} onBack={() => setCurrentView('dashboard')} />
//                     </div>
//                 );
//             case 'add-buy-record':
//                 return (
//                     <div className="campusram-main-content">
//                         <AddBuyRecord userId={userId} onSuccess={handleSaveBuyRecord} onCancel={() => setCurrentView('my-purchases')} />
//                     </div>
//                 );
//             case 'edit-buy-record':
//                 return (
//                     <div className="campusram-main-content">
//                         <EditBuyRecord buy={selectedBuyRecord} userId={userId} onSuccess={handleSaveBuyRecord} onCancel={() => setCurrentView('my-purchases')} />
//                     </div>
//                 );
//             default:
//                 return renderDashboard();
//         }
//     };

//     return (
//         <div className="campusram-container">
//             {/* Sidebar */}
//             <aside className={`campusram-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
//                 <div className="sidebar-brand">
//                     <h2>CattleEnterprise</h2>
//                 </div>

             

             

//                 {/* Main Navigation */}
//                 <div className="sidebar-nav-header">MAIN NAVIGATION</div>
//                 <ul className="sidebar-nav">
//                     <li className={currentView === 'dashboard' ? 'active' : ''} onClick={() => setCurrentView('dashboard')}>
//                         <i className="fas fa-tachometer-alt"></i>
//                         <span>Dashboard</span>
//                     </li>
//                     <li className={currentView === 'profit-loss' ? 'active' : ''} onClick={() => setCurrentView('profit-loss')}>
//                         <i className="fas fa-chart-line"></i>
//                         <span>Profit & Loss</span>
//                     </li>
//                     <li className={currentView === 'milk-data' ? 'active' : ''} onClick={() => setCurrentView('milk-data')}>
//                         <i className="fas fa-wine-bottle"></i>
//                         <span>Milk Records</span>
//                     </li>
//                     <li className={currentView === 'expense-data' ? 'active' : ''} onClick={() => setCurrentView('expense-data')}>
//                         <i className="fas fa-money-bill-wave"></i>
//                         <span>Expenses</span>
//                     </li>
//                     <li className={currentView === 'cow-purchase' ? 'active' : ''} onClick={() => setCurrentView('cow-purchase')}>
//                         <i className="fas fa-shopping-cart"></i>
//                         <span>Cow Purchase</span>
//                     </li>
//                     <li className={currentView === 'cow-sale' ? 'active' : ''} onClick={() => setCurrentView('cow-sale')}>
//                         <i className="fas fa-receipt"></i>
//                         <span>Cow Sale</span>
//                     </li>
//                     <li className={currentView === 'cow-marketplace' ? 'active' : ''} onClick={() => setCurrentView('cow-marketplace')}>
//                         <i className="fas fa-store"></i>
//                         <span>Marketplace</span>
//                     </li>
//                     <li className={currentView === 'farm-market' ? 'active' : ''} onClick={() => setCurrentView('farm-market')}>
//                         <i className="fas fa-tractor"></i>
//                         <span>Farm Market</span>
//                     </li>
//                     <li className={currentView === 'my-sales' ? 'active' : ''} onClick={() => setCurrentView('my-sales')}>
//                         <i className="fas fa-chart-bar"></i>
//                         <span>My Sales</span>
//                     </li>
//                     <li className={currentView === 'my-purchases' ? 'active' : ''} onClick={() => setCurrentView('my-purchases')}>
//                         <i className="fas fa-shopping-bag"></i>
//                         <span>My Purchases</span>
//                     </li>
//                     <li onClick={onLogout} style={{marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px'}}>
//                         <i className="fas fa-sign-out-alt"></i>
//                         <span>Logout</span>
//                     </li>
//                 </ul>
//             </aside>

//             {/* Main Content Area */}
//             <div className="campusram-content-wrapper">
//                 {renderCurrentView()}
//             </div>
//         </div>
//     );
// };

// export default UserDashboard;

import React, { useState, useEffect } from 'react';
import ExpenseList from '../Expenses/ExpenseList';
import AddExpense from '../Expenses/AddExpense';
import EditExpense from '../Expenses/EditExpense';
import MilkDataList from '../Milk/MilkDataList';
import AddMilkData from '../Milk/AddMilkData';
import EditMilkData from '../Milk/EditMilkData';
import CowPurchaseList from '../CowPurchase/CowPurchaseList';
import AddCowPurchase from '../CowPurchase/AddCowPurchase';
import EditCowPurchase from '../CowPurchase/EditCowPurchase';
import CowSaleList from '../CowSale/CowSaleList';
import AddCowSale from '../CowSale/AddCowSale';
import EditCowSale from '../CowSale/EditCowSale';
import CowSaleMarketplace from '../Marketplace/CowSaleMarketplace';
import AddCowSalePost from '../Marketplace/AddCowSalePost';
import EditCowSalePost from '../Marketplace/EditCowSalePost';
import MarketPostList from '../Marketplace/MarketPostList';
import AddMarketPost from '../Marketplace/AddMarketPost';
import EditMarketPost from '../Marketplace/EditMarketPost';
import ProfitLossChart from '../Charts/ProfitLossChart';
import MilkProductionChart from '../Charts/MilkProductionChart';
import ExpenseChart from '../Charts/ExpenseChart';
import CowTransactionChart from '../Charts/CowTransactionChart';
import { profitLossAPI, milkAPI, cowPurchaseAPI, cowSaleAPI, expenseAPI } from '../../services/api';
// import '../../styles/main.css';

const UserDashboard = ({ userEmail, onLogout }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [sidebarActive, setSidebarActive] = useState(false);
    const [profitLossData, setProfitLossData] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalCattle: 0,
        milkProduction: 0,
        growthRate: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0
    });
    const [loading, setLoading] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [selectedMilkData, setSelectedMilkData] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedSale, setSelectedSale] = useState(null);
    const [selectedMarketplacePost, setSelectedMarketplacePost] = useState(null);
    const [selectedMarketPost, setSelectedMarketPost] = useState(null);

    const userId = userEmail;

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };

    const handleMenuClick = (view) => {
        setCurrentView(view);
        setSidebarActive(false);
    };

    const getUserName = () => {
        if (!userEmail) return 'User';
        return userEmail.split('@')[0].toUpperCase();
    };

    const getUserInitials = () => {
        if (!userEmail) return 'U';
        const name = userEmail.split('@')[0];
        return name.substring(0, 2).toUpperCase();
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const profitResponse = await profitLossAPI.getProfitLoss(userId);
            setProfitLossData(profitResponse.data);

            const milkResponse = await milkAPI.getUserMilkData(userId);
            const totalMilkProduction = milkResponse.data.reduce((sum, milk) => sum + (milk.liters || 0), 0);

            const purchaseResponse = await cowPurchaseAPI.getUserPurchases(userId);
            const saleResponse = await cowSaleAPI.getUserSales(userId);
            
            const totalPurchased = purchaseResponse.data.length;
            const totalSold = saleResponse.data.length;
            const totalCattle = totalPurchased - totalSold;

            const expenseResponse = await expenseAPI.getUserExpenses(userId);
            const totalExpenseAmount = expenseResponse.data.reduce((sum, expense) => 
                sum + (expense.feedCost || 0) + (expense.powderCost || 0) + 
                (expense.labourCost || 0) + (expense.medicalCost || 0) + 
                (expense.machineryCost || 0), 0
            );

            const growthRate = totalPurchased > 0 ? ((totalPurchased - totalSold) / totalPurchased * 100).toFixed(1) : 0;

            setDashboardData({
                totalCattle: Math.max(0, totalCattle),
                milkProduction: totalMilkProduction,
                growthRate: growthRate,
                totalRevenue: 0,
                totalExpenses: totalExpenseAmount,
                netProfit: -totalExpenseAmount
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentView === 'dashboard') {
            fetchDashboardData();
        }
    }, [currentView, userId]);

    const handleAddNewExpense = () => { setCurrentView('add-expense'); setSidebarActive(false); };
    const handleEditExpense = (expense) => { setSelectedExpense(expense); setCurrentView('edit-expense'); setSidebarActive(false); };
    const handleSaveExpense = () => { setCurrentView('expense-data'); setSelectedExpense(null); fetchDashboardData(); };
    const handleCancelExpense = () => { setCurrentView('expense-data'); setSelectedExpense(null); };

    const handleAddMilkRecord = () => { setCurrentView('add-milk'); setSidebarActive(false); };
    const handleEditMilkData = (milkData) => { setSelectedMilkData(milkData); setCurrentView('edit-milk'); setSidebarActive(false); };
    const handleSaveMilkData = () => { setCurrentView('milk-data'); setSelectedMilkData(null); fetchDashboardData(); };
    const handleCancelMilk = () => { setCurrentView('milk-data'); setSelectedMilkData(null); };

    const handleAddPurchase = () => { setCurrentView('add-purchase'); setSidebarActive(false); };
    const handleEditPurchase = (purchase) => { setSelectedPurchase(purchase); setCurrentView('edit-purchase'); setSidebarActive(false); };
    const handleSavePurchase = () => { setCurrentView('cow-purchase'); setSelectedPurchase(null); fetchDashboardData(); };
    const handleCancelPurchase = () => { setCurrentView('cow-purchase'); setSelectedPurchase(null); };

    const handleAddSale = () => { setCurrentView('add-sale'); setSidebarActive(false); };
    const handleEditSale = (sale) => { setSelectedSale(sale); setCurrentView('edit-sale'); setSidebarActive(false); };
    const handleCancelSale = () => { setCurrentView('cow-sale'); setSelectedSale(null); };
    const handleSaveSale = () => { setCurrentView('cow-sale'); setSelectedSale(null); fetchDashboardData(); };

    const handleAddMarketplacePost = () => { setCurrentView('add-marketplace-post'); setSidebarActive(false); };
    const handleEditMarketplacePost = (post) => { setSelectedMarketplacePost(post); setCurrentView('edit-marketplace-post'); setSidebarActive(false); };
    const handleSaveMarketplacePost = () => { setCurrentView('cow-marketplace'); setSelectedMarketplacePost(null); };
    const handleCancelMarketplace = () => { setCurrentView('cow-marketplace'); setSelectedMarketplacePost(null); };

    const handleAddMarketPost = () => { setCurrentView('add-market-post'); setSidebarActive(false); };
    const handleEditMarketPost = (post) => { setSelectedMarketPost(post); setCurrentView('edit-market-post'); setSidebarActive(false); };
    const handleSaveMarketPost = () => { setCurrentView('farm-market'); setSelectedMarketPost(null); };
    const handleCancelMarketPost = () => { setCurrentView('farm-market'); setSelectedMarketPost(null); };

    const renderDashboard = () => {
        return (
            <div className="campusram-main-content">
                <div className="campusram-top-bar">
                    <div className="top-bar-left">
                        <i className="fas fa-cow" style={{color: '#4a9fc7'}}></i>
                        <h2>CattleEnterprise Management System</h2>
                    </div>
                    <div className="top-bar-right">
                        <span className="breadcrumb-separator">›</span>
                        <div className="top-bar-user">
                            <span>{getUserName()}</span>
                        </div>
                    </div>
                </div>

                <div className="campusram-dashboard-header">
                    <h1>Dashboard <span className="subtitle">Control panel</span></h1>
                </div>

                <div className="campusram-cards-grid">
                    <div className="campusram-card blue" onClick={() => handleMenuClick('profit-loss')}>
                        <div className="card-hash"></div>
                        <div className="card-icon-section">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="card-content-section">
                            <h3>Profit & Loss</h3>
                            <button className="card-more-btn">More info</button>
                        </div>
                    </div>

                    <div className="campusram-card red" onClick={() => handleMenuClick('milk-data')}>
                        <div className="card-hash"></div>
                        <div className="card-icon-section">
                            <i className="fas fa-wine-bottle"></i>
                        </div>
                        <div className="card-content-section">
                            <h3>Milk Records</h3>
                            <button className="card-more-btn">More info</button>
                        </div>
                    </div>

                    <div className="campusram-card purple" onClick={() => handleMenuClick('expense-data')}>
                        <div className="card-hash"></div>
                        <div className="card-icon-section">
                            <i className="fas fa-money-bill-wave"></i>
                        </div>
                        <div className="card-content-section">
                            <h3>Expense Data</h3>
                            <button className="card-more-btn">More info</button>
                        </div>
                    </div>

                    <div className="campusram-card orange" onClick={() => handleMenuClick('cow-purchase')}>
                        <div className="card-hash"></div>
                        <div className="card-icon-section">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <div className="card-content-section">
                            <h3>Cow Purchase</h3>
                            <button className="card-more-btn">More info</button>
                        </div>
                    </div>

                    <div className="campusram-card teal" onClick={() => handleMenuClick('cow-sale')}>
                        <div className="card-hash"></div>
                        <div className="card-icon-section">
                            <i className="fas fa-receipt"></i>
                        </div>
                        <div className="card-content-section">
                            <h3>Cow Sale</h3>
                            <button className="card-more-btn">More info</button>
                        </div>
                    </div>

                    <div className="campusram-card pink" onClick={() => handleMenuClick('cow-marketplace')}>
                        <div className="card-hash"></div>
                        <div className="card-icon-section">
                            <i className="fas fa-store"></i>
                        </div>
                        <div className="card-content-section">
                            <h3>Marketplace</h3>
                            <button className="card-more-btn">More info</button>
                        </div>
                    </div>

                    <div className="campusram-card blue" onClick={() => handleMenuClick('farm-market')}>
                        <div className="card-hash"></div>
                        <div className="card-icon-section">
                            <i className="fas fa-tractor"></i>
                        </div>
                        <div className="card-content-section">
                            <h3>Farm Market</h3>
                            <button className="card-more-btn">More info</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'profit-loss':
                return (
                    <div className="campusram-main-content">
                        <button className="btn-back" onClick={() => handleMenuClick('dashboard')}>
                            <i className="fas fa-arrow-left"></i> Back to Dashboard
                        </button>
                        
                        <div className="page-header">
                           
                               </div>

                        <div className="charts-section">
                            <ProfitLossChart userId={userId} />
                        </div>
                        <br />
                        <div className="additional-charts">
                            {/* <div className="chart-tabs">
                                <div className="chart-tab active">Milk Production</div>
                                <div className="chart-tab">Expenses</div>
                                <div className="chart-tab">Cow Transactions</div>
                            </div> */}
                            
                            <div className="chart-tab-content">
                                <div className="tab-panel active">
                                    <MilkProductionChart userId={userId} />
                                </div>
                                <div className="tab-panel">
                                    <ExpenseChart userId={userId} />
                                </div>
                                <div className="tab-panel">
                                    <CowTransactionChart userId={userId} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'milk-data':
                return <div className="campusram-main-content"><MilkDataList userId={userId} onAddNew={handleAddMilkRecord} onEditMilkData={handleEditMilkData} onBack={() => handleMenuClick('dashboard')} /></div>;
            case 'add-milk':
                return <div className="campusram-main-content"><AddMilkData userId={userId} onSave={handleSaveMilkData} onCancel={() => setCurrentView('milk-data')} /></div>;
            case 'edit-milk':
                return <div className="campusram-main-content"><EditMilkData milkData={selectedMilkData} userId={userId} onSave={handleSaveMilkData} onCancel={() => setCurrentView('milk-data')} /></div>;
            case 'expense-data':
                return <div className="campusram-main-content"><ExpenseList userId={userId} onAddNew={handleAddNewExpense} onEditExpense={handleEditExpense} onBack={() => handleMenuClick('dashboard')} /></div>;
            case 'add-expense':
                return <div className="campusram-main-content"><AddExpense userId={userId} onSave={handleSaveExpense} onCancel={() => setCurrentView('expense-data')} /></div>;
            case 'edit-expense':
                return <div className="campusram-main-content"><EditExpense expense={selectedExpense} userId={userId} onSave={handleSaveExpense} onCancel={() => setCurrentView('expense-data')} /></div>;
            case 'cow-purchase':
                return <div className="campusram-main-content"><CowPurchaseList userId={userId} onAddNew={handleAddPurchase} onEditPurchase={handleEditPurchase} onBack={() => handleMenuClick('dashboard')} /></div>;
            case 'add-purchase':
                return <div className="campusram-main-content"><AddCowPurchase userId={userId} onSave={handleSavePurchase} onCancel={() => setCurrentView('cow-purchase')} /></div>;
            case 'edit-purchase':
                return <div className="campusram-main-content"><EditCowPurchase purchase={selectedPurchase} userId={userId} onSave={handleSavePurchase} onCancel={() => setCurrentView('cow-purchase')} /></div>;
            case 'cow-sale':
                return <div className="campusram-main-content"><CowSaleList userId={userId} onAddNew={handleAddSale} onEditSale={handleEditSale} onBack={() => handleMenuClick('dashboard')} /></div>;
            case 'add-sale':
                return <div className="campusram-main-content"><AddCowSale userId={userId} onSave={handleSaveSale} onCancel={() => setCurrentView('cow-sale')} /></div>;
            case 'edit-sale':
                return <div className="campusram-main-content"><EditCowSale sale={selectedSale} userId={userId} onSave={handleSaveSale} onCancel={() => setCurrentView('cow-sale')} /></div>;
            case 'cow-marketplace':
                return <div className="campusram-main-content"><CowSaleMarketplace userEmail={userId} onAddNew={handleAddMarketplacePost} onEditPost={handleEditMarketplacePost} onBack={() => handleMenuClick('dashboard')} /></div>;
            case 'add-marketplace-post':
                return <div className="campusram-main-content"><AddCowSalePost userEmail={userId} onSuccess={handleSaveMarketplacePost} onCancel={() => setCurrentView('cow-marketplace')} /></div>;
            case 'edit-marketplace-post':
                return <div className="campusram-main-content"><EditCowSalePost post={selectedMarketplacePost} userEmail={userId} onSuccess={handleSaveMarketplacePost} onCancel={() => setCurrentView('cow-marketplace')} /></div>;
            case 'farm-market':
                return <div className="campusram-main-content"><MarketPostList userEmail={userId} onAddNew={handleAddMarketPost} onEditPost={handleEditMarketPost} onBack={() => handleMenuClick('dashboard')} /></div>;
            case 'add-market-post':
                return <div className="campusram-main-content"><AddMarketPost userEmail={userId} onSuccess={handleSaveMarketPost} onCancel={() => setCurrentView('farm-market')} /></div>;
            case 'edit-market-post':
                return <div className="campusram-main-content"><EditMarketPost post={selectedMarketPost} userEmail={userId} onSuccess={handleSaveMarketPost} onCancel={() => setCurrentView('farm-market')} /></div>;
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="campusram-container">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <i className={sidebarActive ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>

            <div 
                className={`sidebar-overlay ${sidebarActive ? 'active' : ''}`}
                onClick={() => setSidebarActive(false)}
            ></div>

            <aside className={`campusram-sidebar ${sidebarActive ? 'active' : ''}`}>
                <div className="sidebar-brand">
                    <h2>CattleEnterprise</h2>
                </div>

                <div className="sidebar-nav-header">MAIN NAVIGATION</div>
                <ul className="sidebar-nav">
                    <li className={currentView === 'dashboard' ? 'active' : ''} onClick={() => handleMenuClick('dashboard')}>
                        <i className="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </li>
                    <li className={currentView === 'profit-loss' ? 'active' : ''} onClick={() => handleMenuClick('profit-loss')}>
                        <i className="fas fa-chart-line"></i>
                        <span>Profit & Loss</span>
                    </li>
                    <li className={currentView === 'milk-data' ? 'active' : ''} onClick={() => handleMenuClick('milk-data')}>
                        <i className="fas fa-wine-bottle"></i>
                        <span>Milk Records</span>
                    </li>
                    <li className={currentView === 'expense-data' ? 'active' : ''} onClick={() => handleMenuClick('expense-data')}>
                        <i className="fas fa-money-bill-wave"></i>
                        <span>Expenses</span>
                    </li>
                    <li className={currentView === 'cow-purchase' ? 'active' : ''} onClick={() => handleMenuClick('cow-purchase')}>
                        <i className="fas fa-shopping-cart"></i>
                        <span>Cow Purchase</span>
                    </li>
                    <li className={currentView === 'cow-sale' ? 'active' : ''} onClick={() => handleMenuClick('cow-sale')}>
                        <i className="fas fa-receipt"></i>
                        <span>Cow Sale</span>
                    </li>
                    <li className={currentView === 'cow-marketplace' ? 'active' : ''} onClick={() => handleMenuClick('cow-marketplace')}>
                        <i className="fas fa-store"></i>
                        <span>Marketplace</span>
                    </li>
                    <li className={currentView === 'farm-market' ? 'active' : ''} onClick={() => handleMenuClick('farm-market')}>
                        <i className="fas fa-tractor"></i>
                        <span>Farm Market</span>
                    </li>
                    <li onClick={() => { onLogout(); setSidebarActive(false); }} style={{marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px'}}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </li>
                </ul>
            </aside>

            <div className="campusram-content-wrapper">
                {renderCurrentView()}
            </div>
        </div>
    );
};

export default UserDashboard;