import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider, Layout, Row, Col, Spin } from 'antd';
import NoPage from './Pages/NoPage';
import Home from './Pages/Home';
import CustomHeader from './Components/CustomHeader';
import Crumb from './Components/Crumb';
import Reports from './Pages/Reports';
import CreateReport from './Pages/CreateReport';
import Report from './Pages/Report';
import { auth } from './Firebase/firebase';
import {
  AccountType,
  changeInfo,
  changeLoggedIn,
  changeType
} from './Redux/features/account/account-slice';
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { fetchAllDocuments } from './Utilities/Util';

const { Content } = Layout;

const App = () => {
  const [pending, setPending] = React.useState(true);
  const dispatch = useDispatch();

  React.useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docs = await fetchAllDocuments('users');
        docs.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          const name = data.name as string;
          const email = data.email as string;
          const type = data.type as AccountType;
          if (id === user.uid) {
            dispatch(changeInfo({ name, email }));
            dispatch(changeType(type));
          }
        });
        dispatch(changeLoggedIn(true));
        setPending(false);
      } else {
        dispatch(changeLoggedIn(false));
        setPending(false);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#f78713'
          },
          components: {
            Layout: {
              bodyBg: 'rgb(249, 249, 249)'
            }
          }
        }}
      >
        <Layout style={{ minHeight: '100vh' }}>
          <CustomHeader />
          {!pending ? (
            <Content
              style={{
                margin: '24px 16px',
                padding: 24
              }}
            >
              <Row justify={'center'} gutter={[0, 10]}>
                <Col span={21}>
                  <Crumb />
                </Col>
                <Col span={21}>
                  <Routes>
                    <Route path='/' element={<Home />} />
                    <Route index element={<Home />} />
                    <Route path='reports' element={<Reports />} />
                    <Route path='reports/create' element={<CreateReport />} />
                    <Route path='reports/:id' element={<Report />} />
                    <Route path='404' element={<NoPage />} />
                    <Route path='*' element={<NoPage />} />
                  </Routes>
                </Col>
              </Row>
            </Content>
          ) : (
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
          )}
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
