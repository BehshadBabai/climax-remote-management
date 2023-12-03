import { Avatar, Col, Row, Typography } from 'antd';
import React from 'react';

export type PersonProps = {
  src: string;
  text: string;
};

const Person: React.FC<PersonProps> = ({ src, text }) => {
  return (
    <Row align={'top'} gutter={[20, 0]}>
      <Col>
        <Avatar
          shape='circle'
          src={src}
          size={'large'}
          style={{
            width: '70px',
            height: '70px',
            background: 'gray'
          }}
        />
      </Col>
      <Col>
        <Typography.Title level={5}>{text}</Typography.Title>
      </Col>
    </Row>
  );
};

export default Person;
