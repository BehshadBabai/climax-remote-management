import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider, Layout, Row, Col } from 'antd';
import NoPage from './Pages/NoPage';
import useScreenSize from './Hooks/useScreenSize';
import Home from './Pages/Home';
import CustomHeader from './Components/CustomHeader';

const { Header, Content } = Layout;

const App = () => {
  const screenSize = useScreenSize();

  React.useEffect(() => {}, []);

  return (
    <BrowserRouter>
      <ConfigProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <CustomHeader />
          <Content
            style={{
              margin: '24px 16px',
              padding: 24
            }}
          >
            <Row justify={'center'}>
              <Col span={21}>
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route index element={<Home />} />
                  <Route path='404' element={<NoPage />} />
                  <Route path='*' element={<NoPage />} />
                </Routes>
              </Col>
            </Row>
          </Content>
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
