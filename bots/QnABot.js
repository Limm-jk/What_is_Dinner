/**
 * @author [Limm-jk]
 * @email [201602057@cs-cnu.org]
 * @create date 2020-07-17 17:19:24
 * @modify date 2020-07-17 17:19:24
 * @desc [QnAbot - 편의점의 할인 정보와 조합법을 알려줌]
 */

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
var Conv = JSON.parse(fs.readFileSync(path.join(__dirname, './resources/EventList_200724.json'), 'utf8'));
const cuplus_length = Conv["cu_plus"].length

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
                // switch(qnaResults[0].answer){
                //     case "CU플러스":
                //         const replyText = 'CU플러스 행사중인 상품 중 추천 목록입니다.';
                //         await context.sendActivity(MessageFactory.text(replyText, replyText));
                //         var result = 0
                //         var recommend_arr = []
                //         for (var j = 0 ; j < 5; j++) recommend_arr.push(Math.floor(Math.random() * cuplus_length) + 1);
                //         for(var i = 0 ; i <cuplus_length; i++){
                //             if(recommend_arr.includes(i)){
                //                 var yText = Conv["cu_plus"][i].name + " / " +  Conv["cu_plus"][i].price+"\n";
                //                 await context.sendActivity(MessageFactory.text(yText, yText));
                //             }  
                //         }
                //         break;
                // }
                if(qnaResults[0].answer == "CU플러스"){
                    const replyText = 'CU플러스 행사중인 상품 중 추천 목록입니다.';
                    await context.sendActivity(MessageFactory.text(replyText, replyText));
                    var result = 0
                    var recommend_arr = []
                    for (var j = 0 ; j < 5; j++) recommend_arr.push(Math.floor(Math.random() * cuplus_length) + 1);
                    for(var i = 0 ; i <cuplus_length; i++){
                        if(recommend_arr.includes(i)){
                            var yText = Conv["cu_plus"][i].name + " / " +  Conv["cu_plus"][i].price+"\n";
                            await context.sendActivity(MessageFactory.text(yText, yText));
                        }  
                    }
                }
                else if(qnaResults[0].answer == "마크정식"){
                    const replyText = '재료 : 자이언트 떡볶이, 콕콕콕 스파게티, 치즈, 후랑크\n 1. 떡볶이는 물을 약간 적게! + 전자레인지 3분! 소세지는 30초! \n 2. 완료된 스파게티와 떡볶이를 섞고 그 위에 다 올려~~ \n 3. 전자레인지에 30초 돌려주면 완성!';
                    await context.sendActivity(MessageFactory.text(replyText, replyText));
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