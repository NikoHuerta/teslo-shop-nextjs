import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    ok: boolean;
    message: string
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    return res.status(400).json({ ok: false, message: 'Bad Request' });
}