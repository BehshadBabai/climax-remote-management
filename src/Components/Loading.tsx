import { LoadingOutlined } from '@ant-design/icons';
import { Col, Row, Spin } from 'antd';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100wh',
        height: 'calc(100vh - 100px)'
      }}
    >
      <Row justify={'center'} gutter={[0, 20]}>
        <Col span={6}>
          <Spin size='large' indicator={<LoadingOutlined />} />
        </Col>
        <Col span={24}>
          {' '}
          <span style={{ margin: '100px' }}>Loading...</span>
        </Col>
      </Row>
    </div>
  );
};

export default Loading;
