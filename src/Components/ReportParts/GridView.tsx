import React from 'react';
import { ViewProps } from '../../Utilities/types';
import {
  Row,
  Col,
  Card,
  Image,
  Avatar,
  Typography,
  Empty,
  Popconfirm
} from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { colors } from '../../Utilities/Constants';
import { useNavigate } from 'react-router-dom';
import { deleteDocument, deleteFiles, getFullDate } from '../../Utilities/Util';
import { useAppDispatch } from '../../Redux/hooks';
import { changeReports } from '../../Redux/features/report/report-slice';

const GridView: React.FC<ViewProps> = ({ reports }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
              <Row justify={'space-between'}>
                <Col>
                  <Typography.Link href={`/reports/${report.id}`}>
                    View Full Report
                  </Typography.Link>
                </Col>
                <Col>
                  <Popconfirm
                    onConfirm={async () => {
                      await deleteDocument('reports', report.id);
                      await deleteFiles(report);
                      dispatch(
                        changeReports(
                          reports.filter((rep) => rep.id !== report.id)
                        )
                      );
                    }}
                    title={'Delete Report'}
                    description='Are you sure you want to delete this report?'
                  >
                    <Typography.Link style={{ color: 'red' }}>
                      Delete Report
                    </Typography.Link>
                  </Popconfirm>
                </Col>
              </Row>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default GridView;
