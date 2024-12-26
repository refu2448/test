const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;
const crypto = require('crypto');
let users = []; // 임시로 사용자 정보를 저장할 배열
app.use(cors());

app.get('/account/:name', (req, res) => {
  const { name } = req.params;

  function generateHash(name)const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;
const crypto = require('crypto');
let users = []; // 임시로 사용자 정보를 저장할 배열
app.use(cors());

app.get('/account/:name', (req, res) => {
  const { name } = req.params;

  function generateHash(name) {
    return crypto
      .createHash('sha256') // SHA-256 알고리즘 사용
      .update(name) // 입력 문자열을 업데이트
      .digest('hex') // 16진수 문자열로 변환
      .slice(0, 10); // 처음 10자리만 사용
  }
  const hash = generateHash(name);
  const link = `http://127.0.0.1:3000/play/${hash}`;

  users.push({ name, hash, timer: null, checkCount: 0 });

  res.json({ link });
});

app.get('/play/:hash', (req, res) => {
  // 요청 경로에서 해시 값을 가져옵니다.
  const { hash } = req.params; // users 배열에서 입력된 해시와 일치하는 사용자를 찾습니다.
  const user = users.find((user) => user.hash === hash);

  if (user) {
    // 요청이 들어올 때마다 대조 횟수를 증가시킵니다.
    user.checkCount += 1;

    if (user.checkCount === 1) {
      // 첫 번째 요청: 타이머 시작
      user.timer = { start: Date.now(), duration: null }; // 타이머 시작 시간 기록
      res.send(`${user.name}'s timer started.`);
    } else if (user.checkCount === 2) {
      // 두 번째 요청: 타이머 정지 및 경과 시간 저장
      if (user.timer && user.timer.start) {
        const endTime = Date.now(); // 현재 시간
        const duration = (endTime - user.timer.start) / 1000; // 경과 시간 계산 (초 단위)
        user.timer.duration = duration; // 경과 시간 저장
        user.timer.start = null; // 타이머 시작 시간 초기화
        res.send(
          `${user.name}'s timer stopped. Duration: ${duration} seconds.`
        );
      } else {
        res.send(`${user.name}'s timer was not started.`);
      }
    } else {
      // 세 번째 요청 이후: 타이머를 다시 시작하지 않음
      if (user.timer && user.timer.duration !== null) {
        res.send(
          `${user.name}'s timer has already stopped. Total duration: ${user.timer.duration} seconds.`
        );
      } else {
        res.send(`${user.name}'s timer is not active.`);
      }
    }
  } else {
    res.send('Hash not found.');
  }
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

  users.push({ name, hash, timer: null, checkCount: 0 });

  res.json({ link });
});

app.get('/play/:hash', (req, res) => {
  // 요청 경로에서 해시 값을 가져옵니다.
  const { hash } = req.params; // users 배열에서 입력된 해시와 일치하는 사용자를 찾습니다.
  const user = users.find((user) => user.hash === hash);

  if (user) {
    // 요청이 들어올 때마다 대조 횟수를 증가시킵니다.
    user.checkCount += 1;

    if (user.checkCount === 1) {
      // 첫 번째 요청: 타이머 시작
      user.timer = { start: Date.now(), duration: null }; // 타이머 시작 시간 기록
      res.send(`${user.name}'s timer started.`);
    } else if (user.checkCount === 2) {
      // 두 번째 요청: 타이머 정지 및 경과 시간 저장
      if (user.timer && user.timer.start) {
        const endTime = Date.now(); // 현재 시간
        const duration = (endTime - user.timer.start) / 1000; // 경과 시간 계산 (초 단위)
        user.timer.duration = duration; // 경과 시간 저장
        user.timer.start = null; // 타이머 시작 시간 초기화
        res.send(
          `${user.name}'s timer stopped. Duration: ${duration} seconds.`
        );
      } else {
        res.send(`${user.name}'s timer was not started.`);
      }
    } else {
      if (user) {
        if (user.timer && user.timer.duration !== null) {
          // 타이머가 이미 종료된 경우
          res.send(
            `${user.name}'s timer has already stopped. Total duration: ${user.timer.duration} seconds.`
          );
        } else if (user.timer && user.timer.duration === null) {
          // 타이머가 진행 중인 경우
          res.send(`${user.name}'s timer is currently running.`);
        } else {
          // 타이머가 없는 경우
          res.send(`${user.name} has no active timer.`);
        }
      } else {
        // Hash가 없는 경우
        res.send('Hash not found.');
      }
    }
  } else {
    res.send('Hash not found.');
  }
});
