'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Sohaib Zahid',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');






// Creates username property inside accounts object
const createUsername = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner.toLowerCase().split(' ').map(u => u[0]).join('');
  });
}
createUsername(accounts);


const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((m, i) => {
    const type = m > 0 ? 'deposit': 'withdrawal'
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${m}€</div>
    </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

const calcDisplaySummary = acc => {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov)
  labelSumIn.textContent = `${incomes}€`
  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov)
  labelSumOut.textContent = `${Math.abs(out)}€`
  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).reduce((acc, int) => acc + int)
  labelSumInterest.textContent = `${interest}€`;
} 

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

let currentAccount
// Event handler 
btnLogin.addEventListener('click', function(e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  // Exists and pin is igual currentAccount && currentAccount.pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100
    // Update UI
    updateUI(currentAccount);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''
  }else {
    console.log('Incorrect');
  }
})


btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  const amount = Number(inputTransferAmount.value)
  if (amount > 0 && amount <= currentAccount.balance && receiverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
  
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value)
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount)
    // Update UI
    updateUI(currentAccount)
  }
})

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    // Delete acocunt
    accounts.splice(index, 1)
    // Hide UI
    containerApp.style.opacity = 0;
    // Remove Welcome
    labelWelcome.textContent = 'Log in to get started'
  }
  inputCloseUsername.value = inputClosePin.value = ''
})

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted
})



///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are 
eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended 
portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% 
above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the 
recommended food portion and add it to the object as a new property. Do NOT create 
a new array, simply loop over the array. Forumla: recommendedFood = 
weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too 
little. HINT: Some dogs have multiple owners, so you first need to find Sarah in 
the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much 
('ownersEatTooMuch') and an array with all owners of dogs who eat too little 
('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda 
and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat 
too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food 
that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food 
(just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food 
(try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion 
in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary 
lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: 
current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the 
urrent portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

dogs.forEach(dog => dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
console.log(dogs);

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'))
console.log(dogSarah.curFood < dogSarah.recommendedFood ? 'low' : 'high');









// const basumkDepositSum = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((sum, cur) => sum + cur, 0)
// console.log(bankDepositSum);

// // const numDeposit1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length
// // console.log(numDeposit1000);

// const numDeposit1000 = accounts.flatMap(acc => acc.movements).reduce((count, cur) => cur >= 1000 ? count + 1 : count, 0)
// console.log(numDeposit1000);



// const accountMovements = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0)
// const accountMovements2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0)
// console.log(accountMovements, accountMovements2);
// // const allMovements = accountMovements.flat();
// // console.log(allMovements);
// // const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0)
// // console.log(overalBalance);

// // Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha']
// console.log(owners.sort());
// console.log(owners);
 
// account1.movements.sort((a, b) => a - b)
// console.log(account1.movements);


// const firstWithdrawal = account1.movements.find(mov => mov < 0)
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis')
// console.log(account);

/* 
Let's go back to Julia and Kate's study about dogs. This time, 
they want to convert dog ages to human ages and calculate the average 
age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays 
of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: 
if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 
years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the 
  same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already 
  know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function(ages) {
//   const humanAges = ages.map(age => {
//     return age <= 2 ? 2 * age : 16 + age * 4
//   })
//   console.log(humanAges);
//   const adults = humanAges.filter(age => {
//     return age > 18
//   })
//   console.log(adults);
//   const average = adults.reduce((acc, age) => {
//     return acc + age / adults.length
//   }, 0)
//   console.log(average);
// }

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])



/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, 
but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages => {
//   const average = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4).filter(age => age >= 18).reduce((acc, age, i, arr) => acc + age/arr.length, 0)
//   console.log(average);
// }
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]); 






// const eurToUsd = 1.1;
//   const movementsUSD = movements.map(mov => {
//     return mov * eurToUsd;
//   })
//   console.log(movementsUSD);
//   console.log(movements);



///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
 about their dog's age, and stored the data into an array (one array for each). 
 For now, they are just interested in knowing whether a dog is an adult or a puppy. 
 A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 
 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' 
and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have 
cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages 
from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 
is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/


// const checkDogs = function(dogsJulia, dogsKate) {
//   const copyJulia = dogsJulia.slice(1, -2);
//   const corrected = copyJulia.concat(dogsKate);
//   corrected.forEach((dog, i) => {
//     if (dog >= 3) {
//       console.log(`Dog number ${i} is an adult, and is ${dog}`);
//     }else{
//       console.log(`Dog number ${i} is a puppy, and is ${dog}`);
//     }
    
//   })

// }

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);


/*
///////////////////////////////////////
// The map Method
const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescriptions);


///////////////////////////////////////
// The filter Method
const deposits = movements.filter(function (mov, i, arr) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);


///////////////////////////////////////
// The reduce Method
console.log(movements);

// accumulator -> SNOWBALL
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// let arr = ['a', 'b', 'c', 'd', 'e'];
// //SLICE -> doesn't affects original array
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -2));

// // SPLICE -> affects original array
// // console.log(arr.splice(2));
// arr.splice(1, 2);
// console.log(arr);

// //REVERSE -> affects original array
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join(' - '));

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`You deposited ${i + 1}: ${movement}`);
//   }else {
//     console.log(`You withdrew ${i + 1}: ${Math.abs(movement)}`);
//   }
// }
// console.log('-------------------------');
// movements.forEach((movement, i) => {
//   if (movement > 0) {
//     console.log(`You deposited ${i + 1}: ${movement}`);
//   }else {
//     console.log(`You withdrew ${i + 1}: ${Math.abs(movement)}`);
//   }
// })

// currencies.forEach((value, key, map) => {
//   console.log(`${key} : ${value}`);
// })

// //set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR'])
// console.log(currenciesUnique);
// currenciesUnique.forEach((value, key, map) => {
//   console.log(`${key} : ${value}`);
// })