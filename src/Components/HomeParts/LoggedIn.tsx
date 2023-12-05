import { Result, Image, Button, message } from 'antd';
import React from 'react';
import useScreenSize from '../../Hooks/useScreenSize';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase/firebase';
import { changeLoggedIn } from '../../Redux/features/account/account-slice';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';

const LoggedIn: React.FC = () => {
  const [api, contextHolder] = message.useMessage();
  const screenSize = useScreenSize();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const account = useAppSelector((state) => state.account);
  const { info, type } = account;

  return (
    <>
      {contextHolder}
      <Result
        icon={
          <Image
            src='assets/home.png'
            preview={false}
            width={screenSize.width > 450 ? 300 : 200}
            height={screenSize.width > 450 ? 300 : 200}
          />
        }
        title={`You are logged in as ${info.name}`}
        subTitle={
          <>
            <p>Account Type: {type}</p>
            <p>Email: {info.email}</p>
          </>
        }
        extra={[
          <Button
            type='primary'
            key='reports'
            onClick={() => {
              navigate('/reports');
            }}
          >
            Reports
          </Button>,
          <Button
            key='rfid'
            onClick={async () => {
              navigate('/rfid');
            }}
          >
            RFID Data
          </Button>
        ]}
      />
    </>
  );
};

export default LoggedIn;
