import createError from 'http-errors';
import express from 'express';
import morgan from 'morgan';
import logger from './logger';
import { sequelize } from './models';
import { getEventsJob } from './cronJob';

const app = express();

app.use(
  morgan('dev', {
    stream: { write: (message) => logger.debug(message.trim()) }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

sequelize
  .sync()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:', error);
  });

getEventsJob.start();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
