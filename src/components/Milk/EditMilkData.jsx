import React, { useState, useEffect } from 'react';
import { milkAPI } from '../../services/api';
import '../../styles/milk.css';

const EditMilkData = ({ milkData, userId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        session: 'morning',
        date: '',
        liters: '',
        rate: '',
        fat: '',
        snf: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (milkData) {
            setFormData({
                session: milkData.session,
                date: milkData.date,
                liters: milkData.liters.toString(),
                rate: milkData.rate.toString(),
                fat: milkData.fat.toString(),
                snf: milkData.snf.toString()
            });
        }
    }, [milkData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSessionChange = (session) => {
        setFormData({
            ...formData,
            session
        });
    };

    const calculateAmount = () => {
        const liters = parseFloat(formData.liters) || 0;
        const rate = parseFloat(formData.rate) || 0;
        return liters * rate;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!formData.liters || !formData.rate) {
            setMessage('Please enter both liters and rate');
            setLoading(false);
            return;
        }

        try {
            const updatedData = {
                userId: userId,
                session: formData.session,
                date: formData.date,
                liters: parseFloat(formData.liters),
                rate: parseFloat(formData.rate),
                fat: parseFloat(formData.fat) || 0,
                snf: parseFloat(formData.snf) || 0
            };

            await milkAPI.updateMilkData(milkData.id, userId, updatedData);
            setMessage('Milk record updated successfully!');
            setTimeout(() => {
                onSave();
            }, 1500);
        } catch (error) {
            setMessage('Failed to update milk record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!milkData) {
        return null;
    }

    return (
        <div className="milk-form-container">
            <div className="milk-form-box">
                <div className="milk-form-header">
                    <i className="fas fa-edit" style={{fontSize: '3rem', color: '#4299e1', marginBottom: '1rem'}}></i>
                    <h2>Edit Milk Record</h2>
                    <p>Update your milk production details</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Session Selection */}
                    <div className="session-toggle">
                        <div 
                            className={`session-option ${formData.session === 'morning' ? 'active' : ''}`}
                            onClick={() => handleSessionChange('morning')}
                        >
                            <i className="fas fa-sun"></i>
                            <div>Morning</div>
                        </div>
                        <div 
                            className={`session-option ${formData.session === 'evening' ? 'active' : ''}`}
                            onClick={() => handleSessionChange('evening')}
                        >
                            <i className="fas fa-moon"></i>
                            <div>Evening</div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">
                            <i className="fas fa-calendar"></i> Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            className="form-control"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="liters">
                            <i className="fas fa-wine-bottle"></i> Liters
                        </label>
                        <input
                            type="number"
                            id="liters"
                            name="liters"
                            className="form-control"
                            value={formData.liters}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                            placeholder="Enter liters"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rate">
                            <i className="fas fa-rupee-sign"></i> Rate per Liter (₹)
                        </label>
                        <input
                            type="number"
                            id="rate"
                            name="rate"
                            className="form-control"
                            value={formData.rate}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                            placeholder="Enter rate per liter"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fat">
                            <i className="fas fa-percentage"></i> Fat %
                        </label>
                        <input
                            type="number"
                            id="fat"
                            name="fat"
                            className="form-control"
                            value={formData.fat}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            max="10"
                            placeholder="Enter fat percentage"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="snf">
                            <i className="fas fa-percentage"></i> SNF %
                        </label>
                        <input
                            type="number"
                            id="snf"
                            name="snf"
                            className="form-control"
                            value={formData.snf}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            max="15"
                            placeholder="Enter SNF percentage"
                        />
                    </div>

                    <div className="amount-preview">
                        <strong>Total Amount: ₹{calculateAmount().toFixed(2)}</strong>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Updating Record...' : 'Update Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMilkData;