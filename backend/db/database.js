import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const initDB = async () => {
    return open({
        filename: './db/tic-tac-toe.db',
        driver: sqlite3.Database,  
    });
};

const db = await initDB();
export default db;
