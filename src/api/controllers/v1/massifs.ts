import { Request, Response } from 'express';

// getting all posts
export const massifs = (req: Request, res: Response): void => {
    const massifs = {}; 
    
    res.status(200).json(massifs);
};