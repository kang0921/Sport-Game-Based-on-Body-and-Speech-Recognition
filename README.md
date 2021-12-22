輔仁大學資訊工程學系專題
- 專題名稱：基於肢體與語音辨識之運動遊戲
- Sport Game Based on Body and Speech Recognition
- 指導教授
  - 王國華 博士
- 專題組員 
  - 407261099 資工四甲 陳禹辰
  - 407261128 資工四甲 康智絜
  - 407261415 資工四甲 陳思璇
  - 407261439 資工四甲 張鈞奕


### 摘要
由於新冠肺炎的影響，多數人在家中的時間增加，較不方便去戶外運動或去健身房。本專題開發了一個運動遊戲，旨在建立一個僅需一台電腦及可連接到電腦的鏡頭，即可偵測肢體動作的運動健身遊戲，希望滿足想在室內運動的人的需求並兼具趣味性。
本專題使用Unity製作遊戲，利用WebSocket傳輸協定將p5.js和Unity作連接，使用p5.js中訓練完成的模型判斷玩家是否有做指定動作的辨識結果，以及語音辨識產生的字串回傳給Unity，讓Unity將對應結果呈現在遊戲畫面中。透過p5.js建置PoseNet來辨識玩家身體的17處關節所在位置，作為模型訓練之依據，利用深度學習來訓練模型辨識動作，並設計一個簡單的二元分類法即時用於運動遊戲中，以辨識玩家動作是否符合遊戲規定。本專題在p5.js建立語音辨識系統，利用語音辨識來控制遊戲開始前的關卡選擇與遊戲進行，讓玩家不需額外器材，即可操作遊戲畫面。
