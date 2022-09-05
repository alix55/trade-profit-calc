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

let toNumbers = ({ capital, target, leverage, fees }) => {
  const capitalValue = parseFloat(capital.value || "0.000");
  const targetValue = parseFloat(target.value || "0.000");
  const leverageValue = parseFloat(leverage.value || "0.000");
  const feesValue = parseFloat(fees.value || "0.000");

  return { capitalValue, targetValue, leverageValue, feesValue };
};

//calc variables
let percent = 0;
let storageNumber = 0;
//winrate & vars
let winsUpdate = 0;
let lossUpdate = 0;
let winRateCalc = 0;
//chart vars
let xValues = [1];
let yValues = [0, 1];
let y = 0;

//Starting Capital taker
let startingCapital = [null];

let getStartingCapital = (x) => {
  if (startingCapital.length < 2) {
    console.log(capital.value)
    console.log(typeof(capital.value))
    startingCapital.push(capital.value);
  }
};

//calculator function
let updatePercent = (half, targetAndFees) => {
  const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
    capital,
    target,
    leverage,
    fees,
  });
  percent = (half / 100) * leverageValue * targetAndFees;
  return percent;
};

// var sauvgard 
let isTarget2 = false

function changeHTML(isTarget2) {
   targetOne.innerHTML = isTarget2 ? "target 2" : "target 1"
}

//buttons Events
targetOne.addEventListener(
  "click",
  (tp1 = () => {
    const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
      capital,
      target,
      leverage,
      fees,
    });
    if( isTarget2 == false ) {
      percent = updatePercent(capitalValue / 2, targetValue - feesValue);
      storageNumber = percent;
      isTarget2 = true
      changeHTML(isTarget2);
    } else {
      x = getStartingCapital(capitalValue)
      percent = updatePercent(capitalValue / 2, targetValue - feesValue);
      result.innerHTML = (storageNumber + percent + capitalValue).toFixed(2);
      capital.value = result.innerHTML;
      updateProgress("win");
      isTarget2 = true
      changeHTML(isTarget2);
    }
  })
);

loss.addEventListener(
  "click",
  (calcLoss = () => {
    const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
      capital,
      target,
      leverage,
      fees,
    });
    x = getStartingCapital(capitalValue)
    percent = updatePercent(capitalValue, targetValue + feesValue);
    result.innerHTML = (capitalValue - percent).toFixed(2);
    capital.value = result.innerHTML;
    updateProgress("loss");
  })
);
halfTp.addEventListener(
  "click",
  (halfcalc = () => {
    const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
      capital,
      target,
      leverage,
      fees,
    });
    x = getStartingCapital(capitalValue)
    percent = updatePercent(capitalValue / 2, targetValue - feesValue);
    result.innerHTML = (capitalValue + percent).toFixed(2);
    capital.value = result.innerHTML;
    profitFactor.innerHTML =
      ((result.innerHTML / startingCapital[1]) * 100).toFixed(2) + "%";
  })
);
fullTp.addEventListener(
  "click",
  (fullcalc = () => {
    const { capitalValue, targetValue, leverageValue, feesValue } = toNumbers({
      capital,
      target,
      leverage,
      fees,
    });
    x = getStartingCapital(capitalValue)
    percent = updatePercent(capitalValue, targetValue - feesValue);
    result.innerHTML = (capitalValue + percent).toFixed(2);
    capital.value = result.innerHTML;
    updateProgress("win");
  })
);


//winrate & chart calculator
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
    ((result.innerHTML / startingCapital[1]) * 100).toFixed(2) + "%";

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
