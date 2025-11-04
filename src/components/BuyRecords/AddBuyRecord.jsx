import React, { useState } from 'react';
import { buyRecordAPI } from '../../services/api';
import '../../styles/components.css';

const AddBuyRecord = ({ userId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        productName: 'MAATU_SAANAM',
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.productName.trim() || !formData.price) {
            setMessage('Please fill in all required fields');
            return;
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price <= 0) {
            setMessage('Please enter a valid price');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const buyData = {
                userId: userId,
                productName: formData.productName,
                price: price
            };

            console.log('🛒 Adding buy record:', buyData);
            const response = await buyRecordAPI.addBuy(buyData);
            console.log('✅ Buy record added:', response.data);

            setMessage('Purchase recorded successfully!');
            
            // Reset form
            setFormData({
                productName: 'MAATU_SAANAM',
                price: ''
            });

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(response.data);
                }
            }, 1000);

        } catch (error) {
            console.error('❌ Error adding buy record:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to record purchase';
            setMessage('Error: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'MAATU_SAANAM': '🐄 மாட்டு சாணம் (Organic Manure)',
            'GRASS_FEED': '🌿 Grass & Cattle Feed',
            'MILK_PRODUCT': '🥛 Milk & Dairy Products', 
            'OTHER': '📦 Other Farm Products'
        };
        return labels[category] || category;
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <div className="form-header">
                    <h2><i className="fas fa-cart-plus"></i> Record Purchase</h2>
                    <p>Add your farm product purchase details</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productName">
                            <i className="fas fa-tags"></i> Product Category *
                        </label>
                        <select
                            id="productName"
                            name="productName"
                            className="form-control"
                            value={formData.productName}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        >
                            <option value="MAATU_SAANAM">🐄 மாட்டு சாணம் (Organic Manure)</option>
                            <option value="GRASS_FEED">🌿 Grass & Cattle Feed</option>
                            <option value="MILK_PRODUCT">🥛 Milk & Dairy Products</option>
                            <option value="OTHER">📦 Other Farm Products</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">
                            <i className="fas fa-rupee-sign"></i> Purchase Price *
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="form-control"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter purchase price"
                            required
                            disabled={loading}
                            step="0.01"
                            min="0"
                        />
                        <small style={{color: '#718096', fontSize: '0.8rem'}}>
                            Enter the total amount paid for this purchase
                        </small>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            <i className="fas fa-arrow-left"></i> Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading || !formData.productName.trim() || !formData.price}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Recording...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check"></i> Record Purchase
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBuyRecord;