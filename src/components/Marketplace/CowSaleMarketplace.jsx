import React, { useState, useEffect } from 'react';
import { cowSalePostAPI } from '../../services/api';
import '../../styles/marketplace.css';

const CowSaleMarketplace = ({ userEmail, onAddNew, onEditPost }) => {
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [contactModal, setContactModal] = useState(null);

    const userId = userEmail;

    useEffect(() => {
        loadPosts();
    }, [activeTab]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            let response;
            
            if (activeTab === 'all') {
                response = await cowSalePostAPI.getAllPosts();
            } else {
                response = await cowSalePostAPI.getUserPosts(userId);
            }
            
            console.log('🔍 Marketplace: API Response:', response);
            console.log('🖼️ Posts with images:', response.data?.map(post => ({
                id: post.id,
                userName: post.userName,
                imageUrl: post.imageUrl,
                hasImage: !!post.imageUrl
            })));
            
            setPosts(response.data || []);
            
        } catch (error) {
            console.error('❌ Marketplace: Error loading posts:', error);
            setMessage('Failed to load posts: ' + (error.response?.data?.message || error.message));
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // 👇 NEW: Back to Dashboard function
    const handleBackToDashboard = () => {
        window.history.back(); // Or you can use a prop callback if needed
    };

    // Sample data function
    const createSampleData = () => {
        const sampleData = [
            {
                id: '1',
                userName: 'Raja Kumar',
                mobileNumber: '9876543210',
                description: 'Healthy Jersey cow for sale. 3 years old, good milk production.',
                location: 'Krishnagiri',
                imageUrl: null,
                date: new Date().toISOString().split('T')[0]
            },
            {
                id: '2',
                userName: 'Murugan',
                mobileNumber: '8765432109',
                description: '2 Holstein cows available. Vaccinated and healthy.',
                location: 'Dharmapuri',
                imageUrl: null,
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
            },
            {
                id: '3',
                userName: 'Gopal',
                mobileNumber: '7654321098',
                description: 'Local breed cow with calf. Good for dairy farming.',
                location: 'Hosur',
                imageUrl: null,
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0]
            }
        ];
        setPosts(sampleData);
        setMessage('Sample data loaded for demonstration');
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await cowSalePostAPI.deleteCowSalePost(id, userId);
            setMessage('Post deleted successfully');
            loadPosts();
        } catch (error) {
            console.error('❌ Marketplace: Error deleting post:', error);
            setMessage('Failed to delete post: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleContact = (post) => {
        setContactModal(post);
    };

    const handleCall = (mobileNumber) => {
        window.open(`tel:${mobileNumber}`, '_self');
    };

    const handleWhatsApp = (mobileNumber, userName) => {
        const message = `Hi ${userName}, I'm interested in your cow sale post from CattleEnterprise.`;
        window.open(`https://wa.me/${mobileNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const filteredPosts = activeTab === 'all' ? posts : posts.filter(post => post.mobileNumber === userId);

    if (loading) {
        return (
            <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading marketplace...</p>
            </div>
        );
    }

    return (
        <div className="marketplace-section">
            {/* 👇 BACK BUTTON ADDED */}
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
                
                <h1><i className="fas fa-store"></i> Cow Sale Marketplace</h1>
                <p>Buy and sell cattle with trusted farmers in your area</p>
            </div>

            {message && (
                <div className={`message ${message.includes('successfully') || message.includes('Sample data') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

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
                <button className="btn-pr" onClick={onAddNew}>
                    <i className="fas fa-plus"></i> Create New Post
                </button>
            </div>

            {filteredPosts.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-store" style={{fontSize: '4rem', color: '#cbd5e0', marginBottom: '1rem'}}></i>
                    <h3>No Posts Found</h3>
                    <p>
                        {activeTab === 'all' 
                            ? 'Be the first to create a cow sale post in the marketplace!' 
                            : 'You haven\'t created any sale posts yet.'}
                    </p>
                    
                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <button className="btn btn-primary" onClick={onAddNew}>
                            Create Your First Post
                        </button>
                        
                        {/* {activeTab === 'all' && (
                            <button 
                                className="btn btn-secondary" 
                                onClick={createSampleData}
                            >
                                <i className="fas fa-vial"></i> Load Sample Data (Demo)
                            </button>
                        )} */}
                        
                        {/* 👇 BACK BUTTON IN EMPTY STATE TOO */}
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
                            {/* 🖼️ CORRECTED IMAGE DISPLAY */}
                            {post.imageUrl ? (
                                <img 
                                    src={`http://localhost:8080${post.imageUrl}`}
                                    alt={`Cow for sale by ${post.userName}`}
                                    className="post-image"
                                    onError={(e) => {
                                        console.log('❌ Image failed to load:', post.imageUrl);
                                        e.target.style.display = 'none';
                                        // Show placeholder when image fails
                                        const placeholder = e.target.nextElementSibling;
                                        if (placeholder) {
                                            placeholder.style.display = 'flex';
                                        }
                                    }}
                                    onLoad={(e) => {
                                        console.log('✅ Image loaded successfully:', post.imageUrl);
                                        // Hide placeholder when image loads
                                        const placeholder = e.target.nextElementSibling;
                                        if (placeholder) {
                                            placeholder.style.display = 'none';
                                        }
                                    }}
                                />
                            ) : null}
                            
                            {/* Image Placeholder - Always present but conditionally shown */}
                            <div 
                                className="post-image-placeholder" 
                                style={{ 
                                    display: post.imageUrl ? 'none' : 'flex',
                                    width: '100%',
                                    height: '200px',
                                    background: 'linear-gradient(135deg, #805ad5 0%, #6b46c1 100%)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    borderBottom: '1px solid #e2e8f0'
                                }}
                            >
                                <i className="fas fa-cow" style={{fontSize: '3rem', opacity: '0.8'}}></i>
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

            {/* 👇 FLOATING BACK BUTTON FOR MOBILE
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
                    zIndex: 1000,
                    transition: 'all 0.3s ease'
                }}
                title="Back to Dashboard"
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.background = '#6b46c1';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = '#805ad5';
                }}
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
                        </div>
                        <p>Interested in this cow sale? Contact the seller directly!</p>
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

export default CowSaleMarketplace;