import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../../services/api';
import './../../styles/expenses.css';

const ExpenseList = ({ userId, onAddNew, onEditExpense }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadExpenses();
    }, [userId]);

    const loadExpenses = async () => {
        try {
            const response = await expenseAPI.getUserExpenses(userId);
            setExpenses(response.data || []);
        } catch (error) {
            setMessage('Failed to load expenses');
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {
            await expenseAPI.deleteExpense(id, userId);
            setMessage('Expense deleted successfully');
            loadExpenses();
        } catch (error) {
            setMessage('Failed to delete expense');
        }
    };

    const calculateTotal = (expense) => {
        return expense.feedCost + expense.powderCost + expense.labourCost + 
               expense.medicalCost + expense.machineryCost;
    };

    const getTotalExpenses = () => {
        return expenses.reduce((total, expense) => total + calculateTotal(expense), 0);
    };

    const getCategoryTotals = () => {
        return {
            feed: expenses.reduce((sum, expense) => sum + expense.feedCost, 0),
            powder: expenses.reduce((sum, expense) => sum + expense.powderCost, 0),
            labour: expenses.reduce((sum, expense) => sum + expense.labourCost, 0),
            medical: expenses.reduce((sum, expense) => sum + expense.medicalCost, 0),
            machinery: expenses.reduce((sum, expense) => sum + expense.machineryCost, 0)
        };
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading expenses...</p>
            </div>
        );
    }

    const categoryTotals = getCategoryTotals();

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <i className="fas fa-money-bill-wave"></i>
                        <h1>Expense Management</h1>
                    </div>
                    <button className="btn-pr" onClick={onAddNew}>
                       + Add New Expense
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
                       
                    
                    <div className="stat-content">
                        <h3>₹{getTotalExpenses().toFixed(2)}</h3>
                        <p>Total Expenses</p>
                    </div>
                </div>

                <div className="stat-card success">
                    {/* <div className="stat-icon">
                        <i className="fas fa-seedling"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>₹{categoryTotals.feed.toFixed(2)}</h3>
                        <p>Feed Expenses</p>
                    </div>
                </div>

                <div className="stat-card warning">
                    {/* <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>₹{categoryTotals.labour.toFixed(2)}</h3>
                        <p>Labour Expenses</p>
                    </div>
                </div>

                <div className="stat-card info">
                    {/* <div className="stat-icon">
                        <i className="fas fa-list"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>{expenses.length}</h3>
                        <p>Total Records</p>
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="category-breakdown">
                <h3>Expense Categories</h3>
                <div className="category-grid">
                    <div className="category-item">
                        <i className="fas fa-seedling"></i>
                        <span>Feed</span>
                        <strong>₹{categoryTotals.feed.toFixed(2)}</strong>
                    </div>
                    <div className="category-item">
                        <i class="fa-solid fa-bowl-rice"></i>
                        <span>Powder</span>
                        <strong>₹{categoryTotals.powder.toFixed(2)}</strong>
                    </div>
                    <div className="category-item">
                        <i className="fas fa-users"></i>
                        <span>Labour</span>
                        <strong>₹{categoryTotals.labour.toFixed(2)}</strong>
                    </div>
                    <div className="category-item">
                        <i className="fas fa-first-aid"></i>
                        <span>Medical</span>
                        <strong>₹{categoryTotals.medical.toFixed(2)}</strong>
                    </div>
                    <div className="category-item">
                        <i className="fas fa-tractor"></i>
                        <span>Machinery</span>
                        <strong>₹{categoryTotals.machinery.toFixed(2)}</strong>
                    </div>
                </div>
            </div>

            {/* Expenses List */}
            {expenses.length === 0 ? (
                <div className="empty-state">
                   
                    <h3>No Expenses Found</h3>
                    <p>Start tracking your expenses by adding your first record</p>
                    <button className="btn btn-primary" onClick={onAddNew}>
                        Add First Expense
                    </button>
                </div>
            ) : (
                <div className="expenses-grid">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="expense-card">
                            <div className="expense-header">
                                <h4>Expense Record</h4>
                                <div className="expense-actions">
                                    <button 
                                        className="btn-action edit"
                                        onClick={() => onEditExpense(expense)}
                                        title="Edit Expense"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                        className="btn-action delete"
                                        onClick={() => handleDelete(expense.id)}
                                        title="Delete Expense"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="expense-details">
                                <div className="expense-row">
                                    <div className="expense-item">
                                        <i className="fas fa-seedling"></i>
                                        <span>Feed Cost</span>
                                        <strong>₹{expense.feedCost.toFixed(2)}</strong>
                                    </div>
                                    <div className="expense-item">
                                        <i className="fas fa-powder"></i>
                                        <span>Powder Cost</span>
                                        <strong>₹{expense.powderCost.toFixed(2)}</strong>
                                    </div>
                                </div>
                                <div className="expense-row">
                                    <div className="expense-item">
                                        <i className="fas fa-users"></i>
                                        <span>Labour Cost</span>
                                        <strong>₹{expense.labourCost.toFixed(2)}</strong>
                                    </div>
                                    <div className="expense-item">
                                        <i className="fas fa-first-aid"></i>
                                        <span>Medical Cost</span>
                                        <strong>₹{expense.medicalCost.toFixed(2)}</strong>
                                    </div>
                                </div>
                                <div className="expense-row">
                                    <div className="expense-item">
                                        <i className="fas fa-tractor"></i>
                                        <span>Machinery Cost</span>
                                        <strong>₹{expense.machineryCost.toFixed(2)}</strong>
                                    </div>
                                    <div className="expense-item total">
                                        <i className="fas fa-calculator"></i>
                                        <span>Total Amount</span>
                                        <strong>₹{calculateTotal(expense).toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExpenseList;