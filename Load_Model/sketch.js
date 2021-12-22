let action_flag = 3;  // Squat -> 1 ; elbowToKnee -> 2 ; punch -> 3;
let num_output = 14;

let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "Not Ready";
let cnt = 0;
let position_flag = 0;


function setup() {
  createCanvas(640, 480); // 建立畫布
  video = createCapture(VIDEO); // 建立影像(透過WebCam)
  video.hide();  // 隱藏影像
  poseNet = ml5.poseNet(video, modelLoaded);  // Initialize ml5.poseNet
  poseNet.on('pose', gotPoses); // An event listener that returns the results when a pose is detected.

  // 神經網路的參數
  let options = {                   // squat
    inputs: 34,
    outputs: num_output,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);

  // model的參數
  const modelInfo1 = {                    // squat
    model: 'model_squat/model.json',
    metadata: 'model_squat/model_meta.json',
    weights: 'model_squat/model.weights.bin',
  };
  const modelInfo2 = {                    // elbow_to_knee -> outputs = 14
    model: '1019model_elbow_to_knee/model.json',
    metadata: '1019model_elbow_to_knee/model_meta.json',
    weights: '1019model_elbow_to_knee/model.weights.bin',
  };
  const modelInfo3 = {                    // punch -> outputs = 14
    model: '1024model_punch/model.json',
    metadata: '1024model_punch/model_meta.json',
    weights: '1024model_punch/model.weights.bin',
  };

  if (action_flag == 1) {                   // squat
    brain.load(modelInfo1, brainLoaded);
  }
  else if (action_flag == 2) {              // elbow_to_knee
    brain.load(modelInfo2, brainLoaded);
  }
  else if (action_flag == 3) {              // punch
    brain.load(modelInfo3, brainLoaded);
  }

}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {

  // 有偵測到動作並且是在適當的距離
  if (pose && position_flag == 1) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x; // 偵測到的身體關節點X座標
      let y = pose.keypoints[i].position.y; // 偵測到的身體關節點Y座標
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult); // 辨識動作
  } else { // 沒有偵測到動作或不是在適當的距離
    setTimeout(classifyPose, 10); // 每0.01秒辨識一次動作
  }
}

// 辨識動作
function gotResult(error, results) {
  if (results[0].confidence > 0.99 && position_flag == 1) {
    poseLabel = results[0].label; // 是在適當距離且是指定動作的信心分數大於0.95
  }
  else {
    poseLabel = "None"; // 不是指定動作
  }
  classifyPose(); // 繼續辨識動作
}

function gotPoses(poses) {
  // 有偵測到動作
  if (poses.length > 0) {

    let leftShoulderX = poses[0].pose.keypoints[5].position.x; //左肩膀的X座標
    let leftShoulderY = poses[0].pose.keypoints[5].position.y; //左肩膀的Y座標
    let rightShoulderX = poses[0].pose.keypoints[6].position.x; //右肩膀的X座標
    let rightShoulderY = poses[0].pose.keypoints[6].position.y; //右肩膀的Y座標
    let leftHipX = poses[0].pose.keypoints[11].position.x; // 左臀部的X座標
    let leftHipY = poses[0].pose.keypoints[11].position.y; // 左臀部的Y座標
    let rightEyeX = poses[0].pose.keypoints[2].position.x; //右眼的X座標
    let rightEyeY = poses[0].pose.keypoints[2].position.y; //右眼的Y座標

    distanceShoulerToShoulder = dist(leftShoulderX, leftShoulderY, rightShoulderX, rightShoulderY); // 左肩到右肩的距離
    distanceShoulderToHip = dist(leftShoulderX, leftShoulderY, leftHipX, leftHipY); // 左肩到左臀部的距離
    distanceShoulerToEyes = dist(rightShoulderX, rightShoulderY, rightEyeX, rightEyeY); // 右肩到右眼的距離


    // Check if the player is in the correct position in the window
    if (distanceShoulerToShoulder < 70 && distanceShoulderToHip < 120 && distanceShoulerToEyes < 70) {
      position_flag = 1; // 在適當距離
    }
    else {
      position_flag = 0; // 沒有在適當距離
    }
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0); // 影像鏡向反轉
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  // if (pose && position_flag == 1) {
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
  pop();

  fill(251, 77, 61); // 圖案填滿顏色
  stroke(255, 255, 255); // 框線顏色
  strokeWeight(4); // 粗度
  textSize(26); // 文字大小
  textAlign(CENTER, CENTER); // 文字對齊位置
  // if (poseLabel != "None")
  // text(poseLabel, width / 2, height / 2); // 文字內容
  if (poseLabel == "Punch_right" || poseLabel == "Punch_left")
    text(poseLabel, width / 2, height / 2); // 文字內容 
}