function handler(req, res){
    const eventId = req.query.eventId;

    // if request method is POST
    if (req.method === 'POST') {
        const { email, name, text } = req.body;

        // add server-side validation
        if (
            !email.includes('@') || 
            !name || 
            name.trim()=== '' || 
            !text || 
            text.trim() === ''
        ) {
            res.status(422).json({message: 'invalid input.'});  
            return;
        }

        // console log data
        console.log(email, name, text);
        const newComment = {
            id: new Date().toISOString(),
            email,
            name,
            text
        };
        console.log(newComment);
        res.status(201).json({message: 'Comment added', comment: newComment})

    } 
    
    // if request method is GET
    else if (req.method === 'GET') {
        const dummyList = [
            { id: 'c1', name: 'Max', text: 'A first comment!' },
            { id: 'c2', name: 'Manuel', text: 'A second comment!' },
        ];

        res.status(200).json({ comments: dummyList });
    }
}

export default handler;