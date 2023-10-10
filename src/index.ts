import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import { User } from './entity/User';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// data source initialization
AppDataSource.initialize()
  .then(() => {
    console.log('data source initialized successfully');
  })
  .catch((error) => {
    console.error(error);
  });

app.post('/users', async (req, res) => {
  const user = await AppDataSource.getRepository(User).create(req.body);
  const result = await AppDataSource.getRepository(User).save(user);
  return res.send(result);
});

app.get('/users', async (req, res) => {
  const results = await AppDataSource.getRepository(User).find();
  return res.send(results);
});

app.get('/users/:id', async (req, res) => {
  const result = await AppDataSource.getRepository(User).findOneBy({
    id: Number(req.params.id),
  });
  return res.send(result);
});

app.put('/users/:id', async (req, res) => {
  const user = await AppDataSource.getRepository(User).findOneBy({
    id: Number(req.params.id),
  });
  AppDataSource.getRepository(User).merge(user, req.body);
  const result = await AppDataSource.getRepository(User).save(user);
  return res.send(result);
});

app.delete('/users/:id', async (req, res) => {
  const result = await AppDataSource.getRepository(User).delete({
    id: Number(req.params.id),
  });
  return res.send(result);
});

const port = 4000;
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
