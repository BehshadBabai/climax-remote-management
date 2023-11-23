import React from 'react';
import { Col, Layout, Row, Typography, Button } from 'antd';
import useScreenSize from '../Hooks/useScreenSize';
import { Constants, colors } from '../Utilities/Constants';

const { Header } = Layout;

const CustomHeader: React.FC = () => {
  const screenSize = useScreenSize();
  return (
    <Header
      style={{
        height: '100px',
        background: colors.bg,
        borderBottom: '1px solid black'
      }}
    >
      <Row
        gutter={screenSize.width < Constants.breakpoint ? 10 : 0}
        justify={'center'}
        style={{ height: '100%' }}
      >
        <Col xs={24} sm={23}>
          <Row
            style={{ height: '100%' }}
            justify={'space-between'}
            align={'middle'}
          >
            <Col>
              <Typography.Title
                level={screenSize.width < Constants.breakpoint ? 5 : 2}
                style={{
                  margin: 0
                }}
              >
                Climax Remote Management
              </Typography.Title>
            </Col>
            <Col>
              <Button>out</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
};

export default CustomHeader;
