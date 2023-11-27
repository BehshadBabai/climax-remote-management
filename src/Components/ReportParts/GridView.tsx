import React from 'react';
import { ViewProps } from '../../Utilities/types';
import { Row, Col, Card, Image, Avatar, Typography, Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { colors } from '../../Utilities/Constants';
import { useNavigate } from 'react-router-dom';
import { getFullDate } from '../../Utilities/Util';

const GridView: React.FC<ViewProps> = ({ reports }) => {
  const navigate = useNavigate();
  return (
    <Row gutter={[16, 32]} style={{ marginTop: '20px' }}>
      {reports.length < 1 && (
        <Row justify={'center'} style={{ width: '100%' }}>
          <Col>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Col>
        </Row>
      )}
      {reports.map((report) => {
        return (
          <Col
            xs={{ span: 24 }}
            lg={{ span: 12 }}
            xl={{ span: 8 }}
            style={{ display: 'flex', justifyContent: 'center' }}
            key={report.id}
          >
            <Card
              className='customCard'
              headStyle={{ borderBottom: '2px solid lightgray' }}
              cover={
                <Image
                  alt='report image'
                  src={report.imageUrls?.[0]}
                  height={200}
                />
              }
              title={
                <Row justify={'space-between'} align={'middle'}>
                  <Typography.Text
                    className='reportTitle'
                    onClick={() => {
                      navigate(`./${report.id}`);
                    }}
                  >
                    {report.title}
                  </Typography.Text>
                  <Avatar
                    icon={<FileTextOutlined />}
                    style={{ background: colors.orange }}
                    size={30}
                  />
                </Row>
              }
              style={{ width: 300 }}
            >
              <p>Supervisor: {report.creatorName}</p>
              <p>Date: {getFullDate(report.date)}</p>
              <p>Time: {report.time}</p>
              <Typography.Link href={`/reports/${report.id}`}>
                View Full Report
              </Typography.Link>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default GridView;
