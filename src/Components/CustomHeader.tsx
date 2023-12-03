import React from 'react';
import {
  Col,
  Layout,
  Row,
  Typography,
  Avatar,
  Dropdown,
  MenuProps,
  message
} from 'antd';
import useScreenSize from '../Hooks/useScreenSize';
import { Constants, colors } from '../Utilities/Constants';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { changeLoggedIn } from '../Redux/features/account/account-slice';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const CustomHeader: React.FC = () => {
  const screenSize = useScreenSize();
  const loggedIn = useAppSelector((state) => state.account.loggedIn);
  const [api, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuItem: ItemType = {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutOutlined />,
    onClick: async () => {
      try {
        await signOut(auth);
        api.success('Log Out Successful');
        dispatch(changeLoggedIn(false));
        navigate('/');
      } catch (error) {
        api.error('Log Out Failed');
      }
    }
  };

  const items: MenuProps['items'] = [menuItem];

  return (
    <>
      {contextHolder}
      <Header
        style={{
          height: '100px',
          background: colors.bg,
          borderBottom: '1px solid lightgray'
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
              <Col span={20}>
                <Typography.Title
                  level={screenSize.width < Constants.breakpoint ? 5 : 2}
                  style={{
                    margin: 0,
                    color: colors.gray
                  }}
                >
                  Climax <span style={{ color: colors.orange }}>Remote</span>{' '}
                  Management
                </Typography.Title>
              </Col>
              <Col span={4}>
                {loggedIn && (
                  <Row justify={'end'}>
                    <Col>
                      <Dropdown menu={{ items }}>
                        <Avatar
                          icon={<UserOutlined />}
                          style={{ background: 'gray' }}
                          size={'large'}
                          className='profile'
                        />
                      </Dropdown>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    </>
  );
};

export default CustomHeader;
