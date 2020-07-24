/**
 * @author [Limm-jk]
 * @email [201602057@cs-cnu.org]
 * @create date 2020-07-24 15:02:09
 * @modify date 2020-07-24 15:02:09
 * @desc [이벤트 정보에 따른 Output Handler]
 */


var Event_Script = {};

Event_Script.Event_handle = function(input){
    switch(input){
        case "CU플러스":
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
}

module.exports = Event_Script;