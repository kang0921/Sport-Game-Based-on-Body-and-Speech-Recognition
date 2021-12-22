let action = 'Punch_left';
let video;
let poseNet;
let pose;
let skeleton;
let brain;
let state = 'waiting';
let targetLabel;


function keyPressed() {
  console.log('Ready to collecting!');
  // 5秒後開始收集資料
  setTimeout(
    function () {
      targetLabel = action;
      console.log(targetLabel);
      console.log('collecting');
      state = 'collecting';
    }, 8000);

  // 停止收集資料
  setTimeout(
    function () {
      console.log('waiting');
      state = 'waiting';
      brain.saveData(); // 儲存收集到的資料
    }, 300000);

}

function setup() {
  createCanvas(640, 480); // 建立畫布
  video = createCapture(VIDEO); // 建立影像(透過WebCam)
  video.hide();  // 隱藏影像
  poseNet = ml5.poseNet(video, modelLoaded);  // Initialize ml5.poseNet
  poseNet.on('pose', gotPoses); // An event listener that returns the results when a pose is detected.


  // 設定參數
  let options = {
    inputs: 34,
    outputs: 2,
    task: 'classification',
    debug: true
  }

  brain = ml5.neuralNetwork(options); // 建立神經網路
}

// 偵測到pose後的動作
function gotPoses(poses) {

  if (poses.length > 0) { //有動作
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') {  //目前的狀態是要收集動作的
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x; //關節點的X座標
        let y = pose.keypoints[i].position.y; //關節點的Y座標
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel]; // 做什麼動作
      brain.addData(inputs, target);  //將收集到的資料給神經網路並告訴大腦是做什麼動作
    }
  }
}

function modelLoaded() {
  console.log('PoseNet ready');  // 若initialize ml5.poseNet會印出字樣
}

// 畫出骨骼
function draw() {

  // 將影像反轉
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {

    // 畫出每一個skeleton
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0]; // 骨骼的的一端
      let b = skeleton[i][1]; // 骨骼的另一端
      strokeWeight(5); // 粗度
      stroke(255);  // 線條顏色
      line(a.position.x, a.position.y, b.position.x, b.position.y); // 畫線
    }

    // 畫出每一個keypoints
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x; // 關節點的X座標
      let y = pose.keypoints[i].position.y; // 關節點的Y座標
      fill(197, 244, 224);  // 圖案填滿顏色
      stroke(255, 255, 255); // 框線顏色
      ellipse(x, y, 12, 12);  // 畫圓
    }
  }
}