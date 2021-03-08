const {input} = require("./input")

let temp = input

input.push({
  date: "0",
  plan: "0",
  action: "0"
})

const Plan = {
  bronze : 10,
  silver : 20,
  gold : 30,
}

let OutputArray = new Array()

for (let i = 0; i < input.length; i += 2) {
  let evaluate = new Array()
  evaluate.push(input[i])
  for (let j = i + 2; j < input.length; j += 2) {
    if (input[i].date === input[j].date && input[i+1].date === input[j+1].date) {
      evaluate.push(input[j])
    }
    else {
      if (evaluate.length > 1) {
        let max = null
        switch (Math.max.apply(Math, evaluate.map(function(o) { return Plan[o.plan]; }))) {
          case 10:
            max = "bronze"
            break
          case 20:
            max = "silver"
            break
          case 30:
            max = "gold"
            break
        }
        let maximumStart = {
          date: evaluate[0].date,
          plan: max,
          action: "start"
        }
        let maximumStop = {
          date: evaluate[0].date,
          plan: max,
          action: "stop"
        }
        temp.splice(i, j - i)
        temp.splice(i, 0, maximumStart)
        temp.splice(i, 0, maximumStop)
        i = 0
        break
      }
      i = j - 2
      break
    }
  }
}

input.pop()

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

for (let i = 0; i < OutputArray.length; i++) {
  if (i + 1 < OutputArray.length) {
    if (OutputArray[i].startDate === OutputArray[i + 1].startDate && Plan[OutputArray[i].plan] <= Plan[OutputArray[i + 1].plan]) {
      OutputArray.splice(i, 1)
      i = 0
    }
    else if (OutputArray[i].endDate === OutputArray[i + 1].startDate && Plan[OutputArray[i].plan] <= Plan[OutputArray[i + 1].plan]) {
      let newDate = new Date(OutputArray[i + 1].startDate)
      let pushedDate = new Date(newDate.setDate(newDate.getDate() - 1))
      OutputArray[i].endDate = pushedDate.toLocaleString("en-us", {
        timeZone: "Asia/Calcutta"
      }).split(",")[0]
      OutputArray[i].amount = OutputArray[i].amount - Plan[OutputArray[i].plan]
      i = 0
    }
    else if (OutputArray[i].startDate === OutputArray[i + 1].startDate && Plan[OutputArray[i].plan] > Plan[OutputArray[i + 1].plan]) {
      let newDate = new Date(OutputArray[i + 1].startDate)
      let pushedDate = new Date(newDate.setDate(newDate.getDate() + 1))
      OutputArray[i + 1].startDate = pushedDate.toLocaleString("en-us", {
        timeZone: "Asia/Calcutta"
      }).split(",")[0]
      OutputArray[i + 1].amount = OutputArray[i + 1].amount - Plan[OutputArray[i + 1].plan]
      i = 0
    }
    else if (OutputArray[i].endDate === OutputArray[i + 1].startDate && Plan[OutputArray[i].plan] > Plan[OutputArray[i + 1].plan]) {
      let newDate = new Date(OutputArray[i + 1].startDate)
      let pushedDate = new Date(newDate.setDate(newDate.getDate() + 1))
      OutputArray[i + 1].startDate = pushedDate.toLocaleString("en-us", {
        timeZone: "Asia/Calcutta"
      }).split(",")[0]
      OutputArray[i + 1].amount = OutputArray[i + 1].amount - Plan[OutputArray[i + 1].plan]
      i = 0
    }
  }
}

console.log(OutputArray)