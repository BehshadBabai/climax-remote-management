import { FileTextOutlined } from '@ant-design/icons';
import React from 'react';
import { Avatar, List, Image, Typography, Space, Button } from 'antd';
import { ViewProps } from '../../Utilities/types';
import { colors } from '../../Utilities/Constants';
import { getFullDate } from '../../Utilities/Util';
import useScreenSize from '../../Hooks/useScreenSize';

const ListView: React.FC<ViewProps> = ({ reports }) => {
  const screenSize = useScreenSize();
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
            <Typography.Link href={`/reports/${item.id}`}>
              View Full Report
            </Typography.Link>
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
