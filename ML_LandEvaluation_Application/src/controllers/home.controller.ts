import { Request, Response } from "express";

export const getInit = (req: Request, res: Response) => {
    res.json({ res: true });
}

export const load = async (req: Request, res: Response) => {
    // let data = await run();
    // await res.json(data);
}
