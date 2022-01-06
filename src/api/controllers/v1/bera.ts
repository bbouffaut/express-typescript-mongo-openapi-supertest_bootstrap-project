import { Request, Response } from 'express';

export const bera = (req: Request, res: Response): void => {
    // get the post id from the req
    const id: string = req.params.id;

    const bera = {
        massif_id: id
    };

    res.status(200).json(bera);

};
