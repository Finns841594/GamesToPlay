/* eslint-disable linebreak-style */
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import {
  getGames, getGameListByUserId, generateGamesInDatabase, togglePlayed,
} from './gameslib';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/api', (req: Request, res: Response) => res.json({ message: 'You have reached the Cart API' }));

app.get('/api/games', async (req: Request, res: Response) => {
  const games = await getGames();
  return res.json(games);
});

app.get('/api/users/:userId/:year', async (req: Request, res: Response) => {
  const { userId, year } = req.params;
  const games = await getGameListByUserId(userId, year);
  return res.json(games);
});

app.post('/api/users/:userId/:gameId', async (req: Request, res: Response) => {
  const { userId, gameId } = req.params;
  const game = await togglePlayed(userId, gameId);
  return res.json(game);
});

// a special api for generating database contents
app.post('/api/generateGamesInDatabase', async (req: Request, res: Response) => {
  const games = await generateGamesInDatabase();
  return res.json(games);
});

if (require.main === module) {
  app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
}

export = { app };
