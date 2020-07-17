# 저녁 뭐먹지

## 목적
* 편의점의 할인 / 추가 증정 이벤트 등을 모아서 알려주고, 메뉴를 추천해주는 챗봇입니다.
* 알기 어려운 편의점 레시피를 추천해줍니다.

## 기능 
* 편의점 이벤트 정보 확인(크롤러 이용, 매일 업데이트)
* 최근 많은 좋아요를 받은 메뉴 추천(추천 후, 좋았다 별로였다 확인 가능하도록 구현)
* 특정 메뉴를 고르면 그 메뉴를 기반으로 한 편의점 레시피 추천. or 어떤 스타일의 레시피 추천
* Test in https://today-dinner.azurewebsites.net/

![pages](./test_pages.png)

### ISSUE
- [x] 크롤러 이용하여 이벤트 상품 추출하기
- [ ] json으로 조합법 만들기
- [ ] 메뉴 추천 기능
- [ ] 추천 기능을 위해 이어지는 QnA스크립트 만들기
- [ ] (가능하면) GPS기능 이용하여 주변의 편의점 리스트화
- [ ] 위의 기능이 안된다면 지역입력시 편의점 정보 크롤링

### 사용 기술
 - Chat-Bot : Bot Framework / Node.js 
 - QnA-Maker : C#
 - Crawler : Python 
 - Hosting : Azure

## 구조

TO DO : MVP 0.5까지 완료 후 구조 그림과 함께 작성


## Bot Framework Emulator를 이용한 테스트
**로컬에서 테스트 시 JS모듈과 .env파일이 필요함.** 

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator)은 봇 개발자가 로컬호스트에서 봇을 테스트하고 디버그하거나 터널을 통해 원격으로 실행할 수 있는 데스크톱 애플리케이션입니다.

- Bot Framework Emulator version 4.9.0버전이나 더 높은 버전은  [여기](https://github.com/Microsoft/BotFramework-Emulator/releases)에서 설치할 수 있습니다.

### Bot Framework Emulator를 이용하여 Local의 봇과 연결하는 방법

- Bot Framework Emulator를 실행합니다.
- File -> Open Bot을 선택합니다.
- 봇의 URL자리에 `http://localhost:3978/api/messages`를 입력합니다.

## Reference

- [Azure Bot Service 설명서](https://docs.microsoft.com/ko-kr/azure/bot-service/?view=azure-bot-service-4.0)
- [김영욱 멘토님의 Bot Framework Guide](https://github.com/KoreaEva/Bot)
- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Dialogs](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-dialog?view=azure-bot-service-4.0)
- [Gathering Input Using Prompts](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=javascript)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)
- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)
- [Azure Portal](https://portal.azure.com)
- [Language Understanding using LUIS](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Restify](https://www.npmjs.com/package/restify)
- [dotenv](https://www.npmjs.com/package/dotenv)
