import express, { Request, Response } from "express";
import { createRegister, getFiles } from "../controolers/registercontroller";
import multer from 'multer';
import path from 'path';

interface MulterRequest extends Request {
    files: Express.Multer.File[];
}

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, name.endsWith(ext) ? name : name + ext);
    }
});

const upload = multer({ storage });

router.post("/", upload.array("files"), async (req: MulterRequest, res: Response) => {
    try {
        const { userData } = req.body;
        const { firstName, lastName, username, password, email, address } = JSON.parse(userData);

        console.log('📁 Uploaded files:', req.files);
        console.log('📝 Form fields:', firstName, lastName, username, password, email, address);

        const fileNames = req.files?.map(file => file.originalname) || [];
        console.log('📋 File names:', fileNames);

        const response = await createRegister({
            firstName,
            lastName,
            username,
            password,
            email,
            address,
            files: fileNames
        });

        res.send({ data: response, message: 'Registration successful' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.get('/files', async (req, res) => {
    try {
        const files = await getFiles();
        console.log(files);
        res.json(files);
    } catch (error) {
        console.error('Error getting files:', error);
        res.status(500).json({ error: 'Failed to get files' });
    }
});


export default router;