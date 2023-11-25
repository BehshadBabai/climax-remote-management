import { Breadcrumb } from 'antd';
import React from 'react';
import { getCrumbItemsFromPath } from '../Utilities/Util';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const Crumb: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const homeItem = {
    title: (
      <Link to='/'>
        <HomeOutlined /> <span>Home</span>
      </Link>
    )
  };
  const rawItems = React.useMemo(() => {
    return getCrumbItemsFromPath(path, homeItem);
  }, [path]);
  const items = rawItems.map((el, idx) => {
    if (idx === 0) {
      return el;
    }
    const result = { ...el, title: <Link to={el.href}>{el.title}</Link> };
    return result;
  });
  return <Breadcrumb items={items} separator={'>'} />;
};

export default Crumb;
