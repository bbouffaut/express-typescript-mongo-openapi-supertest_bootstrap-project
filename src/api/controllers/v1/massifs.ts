import { Request, Response } from 'express';

// getting all posts
export const massifs = (req: Request, res: Response): void => {
    const massifs = [{
      massif_id: '10',  
    },
    {
        massif_id: '15',
    }]; 
    
    res.status(200).json(massifs);
};