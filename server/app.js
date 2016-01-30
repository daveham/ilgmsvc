import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import config from 'config';

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const paths = config.utils_paths;

const router = express.Router();
router.get('/status', (req, res) => {
  res.send('good');
});
app.use(router);

app.use(express.static(paths.base(config.dir_dist)));

import test from 'test';
test();

export default app;
