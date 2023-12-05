import { NotificationInstance } from 'antd/es/notification/interface';
import { NotificationType } from './types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { firestore } from '../Firebase/firebase';
import { AccountState } from '../Redux/features/account/account-slice';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes
} from 'firebase/storage';
import dayjs from 'dayjs';
import { days, monthsShort } from './Constants';
import { Report } from '../Redux/features/report/report-slice';

export const getCrumbItemsFromPath = (
  path: string,
  homeItem: {
    title: React.JSX.Element;
  }
) => {
  const init = [homeItem];
  if (path === '/') {
    return init;
  } else if (path === '/rfid' || path === '/rfid/') {
    return [...init, { title: 'RFID Data', href: '/rfid' }];
  } else if (path === '/reports' || path === '/reports/') {
    return [...init, { title: 'Reports', href: '/reports' }];
  } else if (path === '/reports/create' || path === '/reports/create/') {
    return [
      ...init,
      { title: 'Reports', href: '/reports' },
      { title: 'Create Report', href: '/reports/create' }
    ];
  } else if (
    (path.match(/\/reports\/(.*)/) || path.match(/\/reports\/(.*)\//)) &&
    !path.match(/\/reports\/(.*)\/(.+)/)
  ) {
    const splitArray = path.split('/');
    const reportId =
      path[path.length - 1] === '/'
        ? splitArray[splitArray.length - 2]
        : splitArray.pop();
    return [
      ...init,
      { title: 'Reports', href: '/reports' },
      { title: reportId, href: `/reports/${reportId}` }
    ];
  } else {
    return [...init, { title: 'Page Not Found' }];
  }
};

export const capitalizeFirstLetter = (raw: string) => {
  const firstLetter = raw[0].toUpperCase();
  const rest = raw.substring(1);
  return firstLetter + rest;
};

export const getInitials = (raw: string, raw2: string) => {
  const firstLetter = raw?.[0]?.toUpperCase();
  const secondLetter = raw2?.[0]?.toUpperCase();
  return firstLetter + secondLetter || 'Undefined';
};

export const getSuccessMessage = (verb: string, thing: string) => {
  return `Successfully ${verb} your ${thing}`;
};

export const openNotificationWithIcon = (
  type: NotificationType,
  api: NotificationInstance,
  verb: string,
  thing: string
) => {
  api[type]({
    message: capitalizeFirstLetter(type),
    description: getSuccessMessage(verb, thing),
    placement: 'top'
  });
};

const addFieldsFromReference = (
  fields: string[],
  ref: object,
  result: object
) => {
  fields.forEach((field) => {
    if (ref[field]) {
      result[field] = ref[field];
    } else {
      if (field !== 'country' && field !== 'province') {
        result[field] = '';
      }
    }
  });
};

export const parseValues = (
  raw: { [x: string]: string },
  saving: boolean,
  isPatient: boolean
) => {
  const result = !saving
    ? {
        name: raw.name,
        surname: raw.surname,
        phone: raw.phone
      }
    : {
        name: raw.name,
        surname: raw.surname
      };
  const fields = isPatient
    ? [
        'dob',
        'gender',
        'address1',
        'address2',
        'country',
        'province',
        'postalCode'
      ]
    : ['address1', 'address2', 'country', 'province', 'postalCode'];
  addFieldsFromReference(fields, raw, result);
  return result;
};

export const addDocWithoutId = async (tableName: string, data: any) => {
  const iCollection = collection(firestore, tableName);
  const ref = await addDoc(iCollection, data);
  return ref;
};

export const addOrEditDoc = async (
  operation: 'add' | 'edit',
  tableName: string,
  id: string,
  data: any
) => {
  const operatingFunction = operation === 'add' ? setDoc : updateDoc;
  const iCollection = collection(firestore, tableName);
  const ref = doc(iCollection, id);
  return await operatingFunction(ref, data);
};

export const fetchAllDocuments = (table: string) => {
  const iCollection = collection(firestore, table);
  return getDocs(iCollection);
};

export const fetchSingleDocument = (table: string, id: string) => {
  const ref = doc(firestore, table, id);
  return getDoc(ref);
};

export const deleteDocument = async (table: string, id: string) => {
  const ref = doc(firestore, table, id);
  await deleteDoc(ref);
};

export const reduxToDbAccount = (redux: AccountState) => {
  return {
    email: redux.info.email,
    name: redux.info.name,
    type: redux.type,
    view: redux.view
  };
};

export const getAllReports = async () => {
  const docs = await fetchAllDocuments('reports');
  const result = [];
  docs.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    result.push({ ...data, id });
  });
  return result;
};

export const getFileUrls = async (id: string, folder: string) => {
  const storage = getStorage();
  const imagesRef = ref(storage, `${id}/${folder}`);
  const list = await listAll(imagesRef);
  return await Promise.all(
    list.items.map(async (item) => {
      return Promise.resolve(getDownloadURL(item));
    })
  );
};

export const getFullDate = (date: string) => {
  const dayjsDate = dayjs(date, 'YYYY-MM-DD');
  return `${days[dayjsDate.day()]}, ${
    monthsShort[dayjsDate.month()]
  } ${dayjsDate.date()}, ${dayjsDate.year()}`;
};

export const uploadFiles = async (
  files: File[],
  folder: string,
  subFolder: string
) => {
  const storage = getStorage();
  files.forEach(async (file, idx) => {
    const storageRef = ref(
      storage,
      `${folder}/${subFolder}/${subFolder}(${idx})`
    );
    await uploadBytes(storageRef, file);
  });
};

export const deleteFiles = async (report: Report) => {
  const { id, imageUrls } = report;
  const imagesCount = imageUrls.length;
  const storage = getStorage();

  const videoRef = ref(storage, `${id}/video/video(0)`);
  await deleteObject(videoRef).catch((error) => {
    console.log(error);
  });

  for (let i = 0; i < imagesCount; i++) {
    const imgRef = ref(storage, `${id}/images/images(${i})`);

    await deleteObject(imgRef).catch((error) => {
      console.log(error);
    });
  }
};
