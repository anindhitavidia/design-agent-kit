---
description: >
  Quick-reference for React patterns. Covers component structure, hooks, state
  management, effects, and Next.js App Router specifics. Invoke when building
  components or prototypes.
---

# React Expert

Quick-reference for React patterns in a Next.js design prototype.

---

## 1. Component Structure

```tsx
interface PanelProps {
  title: string;
  children: React.ReactNode;
}

export function Panel({ title, children }: PanelProps) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

- Props interface → component function → export.
- **Named exports** for reusable components.
- **Default export** for pages only (`page.tsx`).

---

## 2. Hook Rules

Body order inside a component:

1. `useState` / `useRef`
2. `useMemo` / derived state
3. Event handlers
4. `useEffect`
5. Return JSX

**Custom hooks:** `use` prefix, typed return values, encapsulate related logic into a single hook when it grows beyond ~20 lines.

---

## 3. State Management

- Prefer local `useState`. Lift state only when siblings need it.
- **No state management libraries** (Redux, Zustand, Jotai) — prototypes don't need them.
- For complex prototypes, use React Context:

```tsx
interface AppState {
  filters: FilterSet;
  setFilters: (f: FilterSet) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterSet>(defaultFilters);
  return (
    <AppContext.Provider value={{ filters, setFilters }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
```

---

## 4. Effects

- Always declare all dependencies — no `// eslint-disable-next-line`.
- Cleanup subscriptions in the return function.
- **Don't use effects for derived state** — use `useMemo` instead.
- **Don't fetch data in useEffect** — use the data layer pattern (`_lib/` with mock data).

```tsx
// Wrong — derived state in effect
useEffect(() => {
  setFilteredItems(items.filter(i => i.active));
}, [items]);

// Right — useMemo
const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
);
```

---

## 5. Performance

- **Don't memoize by default.** Premature optimization adds complexity.
- Use `useMemo` / `useCallback` only when you've measured a performance issue.
- `React.memo` only for components that re-render frequently with the same props.

---

## 6. Next.js App Router

- Files in `app/` are **Server Components** by default.
- Add `'use client'` at the top of files that use hooks, event handlers, or browser APIs.
- Keep `page.tsx` thin — delegate to client components in `_components/`.
- Use `_components/` for page-specific client components.

```
app/[route]/
├── page.tsx              <- Server Component, thin entry point
├── _components/          <- Client components ('use client')
├── _lib/                 <- Types, utilities, mock data
└── _shell/               <- Layout shell if needed
```

---

## 7. Common Patterns

**Conditional rendering** — early returns for loading/error/empty before main JSX:

```tsx
if (isLoading) return <Spinner />;
if (error) return <Alert variant="destructive">{error.message}</Alert>;
if (items.length === 0) return <EmptyState />;

return <ItemList items={items} />;
```

**List rendering** — always provide a stable `key`, never use array index:

```tsx
{items.map(item => (
  <ItemCard key={item.id} item={item} />
))}
```

**Controlled inputs** — prefer controlled over uncontrolled:

```tsx
const [value, setValue] = useState("");
<TextInput value={value} onChange={(e) => setValue(e.target.value)} />
```
