// function isPrime(n) {
//   if (isNaN(n) || n < 1 || Math.floor(n) !== n) return false;
//
//   for (let i = n - 1; i > 1; i--) {
//     if (!(n % i)) {
//       return false;
//     }
//   }
//   return true;
// }
//
// console.log(isPrime(14));

// function factorial(n) {
//   if (n <= 1) return n;
//   return n * factorial(n - 1);
// }
//
// console.log(factorial(3));


// function fib(n) {
//   if (n <= 1) return n;
//   return n + fib(n - 1);
// }
//
// console.log(fib(10));

// function isSorted(arr) {
//   return arr.every(function(el, i) {
//     if (i === arr.length - 1) return true;
//     return el <= arr[i + 1];
//   })
// }
//
// console.log(isSorted([-Infinity, -5, 0, 3, 9]));

// for (var i = 0; i < 1000000; i++) {
//   setTimeout(() => {
//     console.log(i);
//   }, 0);
// }

// function f1() {
//   return this;
// }

// var f1 = () => {
//   return this;
// }
// console.log(f1());

// (() => {
//   console.log(this);
// })();

// const o1 = {
//   v1: 1,
//   f1: function() {
//     console.log(this);
//   }
// }
// const o2 = {
//   v2: 1,
//   f2: () => {
//     console.log(this);
//   }
// }
//
// console.log(o1.f1());
//
// console.log(o2.f2())

// function Person() {
//   this.age = 0;
// }

// console.log(f1());

// var p = new Person();

// const add = (n) => (n + 10);
//
// console.log(add(9));


// const memoizedAdd = () => {
//   let cache = {};
//   return (n) => {
//     console.log(cache);
//     let result = n + 10;
//     cache[n] = result;
//     return result;
//   }
// }
// const newAdd = memoizedAdd();
// console.log(newAdd(11));
// console.log(newAdd(11));
// console.log(newAdd(11));

// let dog = {
//   name: 'doggo',
//   sayName: function() {
//     console.log(this.name);
//   }
// }
// let sayName = dog.sayName
// sayName()
