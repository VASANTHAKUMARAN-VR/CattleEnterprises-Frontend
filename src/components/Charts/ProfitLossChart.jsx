import React, { useState, useEffect } from 'react';
import { Card, Statistic, Alert, Spin, Typography, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons';
import { profitLossAPI } from '../../services/api';  // ✅ use your existing API file
import '../../styles/ProfitLoss.css';

const { Title, Text } = Typography;

const ProfitLossChart = ({ userId }) => {
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfitLoss = async () => {
    if (!userId) {
      setError('User ID is missing');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('🔍 Fetching profit/loss for user:', userId);
      const response = await profitLossAPI.getProfitLoss(userId);  // ✅ correct call
      console.log('✅ Profit/Loss Response:', response.data);
      setProfitData(response.data);
    } catch (err) {
      console.error('❌ Error fetching profit/loss:', err);
      setError('Failed to fetch profit/loss data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfitLoss();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Profit 💸': return '#52c41a';
      case 'Loss 📉': return '#f5222d';
      case 'Break Even ⚖️': return '#faad14';
      default: return '#1890ff';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Profit 💸': return <ArrowUpOutlined />;
      case 'Loss 📉': return <ArrowDownOutlined />;
      case 'Break Even ⚖️': return <MinusOutlined />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="profit-loss-loading">
        <Spin size="large" />
        <Text>Calculating your profit/loss...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <button onClick={fetchProfitLoss} className="retry-btn">
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="profit-loss-container">
      <Title level={2}>💰 Profit & Loss Analysis</Title>

      {profitData && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card className="profit-loss-card">
              <Statistic
                title="Status"
                value={profitData.status}
                valueStyle={{ color: getStatusColor(profitData.status) }}
                prefix={getStatusIcon(profitData.status)}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="profit-loss-card">
              <Statistic
                title="Amount"
                value={profitData.amount}
                precision={2}
                valueStyle={{
                  color:
                    profitData.status === 'Loss 📉'
                      ? '#f5222d'
                      : profitData.status === 'Profit 💸'
                      ? '#52c41a'
                      : '#faad14',
                }}
                prefix="₹"
              />
            </Card>
          </Col>

          
        </Row>
      )}

      {!profitData && !loading && (
        <Alert
          message="No Data"
          description="No profit/loss data available for the current user."
          type="info"
          showIcon
        />
      )}
    </div>
  );
};

export default ProfitLossChart;
