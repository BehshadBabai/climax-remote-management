import React from 'react';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Input, Row, Select, Space, Typography } from 'antd';
import {
  ReportsViewType,
  changeReportsViewType
} from '../Redux/features/account/account-slice';
import {
  FilterOutlined,
  TableOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { addOrEditDoc, reduxToDbAccount } from '../Utilities/Util';
import GridView from '../Components/ReportParts/GridView';
import ListView from '../Components/ReportParts/ListView';
import Loading from '../Components/Loading';

const Reports: React.FC = () => {
  const account = useAppSelector((state) => state.account);
  const reports = useAppSelector((state) => state.report.reports);
  const dispatch = useAppDispatch();
  const { loggedIn, view } = account;
  const navigate = useNavigate();
  const [selectLoading, setSelectLoading] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(true);
  const [reportsToShow, setReportsToShow] = React.useState([]);
  const [initialReports, setInitialReports] = React.useState([]);

  React.useEffect(() => {
    if (!loggedIn) {
      navigate('/');
    }
  }, []);

  React.useEffect(() => {
    if (reports) {
      if (initialReports.length === 0) {
        setInitialReports(
          reports.filter((report) => {
            if (
              report.creatorId === account.id ||
              report.creatorId === account.connectionId
            ) {
              return true;
            }
            return false;
          })
        );
      }
      setReportsToShow(
        reports.filter((report) => {
          if (
            report.creatorId === account.id ||
            report.creatorId === account.connectionId
          ) {
            return true;
          }
          return false;
        })
      );
      setPageLoading(false);
    }
  }, [reports]);

  return pageLoading ? (
    <Loading />
  ) : (
    <Row style={{ marginTop: '25px' }}>
      <Col span={24}>
        <Row justify={'space-between'} gutter={[0, 25]}>
          <Input
            suffix={<FilterOutlined />}
            style={{ width: '225px' }}
            allowClear={true}
            placeholder='Filter By Report Name'
            onChange={(e) => {
              const value = e.currentTarget.value;
              if (value) {
                const newReportList = reports.filter(
                  (el) => el.title?.toLocaleLowerCase()?.includes(value)
                );
                setReportsToShow(newReportList);
              } else {
                setReportsToShow(initialReports);
              }
            }}
          />
          <Select
            size='middle'
            style={{ width: 120 }}
            value={view}
            loading={selectLoading}
            options={[
              { value: 'grid', label: 'Grid' },
              { value: 'list', label: 'List' }
            ]}
            suffixIcon={
              view === 'grid' ? <TableOutlined /> : <UnorderedListOutlined />
            }
            onChange={async (value) => {
              setSelectLoading(true);
              addOrEditDoc(
                'edit',
                'users',
                account.id,
                reduxToDbAccount({ ...account, view: value })
              )
                .then(() => {
                  dispatch(changeReportsViewType(value as ReportsViewType));
                })
                .finally(() => {
                  setSelectLoading(false);
                });
            }}
          />
        </Row>
      </Col>
      <Col span={24}>
        {account.type === 'supervisor' && (
          <Button
            type='primary'
            onClick={() => {
              navigate('./create');
            }}
            style={{ marginTop: '40px', marginBottom: '30px' }}
          >
            Create New Report
          </Button>
        )}
        {account.view === 'grid' ? (
          <GridView reports={reportsToShow} />
        ) : (
          <ListView reports={reportsToShow} />
        )}
      </Col>
    </Row>
  );
};

export default Reports;
