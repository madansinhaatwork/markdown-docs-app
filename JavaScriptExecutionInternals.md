# JavaScript Execution Internals: Predicting Runtime Output Without Guesswork

**Audience:** Mid-to-senior JavaScript / React developers  
**Goal:** Build a precise mental model for tracing advanced JavaScript snippets step by step.  
**Focus:** Execution context, memory allocation, scope resolution, closures, `this`, call stack, event loop, promises, and `async/await`.

---

## Table of Contents

1. [Why Global Execution Context Alone Is Not Enough](#1-why-global-execution-context-alone-is-not-enough)
2. [JavaScript Execution Model at a High Level](#2-javascript-execution-model-at-a-high-level)
3. [Global Execution Context](#3-global-execution-context)
4. [Creation Phase and Execution Phase](#4-creation-phase-and-execution-phase)
5. [Memory Allocation and Hoisting](#5-memory-allocation-and-hoisting)
6. [`var`, `let`, `const`, and Temporal Dead Zone](#6-var-let-const-and-temporal-dead-zone)
7. [Function Execution Context](#7-function-execution-context)
8. [Lexical Environment and Scope Chain](#8-lexical-environment-and-scope-chain)
9. [Closures](#9-closures)
10. [`this` Binding](#10-this-binding)
11. [Call Stack](#11-call-stack)
12. [Event Loop](#12-event-loop)
13. [Microtask Queue and Macrotask Queue](#13-microtask-queue-and-macrotask-queue)
14. [Promises](#14-promises)
15. [`async` / `await`](#15-async--await)
16. [Step-by-Step Snippet Analysis Framework](#16-step-by-step-snippet-analysis-framework)
17. [Advanced Practice Snippets with Explanations](#17-advanced-practice-snippets-with-explanations)
18. [Common Interview Traps](#18-common-interview-traps)
19. [Final Mental Model](#19-final-mental-model)

---

## 1. Why Global Execution Context Alone Is Not Enough

A surface-level understanding of the **Global Execution Context (GEC)** helps with simple JavaScript output questions, especially those involving global variables and basic hoisting.

However, production-grade JavaScript and advanced interview snippets often involve multiple interacting systems:

- Global Execution Context
- Function Execution Context
- Lexical Environment
- Scope Chain
- Closures
- `this` binding
- Call Stack
- Event Loop
- Microtasks
- Macrotasks
- Promises
- `async` / `await`

Knowing only the Global Execution Context may help explain this:

```js
console.log(a);
var a = 10;
```

Output:

```js
undefined
```

But it is not enough to fully explain this:

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'));

async function test() {
  console.log('E');
  await Promise.resolve();
  console.log('F');
}

test();

console.log('G');
```

To predict the output accurately, you must understand synchronous execution, promise microtasks, `await` scheduling, timer macrotasks, and call stack behavior.

---

## 2. JavaScript Execution Model at a High Level

JavaScript execution can be understood as a coordinated lifecycle:

```text
Source Code
   ↓
Parsing
   ↓
Global Execution Context Creation
   ↓
Memory Allocation / Hoisting
   ↓
Synchronous Execution
   ↓
Function Execution Contexts
   ↓
Call Stack Management
   ↓
Async API Registration
   ↓
Microtask / Macrotask Scheduling
   ↓
Event Loop Processing
   ↓
Final Output
```

At runtime, JavaScript does not simply read code line by line in the way beginners imagine. It first prepares the environment, allocates memory, sets up scopes, registers declarations, and then executes code.

---

## 3. Global Execution Context

The **Global Execution Context** is the first execution context created when JavaScript code starts running.

It contains:

- A global memory space
- Global variables and functions
- A reference to the global object
- A value for `this`
- Outer environment reference as `null`

In browsers:

```js
console.log(this === window); // true in non-module browser scripts
```

In Node.js or ES modules, global `this` behaves differently.

### Example

```js
var name = 'Madan';

function greet() {
  console.log('Hello', name);
}

greet();
```

### Global Creation Phase

```text
Global Memory:
name  → undefined
greet → function object
```

### Global Execution Phase

```text
name = 'Madan'
greet() is invoked
```

Output:

```js
Hello Madan
```

---

## 4. Creation Phase and Execution Phase

Every execution context has two major phases:

### 1. Creation Phase

During this phase, JavaScript prepares memory before executing code.

It handles:

- Variable declarations
- Function declarations
- Scope setup
- `this` binding
- Lexical environment creation

### 2. Execution Phase

During this phase, JavaScript runs code line by line.

It handles:

- Assignments
- Function calls
- Expression evaluation
- Async task registration
- Return values

### Example

```js
console.log(x);
var x = 5;
console.log(x);
```

### Creation Phase

```text
x → undefined
```

### Execution Phase

```text
console.log(x) → undefined
x = 5
console.log(x) → 5
```

Output:

```js
undefined
5
```

---

## 5. Memory Allocation and Hoisting

**Hoisting** is the behavior where declarations are processed before code execution.

However, different declarations are handled differently.

### Function Declaration

```js
sayHello();

function sayHello() {
  console.log('Hello');
}
```

Output:

```js
Hello
```

Why?

During creation phase, the entire function declaration is stored in memory.

```text
sayHello → function object
```

### Function Expression with `var`

```js
sayHello();

var sayHello = function () {
  console.log('Hello');
};
```

Output:

```js
TypeError: sayHello is not a function
```

Why?

During creation phase:

```text
sayHello → undefined
```

During execution, JavaScript tries to call `undefined` as a function.

### Function Expression with `const`

```js
sayHello();

const sayHello = function () {
  console.log('Hello');
};
```

Output:

```js
ReferenceError: Cannot access 'sayHello' before initialization
```

Why?

`const` exists in the Temporal Dead Zone until the declaration line is executed.

---

## 6. `var`, `let`, `const`, and Temporal Dead Zone

### `var`

- Function-scoped
- Hoisted
- Initialized with `undefined`
- Can be redeclared

```js
console.log(a);
var a = 10;
```

Output:

```js
undefined
```

### `let`

- Block-scoped
- Hoisted but not initialized
- Exists in Temporal Dead Zone before declaration
- Cannot be redeclared in the same scope

```js
console.log(a);
let a = 10;
```

Output:

```js
ReferenceError
```

### `const`

- Block-scoped
- Hoisted but not initialized
- Must be initialized during declaration
- Binding cannot be reassigned

```js
const user = { name: 'Madan' };
user.name = 'Rahul';
console.log(user.name);
```

Output:

```js
Rahul
```

Important: `const` prevents reassignment of the binding, not mutation of the referenced object.

### Temporal Dead Zone

The **Temporal Dead Zone (TDZ)** is the time between entering a scope and the actual declaration line where `let` and `const` variables cannot be accessed.

```js
{
  console.log(count);
  let count = 1;
}
```

Output:

```js
ReferenceError
```

---

## 7. Function Execution Context

A new **Function Execution Context** is created every time a function is invoked.

It contains:

- Local memory
- Parameters
- Arguments object for non-arrow functions
- Local variables
- Inner function declarations
- Lexical environment
- `this` binding
- Outer environment reference

### Example

```js
var x = 10;

function outer() {
  var y = 20;
  console.log(x + y);
}

outer();
```

### Step-by-Step

1. Global Execution Context is created.
2. `x` is allocated as `undefined`.
3. `outer` is stored as a function.
4. Execution starts.
5. `x = 10`.
6. `outer()` is invoked.
7. New Function Execution Context is created for `outer`.
8. `y` is allocated as `undefined`.
9. `y = 20`.
10. `console.log(x + y)` runs.
11. JavaScript finds `y` locally and `x` in global scope.
12. Output is `30`.
13. Function Execution Context is removed from the call stack.

Output:

```js
30
```

---

## 8. Lexical Environment and Scope Chain

A **Lexical Environment** is a structure that stores variable/function bindings and a reference to its outer environment.

The **Scope Chain** is formed by following these outer references.

### Example

```js
const globalValue = 'global';

function outer() {
  const outerValue = 'outer';

  function inner() {
    const innerValue = 'inner';
    console.log(innerValue, outerValue, globalValue);
  }

  inner();
}

outer();
```

### Variable Resolution

When `inner()` runs:

```text
Search inner scope:
innerValue found

Search outer scope:
outerValue found

Search global scope:
globalValue found
```

Output:

```js
inner outer global
```

JavaScript uses **lexical scope**, meaning scope is determined by where code is written, not where a function is called.

---

## 9. Closures

A **closure** is created when a function remembers variables from its lexical scope even after the outer function has finished execution.

### Example

```js
function createCounter() {
  let count = 0;

  return function increment() {
    count++;
    console.log(count);
  };
}

const counter = createCounter();

counter();
counter();
counter();
```

### Step-by-Step

1. `createCounter()` is invoked.
2. A Function Execution Context is created.
3. `count` is initialized to `0`.
4. `increment` function is returned.
5. `createCounter` execution context is removed from the call stack.
6. But `increment` keeps a reference to `count` through closure.
7. First `counter()` increments `count` to `1`.
8. Second `counter()` increments `count` to `2`.
9. Third `counter()` increments `count` to `3`.

Output:

```js
1
2
3
```

### Common Closure Trap

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

Output:

```js
4
4
4
```

Why?

`var` is function-scoped, so all callbacks share the same `i`. By the time the callbacks run, the loop has completed and `i` is `4`.

Fix with `let`:

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

Output:

```js
1
2
3
```

Why?

`let` creates a new block-scoped binding for each iteration.

---

## 10. `this` Binding

The value of `this` is determined by **how a function is called**, not simply where it is defined.

### 1. Global Context

```js
console.log(this);
```

In a browser non-module script, this refers to `window`.

### 2. Object Method Call

```js
const user = {
  name: 'Madan',
  greet() {
    console.log(this.name);
  },
};

user.greet();
```

Output:

```js
Madan
```

Why?

The function is called as a method of `user`, so `this` refers to `user`.

### 3. Detached Method

```js
const user = {
  name: 'Madan',
  greet() {
    console.log(this.name);
  },
};

const greetFn = user.greet;
greetFn();
```

Output:

```js
undefined
```

In strict mode, `this` is `undefined`. In non-strict browser scripts, `this` may refer to `window`.

### 4. Arrow Function

Arrow functions do not have their own `this`. They capture `this` from the surrounding lexical scope.

```js
const user = {
  name: 'Madan',
  greet: () => {
    console.log(this.name);
  },
};

user.greet();
```

Output is usually:

```js
undefined
```

Why?

The arrow function does not bind `this` to `user`. It uses `this` from the outer scope.

### 5. Explicit Binding

```js
function greet() {
  console.log(this.name);
}

const user = { name: 'Madan' };

greet.call(user);
```

Output:

```js
Madan
```

`call`, `apply`, and `bind` allow explicit control of `this`.

---

## 11. Call Stack

The **call stack** tracks active execution contexts.

When a function is called, its execution context is pushed onto the stack. When the function completes, it is popped off.

### Example

```js
function first() {
  second();
  console.log('first');
}

function second() {
  third();
  console.log('second');
}

function third() {
  console.log('third');
}

first();
```

### Stack Flow

```text
Push Global Execution Context
Push first()
Push second()
Push third()
Run third → pop third()
Run second log → pop second()
Run first log → pop first()
```

Output:

```js
third
second
first
```

---

## 12. Event Loop

JavaScript has a single call stack, but it can handle asynchronous operations using the runtime environment and event loop.

The event loop coordinates between:

- Call stack
- Web APIs or host APIs
- Microtask queue
- Macrotask queue

### Basic Example

```js
console.log('A');

setTimeout(() => {
  console.log('B');
}, 0);

console.log('C');
```

Output:

```js
A
C
B
```

### Step-by-Step

1. `console.log('A')` runs immediately.
2. `setTimeout` callback is registered with the host environment.
3. `console.log('C')` runs immediately.
4. Global code completes.
5. Call stack becomes empty.
6. Timer callback moves to macrotask queue.
7. Event loop pushes callback onto call stack.
8. `console.log('B')` runs.

---

## 13. Microtask Queue and Macrotask Queue

JavaScript runtimes prioritize queues differently.

### Microtasks

Examples:

- Promise `.then()` callbacks
- Promise `.catch()` callbacks
- Promise `.finally()` callbacks
- `queueMicrotask`
- Continuation after `await`

### Macrotasks

Examples:

- `setTimeout`
- `setInterval`
- UI events
- Network callbacks depending on environment

### Priority Rule

After synchronous code finishes:

```text
1. Drain all microtasks
2. Run one macrotask
3. Drain microtasks again
4. Repeat
```

### Example

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');
```

Output:

```js
A
D
C
B
```

Why?

Synchronous code runs first. Promise callback goes to microtask queue. Timer callback goes to macrotask queue. Microtasks run before macrotasks.

---

## 14. Promises

A Promise represents a future value.

It can be in one of three states:

- Pending
- Fulfilled
- Rejected

Promise callbacks are scheduled as microtasks.

### Example

```js
console.log('Start');

const promise = new Promise((resolve) => {
  console.log('Inside Promise');
  resolve('Resolved');
});

promise.then((value) => {
  console.log(value);
});

console.log('End');
```

Output:

```js
Start
Inside Promise
End
Resolved
```

### Step-by-Step

1. `Start` logs synchronously.
2. Promise executor runs synchronously.
3. `Inside Promise` logs synchronously.
4. `resolve('Resolved')` settles the promise.
5. `.then()` callback is scheduled as a microtask.
6. `End` logs synchronously.
7. Call stack becomes empty.
8. Microtask queue runs.
9. `Resolved` logs.

Important: The Promise executor runs immediately. The `.then()` callback runs later as a microtask.

---

## 15. `async` / `await`

An `async` function always returns a Promise.

`await` pauses the async function and schedules the continuation as a microtask.

### Example

```js
async function test() {
  console.log('A');
  await Promise.resolve();
  console.log('B');
}

console.log('C');
test();
console.log('D');
```

Output:

```js
C
A
D
B
```

### Step-by-Step

1. `test` function is defined.
2. `console.log('C')` runs.
3. `test()` is called.
4. Inside `test`, `console.log('A')` runs synchronously.
5. `await Promise.resolve()` pauses the function.
6. Continuation after `await` is scheduled as a microtask.
7. Control returns to global execution.
8. `console.log('D')` runs.
9. Global call stack becomes empty.
10. Microtask resumes `test`.
11. `console.log('B')` runs.

---

## 16. Step-by-Step Snippet Analysis Framework

Use this framework for every JavaScript output question.

### Step 1: Identify Declarations

Look for:

```js
var
let
const
function
class
```

Ask:

- Is it hoisted?
- Is it initialized?
- Is it in TDZ?

### Step 2: Separate Creation Phase and Execution Phase

For each scope, determine:

- What exists in memory before execution?
- What value does each binding initially hold?

### Step 3: Track Function Calls

Ask:

- Which function is invoked?
- Does it create a new Function Execution Context?
- What parameters and local variables exist?

### Step 4: Resolve Variables Using Scope Chain

For every variable:

```text
Current scope → Outer scope → Global scope
```

### Step 5: Identify Closures

Ask:

- Does an inner function use outer variables?
- Does the inner function survive after the outer function returns?

### Step 6: Determine `this`

Ask:

- Is it called as an object method?
- Is it detached?
- Is it an arrow function?
- Is `call`, `apply`, or `bind` used?
- Is it used inside a class or constructor?

### Step 7: Track the Call Stack

Ask:

- Which execution context is currently active?
- Which function returns first?

### Step 8: Track Async Scheduling

Ask:

- Is it synchronous?
- Is it a promise microtask?
- Is it a timer macrotask?
- Is there an `await` continuation?

### Step 9: Produce Final Output

Write output only after tracing:

1. Synchronous execution
2. Microtasks
3. Macrotasks

---

## 17. Advanced Practice Snippets with Explanations

### Snippet 1: Hoisting and Function Scope

```js
var a = 10;

function test() {
  console.log(a);
  var a = 20;
  console.log(a);
}

test();
console.log(a);
```

### Output

```js
undefined
20
10
```

### Explanation

Global creation:

```text
a → undefined
test → function
```

Global execution:

```text
a = 10
test() invoked
```

Function creation for `test`:

```text
a → undefined
```

Function execution:

```text
console.log(a) → undefined
 a = 20
console.log(a) → 20
```

After `test` completes:

```text
console.log(global a) → 10
```

---

### Snippet 2: TDZ and Block Scope

```js
let x = 1;

{
  console.log(x);
  let x = 2;
}
```

### Output

```js
ReferenceError
```

### Explanation

The block has its own `x` declared with `let`. From the start of the block until `let x = 2`, that block-scoped `x` is in the Temporal Dead Zone.

JavaScript does not fall back to the outer `x` because the inner `x` exists in the block scope but is not initialized yet.

---

### Snippet 3: Closure with Shared State

```js
function outer() {
  let count = 0;

  return function inner() {
    count++;
    return count;
  };
}

const fn1 = outer();
const fn2 = outer();

console.log(fn1());
console.log(fn1());
console.log(fn2());
```

### Output

```js
1
2
1
```

### Explanation

Each call to `outer()` creates a new lexical environment.

```text
fn1 closes over count from first outer() call
fn2 closes over count from second outer() call
```

So `fn1` and `fn2` maintain independent `count` variables.

---

### Snippet 4: `this` and Arrow Functions

```js
const user = {
  name: 'Madan',
  normal() {
    console.log(this.name);
  },
  arrow: () => {
    console.log(this.name);
  },
};

user.normal();
user.arrow();
```

### Output

```js
Madan
undefined
```

### Explanation

`normal()` is called as a method of `user`, so `this` is `user`.

`arrow` does not have its own `this`. It captures `this` from the surrounding scope, not from the object.

---

### Snippet 5: Promise vs Timer

```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');
```

### Output

```js
1
4
3
2
```

### Explanation

Synchronous logs happen first:

```text
1
4
```

Then microtasks:

```text
3
```

Then macrotasks:

```text
2
```

---

### Snippet 6: Chained Promises

```js
Promise.resolve()
  .then(() => {
    console.log('A');
  })
  .then(() => {
    console.log('B');
  });

Promise.resolve()
  .then(() => {
    console.log('C');
  })
  .then(() => {
    console.log('D');
  });
```

### Output

```js
A
C
B
D
```

### Explanation

Initial `.then()` callbacks are queued first:

```text
Microtask queue: A, C
```

After `A` runs, it schedules `B`.
After `C` runs, it schedules `D`.

Execution order:

```text
A → C → B → D
```

---

### Snippet 7: `async` / `await` with Promise

```js
async function foo() {
  console.log('foo start');
  await bar();
  console.log('foo end');
}

function bar() {
  console.log('bar');
  return Promise.resolve();
}

console.log('script start');
foo();
console.log('script end');
```

### Output

```js
script start
foo start
bar
script end
foo end
```

### Explanation

1. `script start` logs synchronously.
2. `foo()` is called.
3. `foo start` logs synchronously.
4. `bar()` runs and logs `bar`.
5. `await` pauses `foo`.
6. `script end` logs synchronously.
7. Microtask resumes `foo`.
8. `foo end` logs.

---

### Snippet 8: Mixed Async Scheduling

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => {
  console.log('C');
  setTimeout(() => console.log('D'), 0);
});

Promise.resolve().then(() => console.log('E'));

console.log('F');
```

### Output

```js
A
F
C
E
B
D
```

### Explanation

Synchronous phase:

```text
A
F
```

Microtask queue initially:

```text
C, E
```

Run `C`:

- logs `C`
- schedules timer `D`

Run `E`:

- logs `E`

Macrotask queue:

```text
B, D
```

Timers run in order:

```text
B
D
```

---

### Snippet 9: Closure and Event Loop

```js
for (var i = 0; i < 3; i++) {
  Promise.resolve().then(() => console.log(i));
}
```

### Output

```js
3
3
3
```

### Explanation

`var` creates one function-scoped binding. The promise callbacks run after the loop completes. By then, `i` is `3`.

Fix:

```js
for (let i = 0; i < 3; i++) {
  Promise.resolve().then(() => console.log(i));
}
```

Output:

```js
0
1
2
```

---

### Snippet 10: Function Declaration vs Variable Declaration

```js
console.log(foo);

var foo = 10;

function foo() {
  return 'function';
}

console.log(foo);
```

### Output

```js
ƒ foo() {
  return 'function';
}
10
```

### Explanation

During creation phase:

- Function declarations are hoisted with their function body.
- `var foo` is also hoisted, but it does not overwrite the function during creation.

During execution:

```text
console.log(foo) → function
foo = 10
console.log(foo) → 10
```

---

## 18. Common Interview Traps

### Trap 1: Thinking JavaScript Is Always Simple Line-by-Line

JavaScript has a preparation phase before execution. Hoisting and memory allocation happen first.

### Trap 2: Thinking `let` and `const` Are Not Hoisted

They are hoisted, but they are not initialized. Accessing them before declaration causes TDZ errors.

### Trap 3: Thinking Promise Executor Is Async

The Promise executor runs synchronously.

```js
new Promise(() => {
  console.log('sync');
});
```

Output:

```js
sync
```

### Trap 4: Thinking `setTimeout(..., 0)` Runs Immediately

It runs after synchronous code and after microtasks.

### Trap 5: Thinking Arrow Functions Bind `this` to the Object

Arrow functions capture `this` from their lexical surrounding scope.

### Trap 6: Thinking Closure Stores Values Instead of References

Closures retain access to lexical bindings. This distinction matters in loops and async callbacks.

---

## 19. Final Mental Model

To reason about JavaScript snippets without memorizing outputs, use this model:

```text
1. Create Global Execution Context
2. Allocate memory for declarations
3. Apply hoisting rules
4. Enter execution phase
5. Push function contexts when functions are invoked
6. Resolve variables through lexical environment and scope chain
7. Apply `this` binding based on call site
8. Preserve outer bindings when closures are created
9. Register async callbacks with host APIs
10. Complete synchronous execution
11. Drain microtask queue
12. Process macrotask queue
13. Repeat event loop cycle
```

For a mid-to-senior JavaScript or React developer, the goal is not to memorize outputs. The goal is to trace execution deterministically.

When you can explain:

- what is created in memory,
- which scope owns each variable,
- which execution context is active,
- how `this` is determined,
- when async callbacks are scheduled,
- and why the final output appears in that order,

then you can confidently solve advanced JavaScript output questions and debug production-grade frontend behavior.

---

## Quick Revision Checklist

Before solving any JavaScript output question, ask:

- What declarations exist?
- Which declarations are hoisted?
- Are any variables in TDZ?
- Is a function execution context created?
- What does the local memory contain?
- Where is each variable resolved from?
- Is closure involved?
- What is the value of `this`?
- What runs synchronously?
- What goes to the microtask queue?
- What goes to the macrotask queue?
- What is the final execution order?

---

**End of Document**
