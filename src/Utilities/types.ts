import { Report } from '../Redux/features/report/report-slice';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type ViewProps = {
  reports: Report[];
};
