//HTML DOM
const capital = document.querySelector("#capital");
const target = document.querySelector("#target");
const leverage = document.querySelector("#leverage");
const fees = document.querySelector("#fees");
const targetOne = document.querySelector("#taget1");
const targetTwo = document.querySelector("#taget2");
const loss = document.querySelector("#loss");
const halfTp = document.querySelector("#halfTp");
const fullTp = document.querySelector("#fullTp");
const result = document.querySelector("#result");
const winsCounter = document.querySelector("#winscount");
const lossesCounter = document.querySelector("#lossescount");
const tradesCounter = document.querySelector("#totalTrades");
const winRate = document.querySelector("#WinRate");
const profitFactor = document.querySelector("#factor");

//Extract Values
let toNumbers = ({ capital, target, leverage, fees }) => {
  const capitalValue = parseFloat(capital.value || "0.000");
  const targetValue = parseFloat(target.value || "0.000");
  const leverageValue = parseFloat(leverage.value || "0.000");
  const feesValue = parseFloat(fees.value || "0.000");

  return { capitalValue, targetValue, leverageValue, feesValue };
};

//buttons Events
targetOne.addEventListener("click", tp1);
targetTwo.addEventListener("click", tp2);
loss.addEventListener("click", calcLoss);
halfTp.addEventListener("click", halfcalc);
fullTp.addEventListener("click", fullcalc);

//calc vars
let percent = 0;
let storageNumber = 0;
let winsUpdate = 0;
let lossUpdate = 0;
let winRateCalc = 0;
//chart vars
let xValues = [1];
let yValues = [0, 1];
let y = 0;

//Starting Capital taker
let startingCapital = [null];
capital.addEventListener(
  "keyup",
  (getStartValue = () => {
    if (startingCapital.length < 2) {
      setTimeout(function () {
        startingCapital.push(capital.value);
      }, 5000);
    }
  })
);

//Winrate & chart Calculator
let updateProgress = (type) => {
  if (type === "win") {
    winsUpdate++;
    y++;
    winsCounter.innerHTML = winsUpdate;
  } else if (type === "loss") {
    lossUpdate++;
    y--;
    lossesCounter.innerHTML = lossUpdate;
  }
  winRateCalc = (winsUpdate / (winsUpdate + lossUpdate)) * 100;
  winRate.innerHTML = winRateCalc.toFixed(2) + "%";
  tradesCounter.innerHTML = winsUpdate + lossUpdate;
  profitFactor.innerHTML =
    ((capital.value / startingCapital[1]) * 100).toFixed(2) + "%";
    
//chart logic
  xValues.push(tradesCounter.innerHTML);
  yValues.push(y);
  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          fill: false,
          lineTension: 1,
          backgroundColor: "#ffd700",
          borderColor: "#00ffaa",
          data: yValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { min: 0, max: 16 } }],
      },
    },
  });
};

//Trades Calculator
let updatePercent = (half,targetAndFees) => {
  const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
    capital,
    target,
    leverage,
    fees,
  });
  percent = (half / 100) * leverageValue * (targetAndFees);
  return percent;
};

//Events functions
function tp1() {
  const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
    capital,
    target,
    leverage,
    fees,
  });
  percent = updatePercent(capitalValue / 2,targetValue - feesValue);
  storageNumber = percent;
}

function tp2() {
  const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
    capital,
    target,
    leverage,
    fees,
  });
  percent = updatePercent(capitalValue / 2,targetValue - feesValue);
  result.innerHTML = (storageNumber + percent + capitalValue).toFixed(2);
  capital.value = result.innerHTML;
  updateProgress("win");
}

function calcLoss() {
  const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
    capital,
    target,
    leverage,
    fees,
  });
  percent = updatePercent(capitalValue,targetValue + feesValue);
  result.innerHTML = (capitalValue - percent).toFixed(2);
  capital.value = result.innerHTML;
  updateProgress("loss");
}

function halfcalc() {
  const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
    capital,
    target,
    leverage,
    fees,
  });
  percent = updatePercent(capitalValue / 2,targetValue - feesValue);
  result.innerHTML = (capitalValue + percent).toFixed(2);
  capital.value = result.innerHTML;
}

function fullcalc() {
  const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
    capital,
    target,
    leverage,
    fees,
  });
  percent = updatePercent(capitalValue,targetValue - feesValue);
  result.innerHTML = (capitalValue + percent).toFixed(2);
  capital.value = result.innerHTML;
  updateProgress("win");
}
