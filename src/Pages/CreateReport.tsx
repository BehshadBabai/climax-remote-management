import React from 'react';
import { useAppSelector } from '../Redux/hooks';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  TimePicker,
  Upload,
  notification
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';
import useScreenSize from '../Hooks/useScreenSize';
import {
  addDocWithoutId,
  openNotificationWithIcon,
  uploadFiles
} from '../Utilities/Util';
import { useForm } from 'antd/es/form/Form';

const CreateReport: React.FC = () => {
  const account = useAppSelector((state) => state.account);
  const scSize = useScreenSize();
  const { loggedIn, id, info } = account;
  const name = info.name;
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = useForm();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loggedIn) {
      navigate('/');
    }
  }, []);

  const createReport = async (values) => {
    try {
      const { title, description, videos, images } = values;
      const date = values.date.format('YYYY-MM-DD');
      const time = values.time.format('HH:mm');
      setSubmitLoading(true);
      const reportRef = await addDocWithoutId('reports', {
        title,
        description,
        date,
        time,
        reply: '',
        creatorId: id,
        creatorName: name
      });
      const reportId = reportRef.id;
      const videoFiles = videos.fileList.map((rcFile) => rcFile.originFileObj);
      await uploadFiles(videoFiles, reportId, 'video');
      const imagesFiles = images.fileList.map((rcFile) => rcFile.originFileObj);
      await uploadFiles(imagesFiles, reportId, 'images');
      openNotificationWithIcon('success', api, 'created', 'report');
      setTimeout(() => {
        form.resetFields();
        navigate('/reports');
      }, 500);
    } catch (error) {
      api.error({
        message: 'Failed',
        description: 'Failed to Create Your Report',
        placement: 'top'
      });
    } finally {
      setTimeout(() => {
        setSubmitLoading(false);
      }, 500);
    }
  };

  return (
    <>
      {contextHolder}
      <Form size='large' onFinish={createReport} form={form}>
        <Row justify={'space-between'}>
          <Col xs={24} md={10}>
            <Form.Item
              name={'title'}
              rules={[
                {
                  required: true,
                  message: 'Please input report title!'
                }
              ]}
            >
              <Input placeholder='Report Title' />
            </Form.Item>
          </Col>
          <Col xs={24} md={14}>
            <Row
              justify={scSize.width > 767 ? 'end' : 'start'}
              gutter={[10, 0]}
            >
              <Col>
                <Form.Item
                  name={'date'}
                  rules={[
                    {
                      required: true,
                      message: 'Please input report date!'
                    }
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={'time'}
                  rules={[
                    {
                      required: true,
                      message: 'Please input report time!'
                    }
                  ]}
                >
                  <TimePicker format='HH:mm' minuteStep={5} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.Item
          name={'description'}
          rules={[
            {
              required: true,
              message: 'Please input report description!'
            }
          ]}
        >
          <TextArea
            placeholder='Report Description'
            style={{ height: '225px' }}
          />
        </Form.Item>
        <Form.Item
          name={'videos'}
          rules={[
            {
              required: true,
              message: 'Please upload a video!',
              validator: async (_rule, value) => {
                if (value.fileList.length < 1) {
                  throw new Error('Something wrong!');
                }
              }
            }
          ]}
        >
          <Upload
            listType='picture'
            maxCount={1}
            accept='video/mp4,video/x-m4v,video/*'
            customRequest={({ onSuccess }) => {
              onSuccess('ok');
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Video</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name={'images'}
          rules={[
            {
              required: true,
              message: 'Please upload a minimum of 1 image!',
              validator: async (_rule, value) => {
                if (value.fileList.length < 1) {
                  throw new Error('Something wrong!');
                }
              }
            }
          ]}
        >
          <Upload
            listType='picture'
            multiple
            accept='image/png, image/jpeg, image/heic'
            customRequest={({ onSuccess }) => {
              onSuccess('ok');
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button'
            loading={submitLoading}
          >
            Create Report
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateReport;
