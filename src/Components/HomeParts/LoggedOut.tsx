import React from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Row,
  Tooltip,
  message
} from 'antd';
import { auth } from '../../Firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  AccountType,
  ReportsViewType,
  changeConnectionId,
  changeInfo,
  changeReportsViewType,
  changeType,
  changeUserId
} from '../../Redux/features/account/account-slice';
import { firebaseErrorCodes } from '../../Utilities/Constants';
import useScreenSize from '../../Hooks/useScreenSize';
import { useAppDispatch } from '../../Redux/hooks';
import { fetchAllDocuments } from '../../Utilities/Util';

const LoggedOut: React.FC = () => {
  const [loginType, setLoginType] = React.useState<AccountType>(null);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const screenSize = useScreenSize();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Row style={{ width: '100%' }} justify={'center'} gutter={[0, 40]}>
      <Col span={24}>
        <Alert
          message='Beta Version'
          description='This is currently the beta version of this application. Select a login mode to enable logging into the application. The fake users are made for demonstration purposes and can be read/modified by anyone. Do not store any sensetive information on these users.'
          type='warning'
          showIcon
          closable={false}
        />
      </Col>
      <Col span={24}>
        <Row
          style={{ width: '100%' }}
          justify={'center'}
          gutter={[screenSize.width > 767 ? 20 : 0, 20]}
        >
          <Col xs={24} md={10}>
            <Card
              title='Manager Login'
              className='betaCard'
              headStyle={{ background: '#f78713', color: 'rgb(249, 249, 249)' }}
              onClick={() => {
                const checked = loginType && loginType === 'manager';
                if (!checked) {
                  setLoginType('manager');
                } else {
                  setLoginType(null);
                }
              }}
              extra={
                <Checkbox
                  checked={loginType && loginType === 'manager'}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setLoginType('manager');
                    } else {
                      setLoginType(null);
                    }
                  }}
                />
              }
            >
              Demonstrates the features of the application when logged in as a
              construction manager by logging you in with a fake manager
              account. Please don't store any sensetive information as it can be
              read/modified by anyone.
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card
              title='Supervisor Login'
              className='betaCard'
              headStyle={{ background: '#f78713', color: 'rgb(249, 249, 249)' }}
              onClick={() => {
                const checked = loginType && loginType === 'supervisor';
                if (!checked) {
                  setLoginType('supervisor');
                } else {
                  setLoginType(null);
                }
              }}
              extra={
                <Checkbox
                  checked={loginType && loginType === 'supervisor'}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setLoginType('supervisor');
                    } else {
                      setLoginType(null);
                    }
                  }}
                />
              }
            >
              Demonstrates the features of the application when logged in as a
              supervisor by logging you in with a fake supervisor account.
              Please don't store your any sensetive information as it can be
              read/modified by anyone.
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xs={21} md={24}>
        <Row style={{ width: '100%', paddingRight: '20px' }} justify={'center'}>
          <Tooltip
            className='betaLogin'
            title={!loginType ? 'Select a login option to proceed' : ''}
          >
            <Button
              type='primary'
              disabled={!loginType}
              loading={loginLoading}
              onClick={async () => {
                setLoginLoading(true);
                try {
                  const email =
                    loginType === 'manager'
                      ? 'manager@gmail.com'
                      : 'supervisor@yahoo.com';
                  const password = '111111';
                  const res = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                  );
                  const user = res.user;
                  dispatch(changeUserId(user.uid));
                  const docs = await fetchAllDocuments('users');
                  docs.forEach((doc) => {
                    const id = doc.id;
                    const data = doc.data();
                    const name = data.name as string;
                    const email = data.email as string;
                    const connectionId = data.connectionId as string;
                    const type = data.type as AccountType;
                    const view = data.view as ReportsViewType;
                    if (id === user.uid) {
                      dispatch(changeInfo({ name, email }));
                      dispatch(changeType(type));
                      dispatch(changeReportsViewType(view));
                      dispatch(changeConnectionId(connectionId));
                    }
                  });
                  message.success('Login Successful');
                  navigate('./reports');
                } catch (error) {
                  message.error(
                    error.code === firebaseErrorCodes.invalidLogin
                      ? 'Invalid Username/Password'
                      : 'Failed to Login'
                  );
                } finally {
                  setLoginLoading(false);
                }
              }}
            >
              Log in
            </Button>
          </Tooltip>
        </Row>
      </Col>
    </Row>
  );
};

export default LoggedOut;
