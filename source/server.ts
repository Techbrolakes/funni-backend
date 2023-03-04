import express, { Request } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/conn';
import cors from 'cors';
import { IUserDocument } from './interfaces/user.interface';

export interface ExpressRequest extends Request {
    user?: IUserDocument;
}
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});

connectDB()
    .then(() => {
        try {
            app.listen(port, () => console.log(`Server listening & database connected on ${port}`));
        } catch (e) {
            console.log('Cannot connect to the server');
        }
    })
    .catch((e) => {
        console.log('Invalid database connection...! ', +e);
    });
