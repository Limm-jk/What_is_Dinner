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
const { plugins } = require('restify');
const { SSL_OP_ALL } = require('constants');
var jsonObj = JSON.parse(fs.readFileSync(path.join(__dirname, './resources/test.json'), 'utf8'));
var Conv = JSON.parse(fs.readFileSync(path.join(__dirname, './resources/EventList_200724.json'), 'utf8'));
var recipe = JSON.parse(fs.readFileSync(path.join(__dirname, './resources/recipe.json'), 'utf8'));
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
                var Qna_Answer = "";
                var debug_str = "";
                Qna_Answer += qnaResults[0].answer;
                // 01- = meal
                // 02- = drink
                // 03- = snack
                // 04 = plus
                // 05 = morning
                const Control_Value = Qna_Answer.substring(0,1);
                
                if(Control_Value == "0"){
                    // Bot내부의 출력값이 필요하면 맨 앞에 0을 출력하도록 QnAMaker에서 설정
                    // 여기선 0일경우를 다룸
                    const Data_Value = parseInt(Qna_Answer.substring(1,2));

                    // 출력할 데이터의 분류를 함.
                    switch(Data_Value){
                        case 1:
                            // In recipe, Category "meal"
                            var recipe_index = Qna_Answer.split("-");
                            recipe_index = parseInt(recipe_index[1]);
                        
                            var replyText = "재료 : " + recipe["meal"][recipe_index].stuff + "\n\n\n\n ☆레시피☆ \n" + recipe["meal"][recipe_index].recipe;
                            await context.sendActivity(MessageFactory.text(replyText, replyText));

                            break;
                        case 2:
                            // In recipe, Category "drink"
                            var recipe_index = Qna_Answer.split("-");
                            recipe_index = parseInt(recipe_index[1]);
                        
                            var replyText = "재료 : " + recipe["drink"][recipe_index].stuff + "\n\n\n\n ☆레시피☆ \n" + recipe["drink"][recipe_index].recipe;
                            await context.sendActivity(MessageFactory.text(replyText, replyText));

                            break;
                        case 3:
                            // In recipe, Category "snack"
                            var recipe_index = Qna_Answer.split("-");
                            recipe_index = parseInt(recipe_index[1]);
                        
                            var replyText = "재료 : " + recipe["snack"][recipe_index].stuff + "\n\n\n\n ☆레시피☆ \n" + recipe["snack"][recipe_index].recipe;
                            await context.sendActivity(MessageFactory.text(replyText, replyText));

                            break;
                        case 4:
                            // CU Event / Plus
                            const plusText = 'CU 플러스 행사중인 상품 중 추천 목록입니다.';
                            await context.sendActivity(MessageFactory.text(plusText, plusText));

                            var recommend_arr = []
                            for (var j = 0 ; j < 5; j++) recommend_arr.push(Math.floor(Math.random() * cuplus_length));

                            for(var i = 0 ; i <cuplus_length; i++){
                                if(recommend_arr.includes(i)){
                                    var replyText = Conv["cu_plus"][i].name + " / " +  Conv["cu_plus"][i].price+"\n";
                                    await context.sendActivity(MessageFactory.text(replyText, replyText));
                                }  
                            }

                            break;
                        case 5:
                            // CU Event / morning
                            const plusText = 'CU 아침애 행사중인 상품 중 추천 목록입니다.';
                            await context.sendActivity(MessageFactory.text(plusText, plusText));

                            var recommend_arr = []
                            for (var j = 0 ; j < 5; j++) recommend_arr.push(Math.floor(Math.random() * cuplus_length));

                            for(var i = 0 ; i <cuplus_length; i++){
                                if(recommend_arr.includes(i)){
                                    var replyText = Conv["cu_morning"][i].name + " / " +  Conv["cu_morning"][i].price+"\n";
                                    await context.sendActivity(MessageFactory.text(replyText, replyText));
                                }  
                            }

                            break;
                        default:
                            await context.sendActivity(qnaResults[0].answer);
                            break;
                            // 0으로 시작하지만, DB가 필요한 명령이 아님
                    }
                }
                else{
                    await context.sendActivity(qnaResults[0].answer);
                }
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
                // if(qnaResults[0].answer == "CU플러스"){
                //     const replyText = 'CU플러스 행사중인 상품 중 추천 목록입니다.';
                //     await context.sendActivity(MessageFactory.text(replyText, replyText));

                //     var recommend_arr = []
                //     for (var j = 0 ; j < 5; j++) recommend_arr.push(Math.floor(Math.random() * cuplus_length) + 1);
                //     for(var i = 0 ; i <cuplus_length; i++){
                //         if(recommend_arr.includes(i)){
                //             var yText = Conv["cu_plus"][i].name + " / " +  Conv["cu_plus"][i].price+"\n";
                //             await context.sendActivity(MessageFactory.text(yText, yText));
                //         }  
                //     }
                // }
                // else if(qnaResults[0].answer == "마크정식"){
                //     var replyText = "";

                //     var recipe_find_Text = qnaResults[0].answer + "! " + "레시피 알려드릴게요!";
                //     await context.sendActivity(MessageFactory.text(recipe_find_Text, recipe_find_Text));

                //     for(var i = 0 ; i <recipe["meal"].length; i++){
                //         if(recipe["meal"][i].name == "마크정식"){
                //             replyText = "재료 : " + recipe["meal"][i].stuff + "\n\n\n\n ☆레시피☆ \n" + recipe["meal"][i].recipe;
                //             await context.sendActivity(MessageFactory.text(replyText, replyText));
                //             break;
                //         }
                //         var replyTex = recipe["meal"][i].name;
                //         await context.sendActivity(MessageFactory.text(replyTex, replyTex));
                //     }
                //     if (replyText == "") {
                //         const error_recipe = "레시피를 찾지 못했어요 ㅠㅠ 다른 레시피를 검색해주세요.";
                //         await context.sendActivity(MessageFactory.text(error_recipe, error_recipe));
                //     } 
                // }
                // else{
                //     await context.sendActivity(qnaResults[0].answer);
                // }
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
