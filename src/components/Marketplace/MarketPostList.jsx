import React, { useState, useEffect } from 'react';
import { marketPostAPI } from '../../services/api';
import '../../styles/marketplace.css';

const MarketPostList = ({ userEmail, onAddNew, onEditPost, onBack }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [contactModal, setContactModal] = useState(null);

    const userId = userEmail;

    useEffect(() => {
        loadPosts();
    }, [activeTab, selectedCategory]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            let response;
            
            if (activeTab === 'all') {
                if (selectedCategory === 'ALL') {
                    response = await marketPostAPI.getAllPosts();
                } else {
                    response = await marketPostAPI.getByCategory(selectedCategory);
                }
            } else {
                response = await marketPostAPI.getUserPosts(userId);
            }
            
            console.log('🔍 Market Posts:', response.data);
            setPosts(response.data || []);
            
        } catch (error) {
            console.error('❌ Error loading posts:', error);
            setMessage('Failed to load posts');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToDashboard = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await marketPostAPI.deletePost(id, userId);
            setMessage('Post deleted successfully');
            loadPosts();
        } catch (error) {
            console.error('❌ Error deleting post:', error);
            setMessage('Failed to delete post');
        }
    };

    const handleContact = (post) => {
        setContactModal(post);
    };

    const handleCall = (mobileNumber) => {
        window.open(`tel:${mobileNumber}`, '_self');
    };

    const handleWhatsApp = (mobileNumber, userName) => {
        const message = `Hi ${userName}, I'm interested in your post from CattleEnterprise.`;
        window.open(`https://wa.me/${mobileNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'MAATU_SAANAM': '🐄 மாட்டு சாணம்',
            'GRASS_FEED': '🌿 Grass & Feed',
            'MILK_PRODUCT': '🥛 Milk Products', 
            'OTHER': '📦 Other'
        };
        return labels[category] || category;
    };

    const getCategoryColor = (category) => {
        const colors = {
            'MAATU_SAANAM': '#38a169',
            'GRASS_FEED': '#2f855a', 
            'MILK_PRODUCT': '#3182ce',
            'OTHER': '#805ad5'
        };
        return colors[category] || '#805ad5';
    };

    const filteredPosts = activeTab === 'all' ? posts : posts.filter(post => post.mobileNumber === userId);

    if (loading) {
        return (
            <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading market posts...</p>
            </div>
        );
    }

    return (
        <div className="marketplace-section">
            {/* Header with Back Button */}
            <div className="marketplace-header" style={{position: 'relative'}}>
                <button 
                    className="back-button"
                    onClick={handleBackToDashboard}
                    style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid #805ad5',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        color: '#805ad5',
                        transition: 'all 0.3s ease'
                    }}
                    title="Back to Dashboard"
                >
                    <i className="fas fa-arrow-left"></i>
                </button>
                
                <h1><i className="fas fa-shopping-cart"></i> Farm Market</h1>
                <p>Buy and sell farm products in your area</p>
            </div>

            {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* Tabs and Filters */}
            <div className="marketplace-tabs">
                <button 
                    className={`marketplace-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    <i className="fas fa-globe"></i> All Posts ({posts.length})
                </button>
                <button 
                    className={`marketplace-tab ${activeTab === 'my' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my')}
                >
                    <i className="fas fa-user"></i> My Posts ({posts.filter(post => post.mobileNumber === userId).length})
                </button>
                
                {/* Category Filter */}
                {activeTab === 'all' && (
                    <select 
                        className="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '2px solid #805ad5',
                            borderRadius: '25px',
                            background: 'white',
                            color: '#805ad5',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="ALL">📁 All Categories</option>
                        <option value="MAATU_SAANAM">🐄 மாட்டு சாணம்</option>
                        <option value="GRASS_FEED">🌿 Grass & Feed</option>
                        <option value="MILK_PRODUCT">🥛 Milk Products</option>
                        <option value="OTHER">📦 Other</option>
                    </select>
                )}
                
                <button className="btn-pr" onClick={onAddNew}>+ Create New Post
                </button>
            </div>

            {filteredPosts.length === 0 ? (
                <div className="empty-state">
                    <h3>No Posts Found</h3>
                    <p>
                        {activeTab === 'all' 
                            ? 'Be the first to create a market post!' 
                            : 'You haven\'t created any posts yet.'}
                    </p>
                    
                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <button className="btn btn-primary" onClick={onAddNew}>
                         Create Your First Post
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            onClick={handleBackToDashboard}
                        >
                         Back to Dashboard
                        </button>
                    </div>
                </div>
            ) : (
                <div className="marketplace-grid">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="cow-sale-post-card">
                            {/* Image Display */}
                            {post.imageUrl ? (
                                <img 
                                    src={`http://localhost:8080${post.imageUrl}`}
                                    alt={`Product: ${post.description}`}
                                    className="post-image"
                                    onError={(e) => {
                                        console.log('❌ Image failed to load:', post.imageUrl);
                                        e.target.style.display = 'none';
                                        const placeholder = e.target.nextElementSibling;
                                        if (placeholder) {
                                            placeholder.style.display = 'flex';
                                        }
                                    }}
                                    onLoad={(e) => {
                                        console.log('✅ Image loaded successfully:', post.imageUrl);
                                        const placeholder = e.target.nextElementSibling;
                                        if (placeholder) {
                                            placeholder.style.display = 'none';
                                        }
                                    }}
                                />
                            ) : null}
                            
                            {/* Image Placeholder */}
                            <div 
                                className="post-image-placeholder" 
                                style={{ 
                                    display: post.imageUrl ? 'none' : 'flex'
                                }}
                            >
                                <i className="fas fa-shopping-bag"></i>
                            </div>

                            <div className="post-content">
                                <div className="post-header">
                                    <div className="post-user-info">
                                        <div className="post-user-name">{post.userName}</div>
                                        <div className="post-mobile">
                                            <i className="fas fa-phone"></i>
                                            {post.mobileNumber}
                                        </div>
                                    </div>
                                    <div className="post-date">
                                        {new Date(post.date).toLocaleDateString('en-IN')}
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="category-badge" style={{
                                    background: getCategoryColor(post.category),
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '15px',
                                    fontSize: '0.8rem',
                                    display: 'inline-block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600'
                                }}>
                                    {getCategoryLabel(post.category)}
                                </div>

                                <div className="post-description">
                                    {post.description}
                                </div>

                                <div className="post-location">
                                    <i className="fas fa-map-marker-alt"></i>
                                    {post.location}
                                </div>

                                <div className="post-actions">
                                    {post.mobileNumber === userId ? (
                                        <>
                                            <button 
                                                className="post-action-btn edit"
                                                onClick={() => onEditPost(post)}
                                                title="Edit Post"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="post-action-btn delete"
                                                onClick={() => handleDelete(post.id)}
                                                title="Delete Post"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            className="post-action-btn contact"
                                            onClick={() => handleContact(post)}
                                            title="Contact Seller"
                                        >
                                            <i className="fas fa-phone"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Back Button
            <button 
                className="floating-back-button"
                onClick={handleBackToDashboard}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '2rem',
                    background: '#805ad5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 12px rgba(128, 90, 213, 0.3)',
                    zIndex: 1000
                }}
                title="Back to Dashboard"
            >
                <i className="fas fa-arrow-left"></i>
            </button> */}

            {/* Contact Modal */}
            {contactModal && (
                <div className="contact-modal">
                    <div className="contact-modal-content">
                        <h3>Contact Seller</h3>
                        <div className="contact-info">
                            <p><strong>Name:</strong> {contactModal.userName}</p>
                            <p><strong>Mobile:</strong> {contactModal.mobileNumber}</p>
                            <p><strong>Location:</strong> {contactModal.location}</p>
                            <p><strong>Category:</strong> {getCategoryLabel(contactModal.category)}</p>
                        </div>
                        <p>Interested in this product? Contact the seller directly!</p>
                        <div className="contact-actions">
                            <button 
                                className="btn btn-primary" 
                                onClick={() => handleCall(contactModal.mobileNumber)}
                            >
                                <i className="fas fa-phone"></i> Call Now
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => handleWhatsApp(contactModal.mobileNumber, contactModal.userName)}
                            >
                                <i className="fab fa-whatsapp"></i> WhatsApp
                            </button>
                            <button 
                                className="btn btn-secondary" 
                                onClick={() => setContactModal(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketPostList;