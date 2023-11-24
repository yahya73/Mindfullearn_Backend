import message from "../model/message.js";
export async function getAllMessages(req, res) {
  await message.find({})

    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export async function addOnceMessage(req) {
    
    // Invoquer la méthode create directement sur le modèle
   await message
    .create(req)
    
    .then(newmessage => {
        console.log(newmessage)
       // res.json(newmessage);
    })
    .catch(err => {
       // res.json({ error: err });
    });
}

export async function getOnceMessage(req, res) {
    await message
    .findOne({ "content": req.params.content })
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}


export async function deleteOnceMessage(req, res) {
    await message
    .findOneAndDelete({ "content": req.params.content })
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}