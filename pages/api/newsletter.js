import { connectDatabase, insertDocument } from '../../helpers/db-util';

async function handler(req, res) {
    //if the operation is POST
    if (req.method === 'POST') {
        const userEmail = req.body.email; 

        if (!userEmail || !userEmail.includes('@')) {
            res.status(422).json({messge: 'Invalid email address.'});
            return;    
        }

        let client; // initialize client var so inserDocument can be parse even if error occur

        try {
            // connect to mongodb
            client = await connectDatabase();
        } catch(error) {
            res.status(500).json({message: 'Connecting o the database failed'});
            return;
        }
        
        try {
            await insertDocument(client, 'newsletter', { email: userEmail });
            client.close(); //close client 
        } catch (error) {
            res.status(500).json({message: 'Inserting data failed'});
            return;
        }
        res.status(201).json({ message: 'Signed up!' });
    } 
}

export default handler;