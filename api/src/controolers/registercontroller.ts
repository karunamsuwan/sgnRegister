import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db/db"

type RegisterProp = {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
    address: string,
    files?: string[]
}

export const createRegister = async ({ firstName, lastName, username, password, email, address, files }: RegisterProp) => {

    try {
        let sql = 'INSERT INTO user (firstName, lastName, username, password, email, address) ';
        sql += 'VALUES (?, ?, ?, ?, ?, ?)';

        const response = await pool.query<ResultSetHeader>(sql, [firstName, lastName, username, password, email, address]);

        const userId = response[0].insertId;

        if (userId) {
            if (files && files.length > 0) {
                const fileValues = files.map(fileName => [userId, fileName]);

                console.log(fileValues);

                const fileSql = 'INSERT INTO files (userId, fileName) VALUES ?';
                await pool.query<ResultSetHeader>(fileSql, [fileValues]);
            }
        }

        return response;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

interface FileRow {
    firstName: string;
    lastName: string;
    userId: number;
    fileName: string;
}

interface FileWithUrl extends FileRow {
    fileUrl: string;
}

export const getFiles = async (): Promise<FileWithUrl[]> => {
    try {
        let sql = 'SELECT us.firstName, us.lastName, fi.fileName FROM files fi ';
        sql += 'join user us on us.userId = fi.userId';
        const [rows] = await pool.query<(RowDataPacket & FileRow)[]>(sql);

        const filesWithUrls: FileWithUrl[] = rows.map((file) => ({
            ...file,
            fileUrl: 'http://192.168.1.101:3000' + `/uploads/${file.fileName}`
        }));

        return filesWithUrls;
    } catch (error) {
        console.error('Error fetching files:', error);
        throw new Error('Failed to fetch files');
    }
}