import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import AuthController from './Controllers/AuthController';
import UserController from './Controllers/UserController';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, Express with TypeScript and Prisma!' });
});


app.use('/api/auth', AuthController);
app.use('/api/user', UserController);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});