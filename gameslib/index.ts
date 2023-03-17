/* eslint-disable max-len */
import db from './db';

const getGames = async () => db.getGames();
const getGameListByUserId = async (userId:string, year:string) => db.getGameListByUserId(userId, year);
const togglePlayed = async (userId:string, gameId:string) => db.togglePlayed(userId, gameId);
const generateGamesInDatabase = async () => db.generateGamesInDatabase();

export {
  getGames, getGameListByUserId, generateGamesInDatabase, togglePlayed,
};
