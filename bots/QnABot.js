// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory, CardFactory } = require('botbuilder');
const WelcomeCard = require('./resources/welcomeCard.json');
const { QnAMaker } = require('botbuilder-ai');
const Convenience = ['GS','이마트','세븐일레븐','CU'];

//json 크롤링
// var requestURL = 'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json';
// var request = new XMLHttpRequest();
// request.open('GET', requestURL);
// request.responseType = 'json';
// request.send();

// request.onload = function() {
//     var Event_Info = request.response;
//     populateHeader(Event_Info);
// }
// const test_Data = require('./resources/test.json');
// var jsonObj = JSON.parse(test_Data);
const path = require('path')
const fs = require('fs');
var jsonObj = JSON.parse(fs.readFileSync(path.join(__dirname, './resources/test.json'), 'utf8'));

class QnABot extends ActivityHandler {
    constructor(configuration, qnaOptions) {
        super();
        if (!configuration) throw new Error('[QnaMakerBot]: Missing parameter. configuration is required');
        // now create a qnaMaker connector.
        this.qnaMaker = new QnAMaker(configuration, qnaOptions);

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            // send user input to QnA Maker.
            const qnaResults = await this.qnaMaker.getAnswers(context);
        
            // If an answer was received from QnA Maker, send the answer back to the user.
            if (qnaResults[0]) {
                if(qnaResults[0].answer == "지옥"){
                    const replyText = '친구... 커플이군요..?';
                    await context.sendActivity(MessageFactory.text(replyText, replyText));
                    for(var i = 0 ; i <jsonObj["conv"].length; i++){
                        var yText = jsonObj["conv"][i].name + " / " + jsonObj["conv"][i].price+"\n";
                        await context.sendActivity(MessageFactory.text(yText, yText));
                    }
                }
                else{
                    await context.sendActivity(qnaResults[0].answer);
                }
            }
            else {
                // If no answers were returned from QnA Maker, reply with help.
                await context.sendActivity('잘 이해하지 못하겠어요. 명령어가 궁금하시다면 "명령어"라고 입력해주세요!');
            }
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
                    await context.sendActivity({ attachments: [welcomeCard] });
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.QnABot = QnABot;