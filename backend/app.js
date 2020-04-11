import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import xml2js from 'xml2js';
import estimator from '../src/estimator';

const app = express();
const port = process.env.PORT || 3000;


app.use(helmet());
app.use(cors());
app.use(morgan());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/v1/xml', (req, res) => {
  // const result = estimator(req.body);
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(estimator(req.body));
  res.set('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

app.use('/api/v1/json', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200).json(estimator(req.body));
});

app.use('/api/v1/', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200).json(estimator(req.body));
});


app.listen(port, (err) => {
  /* eslint no-console: off */
  if (err) {
    console.log('error is', err);
  }

  console.log(`server running on port ${port}`);
});
