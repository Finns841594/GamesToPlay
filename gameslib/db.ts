import { MongoClient } from 'mongodb';
import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';

const uri = 'mongodb+srv://yangfengforwork:JXqlO6iAjwdvD6aH@fspersonalcluster.ke4v7bk.mongodb.net/games';

const ifGameInDb = async (gameName:string) : Promise<boolean> => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('games');
    const collectionGames = db.collection('gamesMeta');
    const results = await collectionGames.find({ name: gameName }).toArray();
    if (results.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await client.close();
  }
};

const addAGame = async (gameMeta:any, currentAddingYear:string) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('games');
    const collectionGames = db.collection('gamesMeta');
    const results = await collectionGames.insertOne({
      name: gameMeta.name,
      imgUrl: gameMeta.background_image,
      tgaYear: currentAddingYear,
      tgaWinner: false,
      played: false,
      metaData: gameMeta,
    });
    if (results) {
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await client.close();
  }
};

const getGames = async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('games');
    const collectionGames = db.collection('gamesMeta');
    const results = await collectionGames.find({}).toArray();
    return results;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await client.close();
  }
};

const getGameListByUserId = async (userId:string, year:string) => {
  const client = new MongoClient(uri);
  console.log('inputs:', userId, year);
  try {
    await client.connect();
    const db = client.db('games');
    const collectionForUser = db.collection(userId);
    const gamelistForUser = await collectionForUser.find({ tgaYear: year }).toArray();
    return gamelistForUser;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await client.close();
  }
};

const togglePlayed = async (userId:string, gameId:string) => {
  const client = new MongoClient(uri);
  console.log('current inputs are:', userId, gameId);
  try {
    await client.connect();
    const db = client.db('games');
    const collectionForUser = db.collection(userId);

    const oldValue = await collectionForUser.findOne({ name: gameId });
    console.log('current value is:', oldValue.played);
    const resultFromDb = await collectionForUser.updateOne(
      { name: gameId },
      { $set: { played: !oldValue.played } },
    );
    return resultFromDb;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await client.close();
  }
};

const generateGamesInDatabase = async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('games');
    const tgalistColl = db.collection('tgalist');
    const gamesMetaColl = db.collection('gamesMeta');

    // const tgaList = await tgalistColl.distinct('nominated');
    // const databaseList = await gamesMetaColl.distinct('name');
    // const missing = tgaList.filter(item => databaseList.indexOf(item) < 0);

    // read tga list by year, type manually!!!!!!
    const currentAddingYear = '2017';
    const result = await tgalistColl.find({ year: currentAddingYear }).toArray();
    const gamelistToAdd = result[0].nominated;
    console.log('getting from tgalist: ', gamelistToAdd);

    // fetch six games data from rawg-api to gamesMeta Collection
    gamelistToAdd.forEach(async gameName => {
      const isExist = await ifGameInDb(gameName);
      console.log('Game ', gameName, ' existed: ', isExist);
      if (!isExist) {
        try {
          const postResponse = await axios.get(`https://api.rawg.io/api/games?key=b93edb137bd94aabaaeec2e83150169c&search=${gameName}&search_precise=true`);
          await addAGame(postResponse.data.results[0], currentAddingYear);
          console.log('Writed into database: ', postResponse.data.results[0].name);
        } catch (error) {
          console.log(error);
        }
      }
    });

    // setTimeout(() => {
    //   // set tga winner
    //   const thisYearWinnerName = result[0].winner;
    //   gamesMetaColl.updateOne({ name: thisYearWinnerName }, { $set: { tgaWinner: true } });

    //   // copy games to user's game list
    //   const usersColl = db.collection('user001');
    //   usersColl.insertMany(gamesMetaColl.find({ tgaYear: currentAddingYear }).toArray());
    // }, 5000);

    return true;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await client.close();
  }
};

export default {
  getGames, getGameListByUserId, generateGamesInDatabase, togglePlayed,
};
