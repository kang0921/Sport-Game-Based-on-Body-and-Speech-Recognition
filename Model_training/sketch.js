let epoch = 50;  //設定epoch

function setup() {
  // 設定神經網路的options
  let options = {
    inputs: 34,
    outputs: 14,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options); //建立神經網路
  console.log("Punch1024.json is loading.");
  brain.loadData('Punch1024.json', dataReady);  //將收集到的資料給神經網路
}

//神經網路已收集完資料後
function dataReady() {
  brain.normalizeData();  //資料標準化成0~1
  brain.train({ epochs: epoch }, finished); // 訓練神經網路
}

//訓練完成後
function finished() {
  console.log('model trained');  //印出已訓練完成字樣
  brain.save();  //儲存訓練完成的神經網路
}
