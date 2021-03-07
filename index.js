const {input} = require("./input")

const Plan = {
  bronze : 10,
  silver : 20,
  gold : 30,
}

let selectedPlan = "bronze"
console.log(Plan[selectedPlan])

let OutputArray = new Array()

function getExpensiveOne(inputOne, inputTwo) {
  let planOne = null
  let planTwo = null
  Object.keys(Plan).map(k => {
    if (inputOne.plan === k) {
      planOne = Plan[k]
    }
  })
  Object.keys(Plan).map(k => {
    if (inputTwo.plan === k) {
      planTwo = Plan[k]
    }
  })
  return [planOne, planTwo]
}

for (let i = 1; i < input.length; i += 2) {
  if (i + 1 < input.length) {
    if (input[i].date === input[i+1].date) {
      let arr = getExpensiveOne(input[i], input[i+1])
      if (arr[0] > arr[1] ) {
        let newDay = new Date(input[i + 1].date)
        input[i + 1].date = new Date(newDay.setDate(newDay.getDate() + 1)).toLocaleString("en-us", {
          timeZone: "Asia/Calcutta"
        }).split(",")[0]
      }
      else if (arr[0] < arr[1] || arr[0] === arr[1]) {
        let newDay = new Date(input[i].date)
        input[i].date = new Date(newDay.setDate(newDay.getDate() - 1)).toLocaleString("en-us", {
          timeZone: "Asia/Calcutta"
        }).split(",")[0]
      }
    }
  }  
}

for (let i = 0; i < input.length; i += 2) {
  let one = parseInt(input[i].date.split("/")[2])
  let two = parseInt(input[i + 1].date.split("/")[2])
  
  if (one < two) {
    let savePlan = input[i].plan
    let splitedOne = input[i].date.split("/")
    let splitedTwo = input[i+1].date.split("/")
    input.splice(i)
    input.splice(i+1)
    let k = i
    for (let j = one; j <= two; j++) {
      if (j === one) {
        input.splice(k, 0, {
          date: `${splitedOne[0]}/${splitedOne[1]}/${one}`,
          plan: savePlan,
          action: "start"
        })
        k++
        input.splice(k, 0, {
          date: `12/31/${one}`,
          plan: savePlan,
          action: "stop"
        })
        k++
      }
      else if (j === two) {
        input.splice(k, 0, {
          date: `1/1/${two}`,
          plan: savePlan,
          action: "start"
        })
        k++
        console.log(`${splitedTwo[0]}/${splitedTwo[1]}/${two}`)
        input.splice(k, 0, {
          date: `${splitedTwo[0]}/${splitedTwo[1]}/${two}`,
          plan: savePlan,
          action: "stop"
        })
        k++
      }
      else if (j !== two && j !== one) {
        input.splice(k, 0, {
          date: `1/1/${j}`,
          plan: savePlan,
          action: "start"
        })
        k++
        input.splice(k, 0, {
          date: `12/31/${j}`,
          plan: savePlan,
          action: "stop"
        })
        k++
      }
    }
  }
}

console.log(input)

function extractDay(date) {
  let day = parseInt(date.split("/")[1])
  return day
}

function extractMonth(date) {
  let month = parseInt(date.split("/")[0])
  return month
}

function getPlanCost(inputPlan) {
  let cost = null
  Object.keys(Plan).map(k => {
    if (k === inputPlan) {
      cost = Plan[k]
    }
  })
  return cost
}

function checkLeapYear(year) {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function acrossMultipleMonths(inputOne, inputTwo, start, stop, cost) {
  let lastDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let leapYearOne = parseInt(inputOne.date.split("/")[2])
  let leapYearTwo = parseInt(inputTwo.date.split("/")[2])
  if (checkLeapYear(leapYearOne) || checkLeapYear(leapYearTwo)) {
    lastDay[1] += 1
  }
  if (stop > start) {
    for (let i = start; i <= stop; i++) {
      if (i != stop) {
        let totalCost = null
        if (i === start) {
          totalCost = (lastDay[i - 1] - parseInt(inputOne.date.split("/")[1]) + 1) * cost
        }
        else {
          totalCost = (lastDay[i - 1]) * cost
        }
        let Output = {
          startDate: i === start ? inputOne.date : `${i}/1/${inputOne.date.split("/")[2]}`,
          endDate: `${i}/${lastDay[i - 1]}/${inputOne.date.split("/")[2]}`,
          plan : inputOne.plan,
          amount: totalCost
        }
        OutputArray.push(Output)
      }
      else if (i === stop) {
        let totalCost = (parseInt(inputTwo.date.split("/")[1])) * cost
        let Output = {
          startDate: `${i}/1/${inputOne.date.split("/")[2]}`,
          endDate: inputTwo.date,
          plan : inputOne.plan,
          amount: totalCost
        }
        OutputArray.push(Output)
      }
    }
  }
  
}

function monthlyBill() {
  for (let i = 0; i < input.length; i+=2) {
    let start = extractMonth(input[i].date)
    let stop = extractMonth(input[i + 1].date)
    let cost = getPlanCost(input[i].plan)
    if (stop === start) {
      let startDay = extractDay(input[i].date)
      let stopDay = extractDay(input[i + 1].date)
      if (stopDay > startDay || stopDay === startDay) {
        let Output = {
          startDate: input[i].date,
          endDate: input[i + 1].date,
          plan: input[i].plan,
          amount: (stopDay - startDay + 1) * cost
        }
        OutputArray.push(Output)
      }      
    }
    else if (stop != start) {
      acrossMultipleMonths(input[i], input[i + 1], start, stop, cost)
    }
  }
}

monthlyBill()
console.log(OutputArray)