import { FileTextOutlined } from '@ant-design/icons';
import React from 'react';
import {
  Avatar,
  List,
  Image,
  Typography,
  Space,
  Button,
  Row,
  Col,
  Popconfirm
} from 'antd';
import { ViewProps } from '../../Utilities/types';
import { colors } from '../../Utilities/Constants';
import { deleteDocument, getFullDate } from '../../Utilities/Util';
import useScreenSize from '../../Hooks/useScreenSize';
import { changeReports } from '../../Redux/features/report/report-slice';
import { useAppDispatch } from '../../Redux/hooks';

const ListView: React.FC<ViewProps> = ({ reports }) => {
  const screenSize = useScreenSize();
  const dispatch = useAppDispatch();
  return (
    <List
      style={{ marginTop: '20px' }}
      itemLayout='vertical'
      size='large'
      pagination={{
        onChange: (_page) => {},
        pageSize: 5,
        align: 'center'
      }}
      dataSource={reports}
      renderItem={(item) => (
        <List.Item
          key={item.title}
          actions={[
            <Space direction='vertical' size={'middle'}>
              <Typography.Link href={`/reports/${item.id}`}>
                View Full Report
              </Typography.Link>
              <Popconfirm
                onConfirm={async () => {
                  await deleteDocument('reports', item.id);
                  dispatch(
                    changeReports(reports.filter((rep) => rep.id !== item.id))
                  );
                }}
                title={'Delete Report'}
                description='Are you sure you want to delete this report?'
              >
                <Typography.Link style={{ color: 'red', display: 'flex' }}>
                  Delete Report
                </Typography.Link>
              </Popconfirm>
            </Space>
          ]}
          extra={
            screenSize.width > 700 ? (
              <Image
                width={275}
                height={175}
                alt='logo'
                style={{ borderRadius: '10px' }}
                src={item.imageUrls?.[0]}
              />
            ) : (
              <></>
            )
          }
        >
          <List.Item.Meta
            avatar={
              <Avatar
                icon={<FileTextOutlined />}
                style={{ background: colors.orange }}
                size={50}
              />
            }
            title={<a href={`/reports/${item.id}`}>{item.title}</a>}
            description={`Supervisor: ${item.creatorName}`}
          />
          <p>Date: {getFullDate(item.date)}</p>
          <p>Time: {item.time}</p>
        </List.Item>
      )}
    />
  );
};

export default ListView;
