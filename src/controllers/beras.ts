import { Request, Response, NextFunction } from 'express';

// getting all posts
const getBeras = async (req: Request, res: Response, next: NextFunction) => {
    const massifs = {}; 
    
    return res.status(200).json(massifs);
};

const getBera = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    const id: string = req.params.id;

    const massif = {
        massif_id: id
    };

    return res.status(200).json(massif);

}

export default { getBeras, getBera };