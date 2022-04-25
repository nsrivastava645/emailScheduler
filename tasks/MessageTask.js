const {messageService} = require('../Services/messageService');
const path = require("path");
const fs = require("fs/promises");
let MessageTask = async function(req, res, isAPI = false){
    if(!isAPI){
        let [users, messages] = await Promise.all([
            fs.readFile(path.resolve(__dirname, "../inputs/subscribers.json"), 'utf-8'),
            fs.readFile(path.resolve(__dirname, "../inputs/messages.json"), 'utf-8'),
          ]);
          users = JSON.parse(users);
          messages = JSON.parse(messages);
        for(let i = 0; i < messages.length; i++){
            let messageResult = await messageService.sendMessage(null, null, users.map(x=>x.phone), messages[i].body, true);
            if(messageResult.status){
                messages[i].status = 1;
            }
            await fs.writeFile(path.resolve(__dirname, "../inputs/messages.json"), JSON.stringify(messages, null, 2), 'utf-8');
        }
    } else {
        let {recipients, body} = req.body;
        await messageService.sendMessage(req, res, recipients, body, false);
    }
}

module.exports = MessageTask;