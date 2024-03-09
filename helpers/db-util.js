import { MongoClient } from 'mongodb';

export async function connectDatabase() {
    // Connect to mongodb database. Database password: TsQcfOKPty2q4KgZ
    const client = await MongoClient.connect(
        'mongodb+srv://haziq:TsQcfOKPty2q4KgZ@cluster0.vwkwzqm.mongodb.net/events?retryWrites=true&w=majority&appName=Cluster0'
    );
    return client;
}

export async function insertDocument(client, collection,  document) {
    // create a concrete of db
    const db = client.db();
                    // get access to collection
    const result =   await db.collection(collection)
                    //  run our queries for example insertOne for adding new entries (called doc in mongodb). [need to be JSON]
                    .insertOne(document);

    return result;
}

export async function getAllDocuments(client, collection, sort) {

    // create concrete of client
    const db = client.db();

    // find method ofcourse to narrow searches. But if we write only 'find()' it will display all
    // sort to simplify search. sort according to id by using "_id" in descending order
    // toArray simplify but giving all the entries in Array. Originally we only got a cursor
    const documents = await db.collection(collection).find().sort(sort).toArray();

    return documents;
}
