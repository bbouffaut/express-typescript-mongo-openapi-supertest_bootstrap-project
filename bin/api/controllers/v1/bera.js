"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bera = void 0;
const bera = (req, res) => {
    // get the post id from the req
    const id = req.params.id;
    const bera = {
        massif_id: id
    };
    res.status(200).json(bera);
};
exports.bera = bera;
