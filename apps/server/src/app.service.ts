import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class AppService {
  healthCheck() {
// TODO: implement health check later
// 	async function isMongoConnected(): Promise<boolean> {
// 		const uri = 'your-mongodb-connection-string';
// 		const client = new MongoClient(uri);

// 		try {
// 			await client.connect();
// 			await client.db('admin').command({ ping: 1 });
// 			return true;
// 		} catch (error) {
// 			console.error('MongoDB connection error:', error);
// 			return false;
// 		} finally {
// 			await client.close();
// 		}
// 	}

// 	const isConnected = await isMongoConnected();
// 	return { status: isConnected ? 'MongoDB is connected' : 'MongoDB is not connected' };
  }
}
