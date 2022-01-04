import { Request, Response, NextFunction } from 'express';

// getting all posts
const getMassifs = async (req: Request, res: Response, next: NextFunction) => {
    const massifs = {}; 
    return res.status(200).json(massifs);
};

export default { getMassifs };