import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RfidData: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      style={{ marginTop: '50px' }}
      status='warning'
      title='No RFID Data Found'
      subTitle='There are no recorded RFID data at this time. Please contact your administrator for more information.'
      extra={
        <Button
          type='primary'
          key='console'
          onClick={() => {
            navigate('/');
          }}
        >
          Back to Home
        </Button>
      }
    />
  );
};

export default RfidData;
