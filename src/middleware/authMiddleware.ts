import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '@/types/models';

interface CustomNextApiRequest extends NextApiRequest {
  user?: User;
}

const authMiddleware = (handler: NextApiHandler) => async (req: CustomNextApiRequest, res: NextApiResponse) => {
  // Obtenha o token do cabeçalho da requisição
  const token = req.headers.authorization?.replace('Bearer ', '');

  try {
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verifique e decodifique o token JWT
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY as string);

    // Verifique se o usuário existe e se possui as permissões necessárias
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Adicione o usuário decodificado ao objeto de requisição para uso posterior
    req.user = decoded as User;

    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authMiddleware;