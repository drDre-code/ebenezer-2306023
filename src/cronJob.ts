import { CronJob } from 'cron';
import { getNewEvents } from './controllers/activity.controller';

export const getEventsJob = new CronJob('*/1 * * * *', getNewEvents);
