import express from 'express';
import registerRoute from './routes/register.route';
import path from 'path';

const app = express();

app.use(express.json());

app.use('/register', registerRoute);
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.listen(3000, () => {
    console.log('http://localhost:3000/');
});