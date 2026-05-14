# Frontend Developer Interview Questions and Answers

**Focus:** React.js and Next.js  
**Target Level:** Mid-to-Senior Frontend Developer — ~5 years experience  
**Format:** Theoretical, practical, scenario-based, and debugging questions with interview-ready answers.

---

## Table of Contents

1. [Basics](#1-basics)
2. [Advanced Concepts](#2-advanced-concepts)
3. [Performance Optimization](#3-performance-optimization)
4. [Architecture](#4-architecture)
5. [Hooks](#5-hooks)
6. [State Management](#6-state-management)
7. [Next.js Features](#7-nextjs-features)
8. [APIs](#8-apis)
9. [Testing](#9-testing)
10. [Real-world Scenarios](#10-real-world-scenarios)
11. [Quick Revision Checklist](#11-quick-revision-checklist)

---

## 1. Basics

### Q1. What is React, and why is it used?

**Answer:**  
React is a JavaScript library for building user interfaces using reusable components. It is commonly used for single-page applications and complex UI systems because it provides:

- Component-based architecture
- Declarative UI rendering
- Efficient updates using reconciliation
- Strong ecosystem and tooling
- Support for client-side, server-side, and static rendering through frameworks like Next.js

React helps developers build predictable and maintainable UIs by describing what the UI should look like for a given state.

---

### Q2. What is JSX?

**Answer:**  
JSX is a syntax extension for JavaScript that allows developers to write HTML-like markup inside JavaScript. JSX is transformed into `React.createElement` calls during compilation.

```jsx
const element = <h1>Hello, React</h1>;
```

The above JSX roughly compiles to:

```jsx
const element = React.createElement('h1', null, 'Hello, React');
```

JSX improves readability and makes UI structure easier to understand.

---

### Q3. What is the difference between props and state?

**Answer:**

- **Props** are inputs passed from a parent component to a child component.
- **State** is internal data managed within a component.

```jsx
function UserCard({ name }) {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div>
      <p>{name}</p>
      <p>{isOnline ? 'Online' : 'Offline'}</p>
    </div>
  );
}
```

In this example, `name` is a prop, while `isOnline` is state.

---

### Q4. What are controlled and uncontrolled components?

**Answer:**  
A **controlled component** is controlled by React state. An **uncontrolled component** stores its value in the DOM and is accessed using refs.

**Controlled input:**

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <input
      value={query}
      onChange={(event) => setQuery(event.target.value)}
    />
  );
}
```

**Uncontrolled input:**

```jsx
function FileInput() {
  const fileRef = useRef(null);

  function handleUpload() {
    console.log(fileRef.current.files[0]);
  }

  return (
    <>
      <input type="file" ref={fileRef} />
      <button onClick={handleUpload}>Upload</button>
    </>
  );
}
```

Controlled components are preferred for validation and predictable UI behavior.

---

### Q5. What is reconciliation in React?

**Answer:**  
Reconciliation is the process React uses to compare the previous virtual UI tree with the new one and update only the necessary parts of the actual DOM.

React uses keys in lists to identify which items changed, were added, or were removed.

```jsx
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}
```

Stable keys help React avoid unnecessary DOM updates and preserve component state correctly.

---

### Q6. Why should array indexes be avoided as keys?

**Answer:**  
Array indexes can cause bugs when list items are reordered, inserted, or deleted because React may reuse component instances incorrectly.

Avoid this:

```jsx
{items.map((item, index) => (
  <TodoItem key={index} item={item} />
))}
```

Prefer this:

```jsx
{items.map((item) => (
  <TodoItem key={item.id} item={item} />
))}
```

Use indexes only when the list is static and will not be reordered or filtered.

---

### Q7. What is conditional rendering?

**Answer:**  
Conditional rendering means rendering different UI based on state, props, permissions, or business rules.

```jsx
function Dashboard({ user }) {
  if (!user) {
    return <LoginPrompt />;
  }

  return user.isAdmin ? <AdminPanel /> : <UserPanel />;
}
```

Common patterns include `if`, ternary operators, logical `&&`, and early returns.

---

### Q8. What is lifting state up?

**Answer:**  
Lifting state up means moving shared state to the nearest common parent so multiple child components can access and update it.

```jsx
function Parent() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <>
      <UserList onSelect={setSelectedUserId} />
      <UserDetails userId={selectedUserId} />
    </>
  );
}
```

This improves consistency when sibling components depend on the same data.

---

## 2. Advanced Concepts

### Q9. What is the virtual DOM?

**Answer:**  
The virtual DOM is an in-memory representation of the UI. React creates a new virtual tree when state or props change, compares it with the previous tree, and applies minimal updates to the real DOM.

It is not a separate browser feature; it is a React abstraction that improves developer experience and enables efficient rendering.

---

### Q10. Explain React Fiber.

**Answer:**  
React Fiber is React's reconciliation architecture. It enables React to split rendering work into units, pause work, resume work, prioritize updates, and support concurrent rendering features.

For a senior frontend developer, the key point is that React Fiber helps React handle complex UI updates more responsively, especially when multiple updates compete for rendering priority.

---

### Q11. What are higher-order components?

**Answer:**  
A higher-order component, or HOC, is a function that takes a component and returns an enhanced component.

```jsx
function withAuth(Component) {
  return function ProtectedComponent(props) {
    const user = useCurrentUser();

    if (!user) {
      return <Login />;
    }

    return <Component {...props} user={user} />;
  };
}
```

HOCs are useful for cross-cutting concerns such as authentication, logging, analytics, and feature flags. In modern React, hooks often replace many HOC use cases.

---

### Q12. What are render props?

**Answer:**  
Render props is a pattern where a component receives a function as a prop and uses it to decide what to render.

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={(event) => setPosition({ x: event.clientX, y: event.clientY })}>
      {render(position)}
    </div>
  );
}
```

Usage:

```jsx
<MouseTracker render={({ x, y }) => <p>{x}, {y}</p>} />
```

This pattern is less common now because hooks usually provide a cleaner abstraction.

---

### Q13. What is code splitting?

**Answer:**  
Code splitting means breaking the JavaScript bundle into smaller chunks and loading them only when needed. This improves initial page load performance.

```jsx
const AdminDashboard = React.lazy(() => import('./AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdminDashboard />
    </Suspense>
  );
}
```

In Next.js, dynamic imports can be used:

```jsx
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('../components/Chart'), {
  loading: () => <p>Loading chart...</p>,
});
```

---

### Q14. What is hydration?

**Answer:**  
Hydration is the process where React attaches event listeners and client-side behavior to HTML that was rendered on the server.

For example, in Next.js, the server sends HTML first. Then React loads JavaScript in the browser and hydrates the page so it becomes interactive.

Hydration mismatches occur when server-rendered output differs from client-rendered output.

Common causes include:

- Using `Date.now()` directly during render
- Using `Math.random()` during render
- Accessing `window` or `localStorage` during server render
- Rendering different markup on server and client

---

### Q15. What is a hydration mismatch and how do you fix it?

**Answer:**  
A hydration mismatch happens when the HTML generated on the server does not match what React expects on the client.

Problem:

```jsx
function Time() {
  return <p>{new Date().toLocaleTimeString()}</p>;
}
```

Fix:

```jsx
function Time() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  return <p>{time ?? 'Loading...'}</p>;
}
```

Client-only values should be computed after mount.

---

### Q16. What are portals in React?

**Answer:**  
Portals allow rendering a child component into a DOM node outside the parent DOM hierarchy.

```jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')
  );
}
```

Portals are useful for modals, tooltips, dropdowns, and overlays that should escape parent stacking or overflow contexts.

---

## 3. Performance Optimization

### Q17. How do you optimize React application performance?

**Answer:**  
Common optimization techniques include:

- Avoid unnecessary re-renders
- Use `React.memo` for pure components
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable function references
- Split code with dynamic imports
- Virtualize large lists
- Optimize images and fonts
- Debounce or throttle expensive events
- Keep state close to where it is used
- Avoid creating new objects/functions unnecessarily in render-heavy paths

Performance optimization should be guided by profiling, not guesswork.

---

### Q18. What is `React.memo`?

**Answer:**  
`React.memo` memoizes a component and skips re-rendering when props have not changed shallowly.

```jsx
const UserRow = React.memo(function UserRow({ user, onSelect }) {
  return <button onClick={() => onSelect(user.id)}>{user.name}</button>;
});
```

It is useful when:

- The component renders often
- Props are stable
- Rendering is expensive

It is less useful if props are always new references.

---

### Q19. What is the difference between `useMemo` and `useCallback`?

**Answer:**

- `useMemo` memoizes a computed value.
- `useCallback` memoizes a function reference.

```jsx
const filteredUsers = useMemo(() => {
  return users.filter((user) => user.active);
}, [users]);

const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);
```

Conceptually:

```jsx
useCallback(fn, deps)
```

is similar to:

```jsx
useMemo(() => fn, deps)
```

---

### Q20. How would you optimize a list with 10,000 rows?

**Answer:**  
Use list virtualization so only visible rows are rendered.

Example with a virtualization library conceptually:

```jsx
function VirtualizedUserList({ users }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={users.length}
      itemSize={48}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{users[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

Additional optimizations:

- Server-side pagination
- Infinite scrolling
- Memoized row components
- Stable keys
- Avoid expensive calculations inside row render

---

### Q21. How do you debug unnecessary re-renders?

**Answer:**

Steps:

1. Use React DevTools Profiler.
2. Check whether parent state changes are causing child re-renders.
3. Verify prop references are stable.
4. Look for inline objects, arrays, or functions passed to memoized children.
5. Use logging selectively or tools like why-did-you-render in development.

Example problem:

```jsx
<UserList filters={{ active: true }} />
```

The object is recreated on every render.

Fix:

```jsx
const filters = useMemo(() => ({ active: true }), []);

<UserList filters={filters} />
```

---

### Q22. What are Core Web Vitals?

**Answer:**  
Core Web Vitals are user-centric performance metrics used to evaluate page experience. Important metrics include:

- **LCP:** Largest Contentful Paint, measures loading performance.
- **INP:** Interaction to Next Paint, measures responsiveness.
- **CLS:** Cumulative Layout Shift, measures visual stability.

For React and Next.js apps, improving Core Web Vitals often involves image optimization, reducing JavaScript, server rendering, caching, font optimization, and avoiding layout shifts.

---

### Q23. How do you optimize images in Next.js?

**Answer:**  
Use the `next/image` component for automatic image optimization features such as resizing, lazy loading, and modern image formats when supported.

```jsx
import Image from 'next/image';

export default function ProductImage() {
  return (
    <Image
      src="/product.jpg"
      alt="Product"
      width={600}
      height={400}
      priority
    />
  );
}
```

Use `priority` only for above-the-fold critical images, such as hero images.

---

## 4. Architecture

### Q24. How would you structure a large React application?

**Answer:**  
A scalable structure usually groups code by feature rather than by technical type.

Example:

```text
src/
  app/
    routes/
    providers/
  features/
    auth/
      components/
      hooks/
      services/
      types/
    products/
      components/
      hooks/
      services/
      types/
  shared/
    components/
    hooks/
    utils/
    constants/
  tests/
```

Benefits:

- Better ownership
- Easier refactoring
- Clear boundaries
- Reduced coupling
- Easier testing

---

### Q25. What is component composition?

**Answer:**  
Component composition means building complex UI by combining smaller components instead of relying heavily on inheritance or deeply configurable components.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function ProductCard({ product }) {
  return (
    <Card>
      <h2>{product.name}</h2>
      <p>{product.price}</p>
    </Card>
  );
}
```

Composition makes components flexible, reusable, and easier to test.

---

### Q26. How do you design reusable components?

**Answer:**  
A reusable component should be:

- Focused on a single responsibility
- Controlled through clear props
- Accessible by default
- Style-customizable without business logic leakage
- Well-tested
- Documented with examples

Example:

```jsx
function Button({ variant = 'primary', disabled, children, ...props }) {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

Avoid putting domain-specific assumptions into shared UI components.

---

### Q27. What is the difference between smart and presentational components?

**Answer:**

- **Smart/container components** handle data fetching, state management, permissions, and side effects.
- **Presentational components** focus on rendering UI based on props.

```jsx
function UserContainer() {
  const { data, isLoading } = useUserQuery();

  if (isLoading) return <Spinner />;

  return <UserProfile user={data} />;
}

function UserProfile({ user }) {
  return <h1>{user.name}</h1>;
}
```

This separation improves testability and maintainability.

---

### Q28. How do you handle authentication architecture in React or Next.js?

**Answer:**  
A robust authentication architecture includes:

- Secure token/session storage strategy
- Server-side authorization for protected data
- Route protection
- Refresh token handling if applicable
- Role-based access control
- Centralized auth provider or session utility
- Logout and session expiry handling

In Next.js, authentication can be handled at middleware, server components, route handlers, or client components depending on the use case.

Example route guard concept:

```jsx
function ProtectedPage({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Login />;

  return children;
}
```

Security-sensitive checks must also happen on the server.

---

### Q29. How would you handle design system integration?

**Answer:**  
A design system should provide reusable, accessible, and consistent UI primitives.

Key practices:

- Define tokens for colors, spacing, typography, and radius
- Build primitive components like Button, Input, Modal, Tabs
- Use accessibility standards from the beginning
- Provide usage documentation
- Version components carefully
- Avoid coupling design system components with product-specific business logic
- Add visual regression tests for critical components

---

## 5. Hooks

### Q30. What are React hooks?

**Answer:**  
Hooks are functions that let functional components use React features such as state, lifecycle behavior, context, refs, and memoization.

Common hooks include:

- `useState`
- `useEffect`
- `useContext`
- `useReducer`
- `useMemo`
- `useCallback`
- `useRef`
- `useLayoutEffect`

Hooks should be called only at the top level of React functions or custom hooks.

---

### Q31. Explain `useEffect`.

**Answer:**  
`useEffect` runs side effects after rendering. Side effects include data fetching, subscriptions, timers, and manually interacting with browser APIs.

```jsx
useEffect(() => {
  document.title = `Cart (${items.length})`;
}, [items.length]);
```

The dependency array controls when the effect runs.

---

### Q32. What are common mistakes with `useEffect`?

**Answer:**

Common mistakes include:

- Missing dependencies
- Adding unstable dependencies unnecessarily
- Performing derived state updates in effects unnecessarily
- Not cleaning up subscriptions or timers
- Using effects for logic that can be calculated during render

Problem:

```jsx
useEffect(() => {
  const id = setInterval(fetchNotifications, 5000);
}, []);
```

Fix:

```jsx
useEffect(() => {
  const id = setInterval(fetchNotifications, 5000);

  return () => clearInterval(id);
}, []);
```

---

### Q33. What is the difference between `useEffect` and `useLayoutEffect`?

**Answer:**

- `useEffect` runs after the browser paints.
- `useLayoutEffect` runs synchronously after DOM mutations but before the browser paints.

Use `useLayoutEffect` when you must measure layout or synchronously apply DOM changes before the user sees the result.

```jsx
useLayoutEffect(() => {
  const height = ref.current.getBoundingClientRect().height;
  setHeight(height);
}, []);
```

Prefer `useEffect` unless layout measurement is required.

---

### Q34. What is `useRef` used for?

**Answer:**  
`useRef` stores a mutable value that persists across renders without causing re-renders when updated.

Common uses:

- Accessing DOM elements
- Storing timer IDs
- Keeping previous values
- Holding mutable flags

```jsx
function SearchInput() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
```

---

### Q35. When would you use `useReducer` instead of `useState`?

**Answer:**  
Use `useReducer` when state logic is complex, involves multiple related fields, or has event-based transitions.

```jsx
const initialState = { loading: false, data: null, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { loading: true, data: null, error: null };
    case 'FETCH_SUCCESS':
      return { loading: false, data: action.payload, error: null };
    case 'FETCH_ERROR':
      return { loading: false, data: null, error: action.payload };
    default:
      return state;
  }
}

function Users() {
  const [state, dispatch] = useReducer(reducer, initialState);
}
```

It makes state transitions explicit and easier to test.

---

### Q36. How do you create a custom hook?

**Answer:**  
A custom hook extracts reusable stateful logic into a function whose name starts with `use`.

```jsx
function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}
```

Usage:

```jsx
const debouncedSearch = useDebouncedValue(search, 500);
```

Custom hooks improve reuse and separate business logic from UI.

---

## 6. State Management

### Q37. What are common state management options in React?

**Answer:**  
Common options include:

- Local component state with `useState`
- Complex local state with `useReducer`
- Global lightweight state with Context
- External client state libraries such as Redux, Zustand, Jotai, or Recoil
- Server-state libraries such as TanStack Query, SWR, Apollo Client, or RTK Query
- URL state using query parameters

The best choice depends on state ownership, frequency of updates, sharing needs, and caching requirements.

---

### Q38. What is the difference between client state and server state?

**Answer:**

**Client state** is owned by the frontend application. Examples:

- Modal open/closed state
- Theme
- Form input values
- Selected tab

**Server state** is owned by the backend and cached by the frontend. Examples:

- User profile
- Product catalog
- Orders
- Notifications

Server state needs caching, background refetching, invalidation, deduplication, loading states, and error handling. Libraries like TanStack Query or SWR are designed for this.

---

### Q39. When should you use React Context?

**Answer:**  
Use Context for values needed by many components, especially low-frequency updates.

Good use cases:

- Theme
- Locale
- Auth session
- Feature flags
- App configuration

Avoid using a single large Context for frequently changing state because every consumer may re-render when the context value changes.

---

### Q40. How do you optimize Context to avoid unnecessary re-renders?

**Answer:**

Techniques:

- Split context by concern
- Memoize provider values
- Keep frequently changing state closer to consumers
- Use context selectors or external stores for high-frequency updates

```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

---

### Q41. Redux vs Context: when would you choose Redux?

**Answer:**  
Choose Redux or Redux Toolkit when the application has:

- Complex global state
- Predictable event-based updates
- Need for debugging with time travel or action logs
- Multiple teams contributing to shared state
- Middleware requirements
- Normalized data structures

Choose Context for simpler dependency injection or low-frequency global values.

---

### Q42. How would you handle form state in React?

**Answer:**  
For small forms, controlled components with local state are enough. For complex forms, use a form library such as React Hook Form or Formik.

Good form architecture includes:

- Validation schema
- Field-level error messages
- Accessible labels
- Submit loading state
- Server-side validation handling
- Dirty/touched state tracking

Example:

```jsx
function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  return (
    <form>
      <input name="email" value={form.email} onChange={updateField} />
      <input name="password" type="password" value={form.password} onChange={updateField} />
    </form>
  );
}
```

---

## 7. Next.js Features

### Q43. What is Next.js?

**Answer:**  
Next.js is a React framework for building production-ready web applications. It provides routing, rendering strategies, server-side capabilities, API routes or route handlers, image optimization, font optimization, middleware, and deployment optimizations.

It supports multiple rendering approaches:

- Static Site Generation
- Server-Side Rendering
- Incremental Static Regeneration
- Client-Side Rendering
- React Server Components in the App Router

---

### Q44. What is the difference between Pages Router and App Router?

**Answer:**

**Pages Router:**

- Uses the `pages/` directory
- File-based routing
- Data fetching with `getStaticProps`, `getServerSideProps`, and `getStaticPaths`
- API routes under `pages/api`

**App Router:**

- Uses the `app/` directory
- Supports layouts, nested routing, loading states, error boundaries, and route groups
- Uses React Server Components by default
- Supports server actions and route handlers
- Provides more granular rendering and streaming capabilities

For new applications, App Router is commonly preferred unless project constraints require Pages Router.

---

### Q45. What are Server Components and Client Components?

**Answer:**

In the Next.js App Router, components are Server Components by default. Server Components render on the server and do not ship their JavaScript to the browser.

Use Client Components when you need:

- State
- Effects
- Browser APIs
- Event handlers
- Client-side interactivity

```jsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

A good rule is to keep as much UI as possible in Server Components and move only interactive parts to Client Components.

---

### Q46. Explain static rendering, dynamic rendering, and streaming in Next.js.

**Answer:**

- **Static rendering:** HTML is generated ahead of time and cached.
- **Dynamic rendering:** HTML is generated at request time based on request-specific data.
- **Streaming:** UI is progressively sent from the server to the client in chunks.

Streaming improves perceived performance because users can see parts of the UI before all data is ready.

Example loading state in App Router:

```jsx
// app/dashboard/loading.jsx
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

---

### Q47. What is Incremental Static Regeneration?

**Answer:**  
Incremental Static Regeneration, or ISR, allows static pages to be regenerated after deployment. It combines static performance with periodic freshness.

Example:

```jsx
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then((res) => res.json());

  return <ProductList products={products} />;
}
```

This tells Next.js that the page can be regenerated at most every 60 seconds, depending on cache behavior and deployment platform.

---

### Q48. What is middleware in Next.js?

**Answer:**  
Middleware runs before a request is completed. It can be used for redirects, rewrites, authentication checks, localization, A/B testing, and header manipulation.

```jsx
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

Middleware should be lightweight and should not perform expensive operations.

---

### Q49. What are route handlers in Next.js?

**Answer:**  
Route handlers define backend endpoints inside the App Router using files such as `route.js` or `route.ts`.

```jsx
// app/api/users/route.js
export async function GET() {
  const users = await getUsers();

  return Response.json(users);
}
```

They are useful for server-side APIs, webhooks, authentication callbacks, and proxying external services.

---

### Q50. How do layouts work in the App Router?

**Answer:**  
Layouts wrap pages and preserve UI across navigation. They are useful for shared structures such as sidebars, headers, and navigation.

```jsx
// app/dashboard/layout.jsx
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

Nested layouts allow each route segment to define its own shared UI.

---

### Q51. What is the purpose of `loading.js` and `error.js` in Next.js App Router?

**Answer:**

- `loading.js` defines an automatic loading UI for a route segment.
- `error.js` defines an error boundary for a route segment.

```jsx
// app/products/error.jsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

These files improve user experience by handling loading and failure states locally.

---

### Q52. How do you handle SEO in Next.js?

**Answer:**  
Next.js supports SEO through server rendering, metadata configuration, semantic HTML, structured data, optimized images, and canonical URLs.

Example metadata:

```jsx
export const metadata = {
  title: 'Products | My Store',
  description: 'Browse high-quality products from My Store.',
};
```

SEO best practices:

- Use meaningful titles and descriptions
- Use semantic HTML
- Add Open Graph metadata
- Optimize page speed
- Use canonical URLs where needed
- Generate sitemap and robots files

---

## 8. APIs

### Q53. How do you fetch data in React?

**Answer:**  
Data can be fetched using `fetch`, Axios, or a server-state library.

Basic example:

```jsx
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch('/api/users', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadUsers();

    return () => controller.abort();
  }, []);
}
```

For production apps, consider a library that handles caching and retries.

---

### Q54. How do you handle API errors gracefully?

**Answer:**  
Good API error handling includes:

- Checking HTTP status codes
- Showing user-friendly messages
- Logging technical details safely
- Handling validation errors separately
- Supporting retry where appropriate
- Avoiding exposure of sensitive backend details

```jsx
async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || 'Something went wrong');
  }

  return response.json();
}
```

---

### Q55. How do you avoid race conditions in API calls?

**Answer:**  
Race conditions happen when multiple async requests return out of order and older responses overwrite newer state.

Use `AbortController` or request IDs.

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setResults)
    .catch((err) => {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    });

  return () => controller.abort();
}, [query]);
```

---

### Q56. What are REST and GraphQL from a frontend perspective?

**Answer:**

**REST:**

- Resource-oriented endpoints
- Multiple endpoints for different resources
- Uses HTTP methods such as GET, POST, PUT, PATCH, DELETE
- Simple and widely adopted

**GraphQL:**

- Client requests exactly the data it needs
- Single endpoint commonly used
- Strong schema and typed queries
- Reduces over-fetching and under-fetching

Frontend tradeoff: REST is simpler for many apps; GraphQL is powerful for complex data relationships and multiple clients.

---

### Q57. How would you implement optimistic UI updates?

**Answer:**  
Optimistic updates update the UI immediately before the server confirms success, then rollback if the request fails.

```jsx
async function toggleTodo(todoId) {
  const previousTodos = todos;

  setTodos((current) =>
    current.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    )
  );

  try {
    await updateTodo(todoId);
  } catch (error) {
    setTodos(previousTodos);
    showToast('Could not update todo. Please try again.');
  }
}
```

Optimistic UI improves perceived speed but requires careful rollback handling.

---

## 9. Testing

### Q58. What types of tests are important for React applications?

**Answer:**

Important test types include:

- **Unit tests:** Test isolated functions or components.
- **Integration tests:** Test multiple components working together.
- **End-to-end tests:** Test complete user flows in a browser.
- **Accessibility tests:** Validate keyboard navigation, roles, labels, and contrast.
- **Visual regression tests:** Catch unintended UI changes.

For frontend roles, interviewers often expect familiarity with Jest, React Testing Library, Playwright, or Cypress.

---

### Q59. How do you test a React component with React Testing Library?

**Answer:**  
React Testing Library encourages testing behavior from the user's perspective.

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('increments count when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole('button', { name: /increment/i });
  await user.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

Prefer queries such as `getByRole`, `getByLabelText`, and `getByText` over implementation-specific selectors.

---

### Q60. How do you test API calls in frontend tests?

**Answer:**  
Mock API calls at the network layer using tools such as MSW or by mocking fetch in unit tests.

Example with mocked fetch:

```jsx
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: 'Madan' }]),
  })
);
```

Better integration-style approach uses Mock Service Worker because it simulates real network behavior without changing application code.

---

### Q61. What should you avoid when testing React components?

**Answer:**

Avoid:

- Testing implementation details
- Overusing snapshots
- Querying by CSS classes when accessible queries are available
- Mocking too much of the component tree
- Ignoring loading and error states
- Writing tests that are tightly coupled to internal state

Good tests should validate user-visible behavior and business outcomes.

---

### Q62. How would you test a Next.js page?

**Answer:**  
Testing depends on the rendering model.

For UI behavior:

- Render the component with Testing Library
- Mock router utilities if needed
- Mock data dependencies

For full flows:

- Use Playwright or Cypress
- Test navigation, server-rendered content, authentication redirects, and form submissions

Example E2E test idea:

```jsx
test('user can search products', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('textbox', { name: /search/i }).fill('laptop');
  await page.getByRole('button', { name: /search/i }).click();
  await expect(page.getByText(/laptop/i)).toBeVisible();
});
```

---

## 10. Real-world Scenarios

### Q63. Scenario: A React page becomes slow while typing in a search input. How do you debug and fix it?

**Answer:**

Possible causes:

- Expensive filtering on every keystroke
- Large list re-rendering
- Parent component causing unnecessary child re-renders
- API call triggered on every character

Fixes:

- Debounce the search value
- Memoize filtered results
- Virtualize the list
- Split components so input state does not re-render the whole page
- Use `useTransition` for non-urgent UI updates

Example:

```jsx
const deferredQuery = useDeferredValue(query);

const filteredItems = useMemo(() => {
  return items.filter((item) =>
    item.name.toLowerCase().includes(deferredQuery.toLowerCase())
  );
}, [items, deferredQuery]);
```

---

### Q64. Scenario: A modal appears behind another component. What could be wrong?

**Answer:**

Likely causes:

- Incorrect `z-index`
- Parent stacking context caused by `position`, `transform`, `opacity`, or `filter`
- Modal rendered inside an overflow-hidden container

Fix:

- Render modal using a portal at the document root
- Define a consistent z-index scale
- Avoid nesting overlays inside layout containers

```jsx
createPortal(<ModalContent />, document.body);
```

---

### Q65. Scenario: A Next.js page shows different content on refresh compared to client navigation. Why?

**Answer:**

Possible causes:

- Server and client data sources differ
- Client cache is stale
- Request-specific data is not handled correctly
- Client-only logic changes the rendered output
- Static page was generated with old data

Debug steps:

1. Check rendering strategy: static or dynamic.
2. Inspect fetch cache configuration.
3. Compare server logs with browser network calls.
4. Check whether cookies, headers, or query parameters affect data.
5. Verify hydration warnings.

---

### Q66. Scenario: A user reports that clicking a button twice creates duplicate orders. How would you fix it?

**Answer:**

Frontend fixes:

- Disable the button while submitting
- Show a loading state
- Debounce or guard repeated clicks

```jsx
const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit() {
  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    await createOrder();
  } finally {
    setIsSubmitting(false);
  }
}
```

Backend fixes are also required:

- Idempotency keys
- Duplicate request detection
- Transactional constraints

Frontend alone should not be the only protection.

---

### Q67. Scenario: An API works locally but fails in production. What would you check?

**Answer:**

Check:

- Environment variables
- API base URL
- CORS configuration
- Authentication cookies and SameSite settings
- HTTPS requirements
- Reverse proxy or CDN rules
- Build-time vs runtime environment differences
- Server logs and browser network tab
- Rate limits or firewall rules

In Next.js, verify whether variables are server-only or exposed to the browser with `NEXT_PUBLIC_`.

---

### Q68. Scenario: A page has poor LCP. How would you improve it?

**Answer:**

Steps:

- Identify the LCP element using performance tools
- Optimize hero image using `next/image`
- Use `priority` for critical images
- Reduce render-blocking CSS and JavaScript
- Improve server response time
- Use caching or static rendering where appropriate
- Avoid loading heavy client components above the fold
- Preload critical fonts if needed

Example:

```jsx
<Image
  src="/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={600}
  priority
/>
```

---

### Q69. Scenario: A React app has memory leaks after navigating between pages. How do you investigate?

**Answer:**

Likely causes:

- Uncleaned timers
- Active subscriptions
- Event listeners not removed
- Pending async operations updating unmounted components
- Large objects retained in closures

Fix patterns:

```jsx
useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth);
  }

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

Use browser memory profiling and React DevTools to inspect retained components.

---

### Q70. Scenario: You need to migrate a large React app to Next.js. What is your approach?

**Answer:**

Suggested approach:

1. Audit current routes, data fetching, auth, SEO, and build tooling.
2. Decide whether to use App Router, Pages Router, or incremental migration.
3. Move shared components and utilities first.
4. Migrate routes gradually.
5. Replace client-only data fetching with appropriate server-side patterns where valuable.
6. Add metadata and SEO improvements.
7. Validate performance and accessibility.
8. Add regression tests for critical flows.
9. Monitor production metrics after rollout.

Avoid rewriting everything at once unless there is a strong business reason.

---

### Q71. Scenario: A component has too many props. What would you do?

**Answer:**

Possible improvements:

- Split the component into smaller components
- Use composition with `children`
- Group related props into objects carefully
- Move business logic to a custom hook
- Replace boolean prop combinations with variants
- Use context for truly shared values

Problem:

```jsx
<Button primary large rounded loading disabled iconLeft iconRight />
```

Better:

```jsx
<Button variant="primary" size="lg" isLoading disabled>
  Save
</Button>
```

---

### Q72. Scenario: A production bug occurs only for some users. How do you debug it?

**Answer:**

Approach:

- Check browser, OS, device, locale, and network conditions
- Review logs, monitoring, and error tracking
- Identify affected user segments
- Reproduce with similar environment and permissions
- Check feature flags and A/B experiments
- Inspect API responses for affected accounts
- Add temporary safe logging if needed
- Roll back if the issue is severe

For frontend apps, production debugging often requires observability through error tracking, performance monitoring, and user session metadata.

---

## 11. Quick Revision Checklist

Use this checklist before a mid-to-senior React/Next.js interview:

- Explain rendering, reconciliation, hydration, and memoization clearly.
- Know when to use `useState`, `useReducer`, `useMemo`, `useCallback`, and `useRef`.
- Understand server state vs client state.
- Explain Context limitations and optimization strategies.
- Understand Next.js App Router, Server Components, Client Components, layouts, loading states, error boundaries, route handlers, and middleware.
- Know common performance patterns: code splitting, lazy loading, virtualization, image optimization, and reducing re-renders.
- Be ready to debug hydration mismatches, API race conditions, memory leaks, and production-only bugs.
- Understand testing strategy: unit, integration, E2E, accessibility, and visual regression.
- Be able to discuss architecture: feature-based structure, design systems, authentication, and scalable component design.
- Always explain tradeoffs, not just definitions.

---

## Interview Answering Tips

For a 5-year frontend developer role, avoid giving only textbook definitions. Structure your answers like this:

1. **Definition:** Explain the concept clearly.
2. **Use case:** Explain when you would use it.
3. **Tradeoff:** Mention limitations or risks.
4. **Example:** Provide a short practical example.
5. **Real-world note:** Connect it to maintainability, performance, scalability, or user experience.

Example answer pattern:

> I would use `useMemo` when a calculation is expensive and depends on stable inputs. It avoids recalculating on every render, but I would not use it everywhere because memoization also has overhead. I usually profile first, then apply it where it improves performance or stabilizes props passed to memoized children.

---

**End of Document**
