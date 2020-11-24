(function () {
  const startBtn = document.querySelector('#startBtn');
  const againBtn = document.querySelector('#againBtn');
  const startPage = document.querySelector('.startPage');
  const playingPage = document.querySelector('.playingPage');
  const againPage = document.querySelector('.againPage');
  const answer = document.querySelector('.answer');
  let newGame;
  startBtn.addEventListener('click', function () {
    //開始遊戲
    newGame = new game();
    //初始化畫面
    newGame.initGame();
    //startPage收回變成playingPage
    startPage.classList.add('close');
    playingPage.classList.remove('close')
    //監聽答案輸入
    answer.addEventListener('keydown', function (e) {
      newGame.inputEnter(e);
    });
  });
  againBtn.addEventListener('click', function () {
    //開始新的一個遊戲
    newGame = new game();
    //初始化畫面
    newGame.initGame();
    // newGame.initGame();
    //againPage收回變成playingPage
    againPage.classList.add('close');
    playingPage.classList.remove('close')
  });
})()




class game {
  constructor() {
    this.score = document.querySelector('.score p');
    this.scoreEnd = document.querySelector('.againPage h4');
    this.time = document.querySelector('.time');
    this.timeTotal = 0;
    this.num0 = document.querySelectorAll('.num')[0];
    this.num1 = document.querySelectorAll('.num')[1];
    this.point = 0;
    this.userAnswer = '';
    this.correctAnswer = '';
    this.mp3 = document.querySelector('.mp3');
    this.operator = document.querySelector('.operator');
    this.operators = ['/', '-', '*', '+'];
    //如果沒有用const vm = this綁定外層，就需要用箭頭fn綁定外層this。
    const timer = setInterval(() => {
      let str;
      //紀錄時間一到30S會就清除Interval
      if (this.timeTotal === 30) {
        clearInterval(timer);
        this.endGame();
        return false
      } else {
        this.timeTotal += 1;
        if (this.timeTotal < 10) {
          str = '00:0' + this.timeTotal;
        } else {
          str = '00:' + this.timeTotal;
        }
        this.time.textContent = str;
      }
    }, 1000)
  }
  //取得隨機運算子
  randomOperator() {
    const random = Math.floor(Math.random() * this.operators.length);
    const temOperators = this.operators[random];
    return temOperators;
  }
  //隨機數字
  randomNum() {
    switch (true) {
      //0~10 個位數隨機
      case this.timeTotal >= 0 && this.timeTotal <= 10:
        return Math.floor((Math.random() * 8) + 1);
      //11~99 雙位數隨機
      case this.timeTotal >= 11 && this.timeTotal <= 20:
        return Math.floor((Math.random() * 89) + 10);
      //100~999 三位數隨機
      case this.timeTotal >= 21 && this.timeTotal <= 30:
        return Math.floor((Math.random() * 899) + 100);
    }
  }
  //運算
  calculation() {
    //更改運算元 避免錯誤
    if (this.operator.textContent === 'x') {
      this.operator.textContent = '*';
    } else if (this.operator.textContent === '÷') {
      this.operator.textContent = '/';
    }
    // 把數字跟運算子加起來 運算  0 + 0
    const count =
      this.num0.textContent + this.operator.textContent + this.num1.textContent;
    this.correctAnswer = this.eval(count) + '';
  }
  //內容輸入確認
  inputEnter(e) {
    if (e.key === 'Enter') {
      this.userAnswer = e.target.value;
      //清除目標的值
      e.target.value = '';
      //一開始遊戲就會先出題 所以要運算檢查後 再重新出題
      this.calculation();
      this.checkAnswer();
      this.quiz();
    }
  }
  //檢查答案對錯 +-分
  checkAnswer() {
    switch (true) {
      case this.userAnswer === this.correctAnswer && this.timeTotal <= 10:
        this.point += 10;
        break
      case this.userAnswer === this.correctAnswer && this.timeTotal <= 20:
        this.point += 20;
        break
      case this.userAnswer === this.correctAnswer && this.timeTotal <= 30:
        this.point += 30;
        break
      case this.userAnswer !== this.correctAnswer:
        //0分則不扣分
        if (this.point >= 5) {
          this.point -= 5
        }
        break
    }
    this.totalPoint();
  }
  //代替eval
  eval(obj) {
    return Function(`return (${obj})`)();
  }
  //判斷是否為質數
  isPrime(num) {
    if (num <= 2) {
      return num > 1
    } else {
      for (let i = 2; i <= Math.sqrt(num); i++) {
        //i 會隨著Math.sqrt增加如果都不能整除 則回傳true
        if (num % i === 0) {
          return false
        }
      }
      return true
    }
  }
  //取得第二個數字的因數
  getFactor(num0, num1) {
    while (num0 % num1 !== 0) {
      num1 = Math.floor((Math.random() * 98) + 1);
    }
    return num1;
  };
  //畫面
  //初始化畫面
  initGame() {
    //時間初始
    this.time.textContent = '00:00';
    this.score.textContent = '000';
    //重新載入音樂
    this.mp3.load();
    //播放
    this.mp3.play();
    //出題
    this.quiz();
  }
  //結束遊戲後切換頁面
  endGame() {
    //暫停
    this.mp3.pause();
    //切換頁面
    document.querySelector('.playingPage').classList.add('close');
    document.querySelector('.againPage').classList.remove('close');
  }
  //出題
  quiz() {
    //取得隨機的operator
    this.operator.textContent = this.randomOperator();
    //取得隨機的num
    let temNum0 = Math.floor((Math.random() * 98) + 1);
    let temNum1 = this.randomNum();

    while (this.isPrime(temNum0)) {
      temNum0 = Math.floor((Math.random() * 98) + 1)
      this.num0.textContent = temNum0;
    }
    while (this.isPrime(temNum1)) {
      temNum1 = this.randomNum();
      this.num0.textContent = temNum1;
    }
    switch (this.operator.textContent) {
      case '*':
        this.operator.textContent = 'x';
        break;
      case '-':
        //如果比較小就交換 避免負數
        if (temNum0 < temNum1) {
          temNum1 = temNum0;
        }
        break
      case '/':
        //如果比較小就交換 ÷法會錯誤
        if (temNum0 < temNum1) {
          let temp = temNum0;
          temNum0 = temNum1;
          temNum1 = temp;
        }
        this.operator.textContent = '÷';
        temNum1 = this.getFactor(temNum0, temNum1);
        break;
    }
    this.num0.textContent = temNum0;
    this.num1.textContent = temNum1;
  }
  //總分
  totalPoint() {
    let str = '';
    if (this.point < 10) {
      str = '00' + this.point;
    } else if (this.point < 100) {
      str = '0' + this.point;
    } else {
      str = '' + this.point;
    }
    this.score.textContent = str;
    this.scoreEnd.textContent = str;
  }
}

//prototype寫法

// (function () {
//   const startBtn = document.querySelector('#startBtn');
//   const againBtn = document.querySelector('#againBtn');
//   const startPage = document.querySelector('.startPage');
//   const playingPage = document.querySelector('.playingPage');
//   const againPage = document.querySelector('.againPage');
//   const answer = document.querySelector('.answer');
//   let newGame;
//   startBtn.addEventListener('click', function () {
//     //開始遊戲
//     newGame = new game();
//     //初始化畫面
//     newGame.initGame();
//     //startPage收回變成playingPage
//     startPage.classList.add('close');
//     playingPage.classList.remove('close')
//     //監聽答案輸入
//     answer.addEventListener('keydown', function (e) {
//       newGame.inputEnter(e);
//     });
//   });
//   againBtn.addEventListener('click', function () {
//     //開始新的一個遊戲
//     newGame = new game();
//     //初始化畫面
//     newGame.initGame();
//     // newGame.initGame();
//     //againPage收回變成playingPage
//     againPage.classList.add('close');
//     playingPage.classList.remove('close')
//   });
// })()
// function game() {
//   this.score = document.querySelector('.score p');
//   this.scoreEnd = document.querySelector('.againPage h4');
//   this.time = document.querySelector('.time');
//   this.timeTotal = 0;
//   this.num0 = document.querySelectorAll('.num')[0];
//   this.num1 = document.querySelectorAll('.num')[1];
//   this.point = 0;
//   this.userAnswer = '';
//   this.correctAnswer = '';
//   this.mp3 = document.querySelector('.mp3');
//   this.operator = document.querySelector('.operator');
//   this.operators = ['/', '-', '*', '+'];
//   const timer = setInterval(() => {
//     let str;
//     //紀錄時間一到30S會就清除Interval
//     if (this.timeTotal === 30) {
//       clearInterval(timer);
//       this.endGame();
//       return false
//     } else {
//       this.timeTotal += 1;
//       if (this.timeTotal < 10) {
//         str = '00:0' + this.timeTotal;
//       } else {
//         str = '00:' + this.timeTotal;
//       }
//       this.time.textContent = str;
//     }
//   }, 1000)
// }
// //箭頭fn 因為沒有自己的this 所以讀取不到 
// //取得隨機運算子
// game.prototype.randomOperator = function () {
//   const random = Math.floor(Math.random() * this.operators.length);
//   const temOperators = this.operators[random];
//   return temOperators;
// }
// //隨機數字
// game.prototype.randomNum = function () {
//   switch (true) {
//     //0~10 個位數隨機
//     case this.timeTotal >= 0 && this.timeTotal <= 10:
//       return Math.floor((Math.random() * 8) + 1);
//     //11~99 雙位數隨機
//     case this.timeTotal >= 11 && this.timeTotal <= 20:
//       return Math.floor((Math.random() * 89) + 10);
//     //100~999 三位數隨機
//     case this.timeTotal >= 21 && this.timeTotal <= 30:
//       return Math.floor((Math.random() * 899) + 100);
//   }
// }
// //運算
// game.prototype.calculation = function () {
//   //更改運算元 避免錯誤
//   if (this.operator.textContent === 'x') {
//     this.operator.textContent = '*';
//   } else if (this.operator.textContent === '÷') {
//     this.operator.textContent = '/';
//   }
//   // 把數字跟運算子加起來 運算  0 + 0
//   const count =
//     this.num0.textContent + this.operator.textContent + this.num1.textContent;
//   this.correctAnswer = this.eval(count) + '';
// }
// //內容輸入確認
// game.prototype.inputEnter = function (e) {
//   if (e.key === 'Enter') {
//     this.userAnswer = e.target.value;
//     //清除目標的值
//     e.target.value = '';
//     //一開始遊戲就會先出題 所以要運算檢查後 再重新出題
//     this.calculation();
//     this.checkAnswer();
//     this.quiz();
//   }
// }
// //檢查答案對錯 +-分
// game.prototype.checkAnswer = function () {
//   switch (true) {
//     case this.userAnswer === this.correctAnswer && this.timeTotal <= 10:
//       this.point += 10;
//       break
//     case this.userAnswer === this.correctAnswer && this.timeTotal <= 20:
//       this.point += 20;
//       break
//     case this.userAnswer === this.correctAnswer && this.timeTotal <= 30:
//       this.point += 30;
//       break
//     case this.userAnswer !== this.correctAnswer:
//       //0分則不扣分
//       if (this.point >= 5) {
//         this.point -= 5
//       }
//       break
//   }
//   this.totalPoint();
// }
// //代替eval
// game.prototype.eval = function (obj) {
//   return Function(`return (${obj})`)();
// }
// //判斷是否為質數
// game.prototype.isPrime = function (num) {
//   if (num <= 2) {
//     return num > 1
//   } else {
//     for (let i = 2; i <= Math.sqrt(num); i++) {
//       //i 會隨著Math.sqrt增加如果都不能整除 則回傳true
//       if (num % i === 0) {
//         return false
//       }
//     }
//     return true
//   }
// }
// //取得第二個數字的因數
// game.prototype.getFactor = function (num0, num1) {
//   while (num0 % num1 !== 0) {
//     num1 = Math.floor((Math.random() * 98) + 1);
//   }
//   return num1;
// };
// //畫面
// //初始化畫面
// game.prototype.initGame = function () {
//   //時間初始
//   this.time.textContent = '00:00';
//   this.score.textContent = '000';
//   //重新載入音樂
//   this.mp3.load();
//   //播放
//   this.mp3.play();
//   //出題
//   this.quiz();
// }
// //結束遊戲後切換頁面
// game.prototype.endGame = function () {
//   //暫停
//   this.mp3.pause();
//   //切換頁面
//   document.querySelector('.playingPage').classList.add('close');
//   document.querySelector('.againPage').classList.remove('close');
// }
// //出題
// game.prototype.quiz = function () {
//   //取得隨機的operator
//   this.operator.textContent = this.randomOperator();
//   //取得隨機的num
//   let temNum0 = Math.floor((Math.random() * 98) + 1);
//   let temNum1 = this.randomNum();

//   while (this.isPrime(temNum0)) {
//     temNum0 = Math.floor((Math.random() * 98) + 1)
//     this.num0.textContent = temNum0;
//   }
//   while (this.isPrime(temNum1)) {
//     temNum1 = this.randomNum();
//     this.num0.textContent = temNum1;
//   }
//   switch (this.operator.textContent) {
//     case '*':
//       this.operator.textContent = 'x';
//       break;
//     case '-':
//       //如果比較小就交換 避免負數
//       if (temNum0 < temNum1) {
//         temNum1 = temNum0;
//       }
//       break
//     case '/':
//       //如果比較小就交換 ÷法會錯誤
//       if (temNum0 < temNum1) {
//         let temp = temNum0;
//         temNum0 = temNum1;
//         temNum1 = temp;
//       }
//       this.operator.textContent = '÷';
//       temNum1 = this.getFactor(temNum0, temNum1);
//       break;
//   }
//   this.num0.textContent = temNum0;
//   this.num1.textContent = temNum1;
// }
// //總分
// game.prototype.totalPoint = function () {
//   let str = '';
//   if (this.point < 10) {
//     str = '00' + this.point;
//   } else if (this.point < 100) {
//     str = '0' + this.point;
//   } else {
//     str = '' + this.point;
//   }
//   this.score.textContent = str;
//   this.scoreEnd.textContent = str;
// }
