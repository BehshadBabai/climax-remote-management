import React from 'react';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading';
import {
  addOrEditDoc,
  fetchSingleDocument,
  getFileUrls,
  openNotificationWithIcon
} from '../Utilities/Util';
import {
  Alert,
  Button,
  Carousel,
  Col,
  Image,
  Modal,
  Result,
  Row,
  Space,
  Typography,
  notification
} from 'antd';
import { Report, changeReports } from '../Redux/features/report/report-slice';
import useScreenSize from '../Hooks/useScreenSize';
import { CalendarOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

const Report: React.FC = () => {
  const account = useAppSelector((state) => state.account);
  const reports = useAppSelector((state) => state.report.reports);
  const dispatch = useAppDispatch();
  const { loggedIn, type } = account;
  const navigate = useNavigate();
  const [pending, setPending] = React.useState(true);
  const [report404, setReport404] = React.useState(false);
  const [report, setReport] = React.useState<Report>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalText, setModalText] = React.useState('');
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const screenSize = useScreenSize();

  const operationText = React.useMemo(() => {
    return type === 'manager'
      ? report?.reply
        ? 'Edit'
        : 'Write'
      : report?.description
        ? 'Edit'
        : 'Write';
  }, [report, type]);

  React.useEffect(() => {
    async function effect() {
      if (!loggedIn) {
        navigate('/');
      }
      const reportId = window?.location?.href?.split('/')?.pop();
      const snapshot = await fetchSingleDocument('reports', reportId);
      const data = snapshot?.data() as Report;
      const id = snapshot?.id;
      if (data) {
        const imageUrls = await getFileUrls(reportId, 'images');
        const videoUrl = (await getFileUrls(reportId, 'video'))?.[0];
        setReport({
          ...data,
          id,
          imageUrls,
          videoUrl
        });
      } else {
        setReport404(true);
      }
      setPending(false);
    }
    effect();
  }, [reports]);

  React.useEffect(() => {
    type === 'manager'
      ? setModalText(report?.reply)
      : setModalText(report?.description);
  }, [report]);

  const initiateChange = () => {
    setModalOpen(true);
  };

  return pending ? (
    <Loading />
  ) : report404 ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        width: '100wh'
      }}
    >
      <Result
        status={'500'}
        title='Oops, Report Not Found!'
        extra={<Button type='primary'>Back to Reports</Button>}
      />
    </div>
  ) : (
    <>
      {contextHolder}
      <Row gutter={[0, 20]} justify={'space-between'} align={'middle'}>
        <Col xs={24} sm={12}>
          <Typography.Title level={3}>{report.title}</Typography.Title>
        </Col>
        <Col xs={24} sm={12}>
          <Space
            style={{
              width: '100%',
              justifyContent: screenSize.width > 575 ? 'flex-end' : 'flex-start'
            }}
          >
            <CalendarOutlined />
            <Typography.Text>
              {report.date + ', at ' + report.time}
            </Typography.Text>
          </Space>
        </Col>
        <Col span={24} style={{ marginTop: '40px' }}>
          <Row justify={'center'} style={{ width: '100%' }} gutter={[40, 40]}>
            <Col xs={24} lg={10}>
              <video
                width={'100%'}
                height={250}
                controls
                style={{ borderRadius: '10px' }}
              >
                <source
                  src={report.videoUrl}
                  type='video/mp4'
                  width={'100%'}
                  height={'100%'}
                />
                Your browser does not support the video tag.
              </video>
            </Col>
            <Col xs={24} lg={9}>
              <Carousel autoplay style={{ width: '100%', height: '250px' }}>
                {report.imageUrls.map((imageUrl, idx) => {
                  return (
                    <div key={imageUrl} style={{ width: '100%' }}>
                      <Image
                        wrapperStyle={{ width: '100%' }}
                        style={{
                          borderRadius: '10px',
                          width: '100%'
                        }}
                        height={250}
                        preview={false}
                        alt={`image ${idx}`}
                        src={imageUrl}
                      />
                    </div>
                  );
                })}
              </Carousel>
            </Col>
            <Col span={24}>
              <Row justify={'center'} style={{ width: '100%' }}>
                <Col xs={24} md={20}>
                  <Typography.Paragraph>
                    <Typography.Title level={4}>Description: </Typography.Title>
                    <pre style={{ padding: '20px' }}>{report.description}</pre>
                    {type === 'supervisor' && (
                      <Button type='primary' onClick={initiateChange}>
                        {operationText} Description
                      </Button>
                    )}
                  </Typography.Paragraph>
                </Col>
                <Col xs={24} md={20}>
                  <Typography.Paragraph>
                    <Typography.Title level={4}>
                      Manager Reply:{' '}
                    </Typography.Title>
                    {report.reply ? (
                      <blockquote style={{ padding: '20px' }}>
                        {report.reply}
                      </blockquote>
                    ) : (
                      <Alert
                        message='No Replies Yet'
                        description='There is no reply from your manager on this report yet.'
                        type='info'
                        showIcon
                      />
                    )}
                    {type === 'manager' && (
                      <Button type='primary' onClick={initiateChange}>
                        {operationText} Reply
                      </Button>
                    )}
                  </Typography.Paragraph>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title={`${operationText} ${
          type === 'manager' ? 'Reply' : 'Description'
        }`}
        open={modalOpen}
        confirmLoading={confirmLoading}
        okText={operationText}
        onOk={() => {
          setConfirmLoading(true);
          const data = {
            [type === 'manager' ? 'reply' : 'description']: modalText
          };
          addOrEditDoc('edit', 'reports', report.id, data)
            .then(() => {
              dispatch(
                changeReports(
                  reports?.map((report) => {
                    if (report.id === report.id) {
                      return { ...report, ...data };
                    }
                    return report;
                  })
                )
              );
              openNotificationWithIcon(
                'success',
                api,
                'changed',
                type === 'manager' ? 'Reply' : 'description'
              );
              setModalOpen(false);
            })
            .catch(() => {
              api.error({
                message: `${operationText} Failed`,
                description: `Failed to ${operationText}, Please try again later`,
                placement: 'top'
              });
            })
            .finally(() => {
              setConfirmLoading(false);
            });
        }}
        onCancel={() => {
          setModalOpen(false);
          setModalText(report.description);
        }}
      >
        <TextArea
          style={{ height: 120 }}
          value={modalText}
          onChange={(e) => {
            setModalText(e.currentTarget.value);
          }}
        />
      </Modal>
    </>
  );
};

export default Report;
