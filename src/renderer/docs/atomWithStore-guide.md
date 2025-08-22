# atomWithStore 使用指南

## 概述

`atomWithStore` 是一个专门用于 Electron Store 的 atom 工具，它补充了现有的 `atom` (内存) 和 `atomWithStorage` (localStorage)，提供了完整的状态管理解决方案。

## 设计理念

- **保留现有工具**: 继续使用 `atom` 和 `atomWithStorage`
- **专门的 Electron Store**: `atomWithStore` 专门处理与主进程的 IPC 通信
- **简单的数据流**: 内存 → localStorage (可选) → Electron Store
- **Hook 驱动**: 通过 `useStoreSync` hook 处理初始化和监听

## 基本用法

### 1. 纯内存存储 (atom)

```ts
import { atom } from "jotai";

const memoryAtom = atom({
  count: 0,
  message: "临时数据",
});

// 适用于: UI 状态、临时计算结果等
```

### 2. localStorage 存储 (atomWithStorage)

```ts
import { atomWithStorage } from "jotai/utils";

const localAtom = atomWithStorage("local-settings", {
  theme: "light",
  sidebar: false,
});

// 适用于: 用户偏好设置、缓存数据等
```

### 3. Electron Store 存储 (atomWithStore)

```ts
import { atomWithStore, useStoreSync } from "@/renderer/utils/atomWithStore";

// 创建 atom
const userAtom = atomWithStore("user", {
  name: "",
  id: "",
  settings: {},
});

// 在组件中使用
function UserProfile() {
  const [user, setUser] = useStoreSync(userAtom);

  return (
    <div>
      <p>用户: {user.name}</p>
      <button onClick={() => setUser((prev) => ({ ...prev, name: "张三" }))}>
        更新用户
      </button>
    </div>
  );
}

// 适用于: 用户数据、应用配置、跨窗口共享的状态等
```

### 4. 混合模式 (localStorage + Electron Store)

```ts
const hybridAtom = atomWithStore(
  "config",
  {
    apiKey: "",
    preferences: {},
  },
  {
    useLocalStorage: true, // 同时保存到 localStorage
  }
);

// 适用于: 重要配置数据，需要双重备份
```

## 配置选项

```ts
interface AtomWithStoreOptions {
  useLocalStorage?: boolean; // 是否同时保存到 localStorage (默认: false)
  getOnInit?: boolean; // 是否初始化时加载数据 (默认: true)
}
```

## 核心 API

### atomWithStore

```ts
function atomWithStore<T>(
  key: string,
  defaultValue: T,
  options?: AtomWithStoreOptions
);
```

**参数:**

- `key`: 存储键名
- `defaultValue`: 默认值
- `options`: 配置选项

**返回:** 增强的 atom，包含额外方法：

- `refresh()`: 从 Electron Store 刷新值
- `subscribe()`: 监听值变化
- `sync()`: 手动同步到 Electron Store

### useStoreSync

```ts
function useStoreSync<T>(
  storeAtom: AtomWithStore<T>,
  onStoreChange?: (value: T) => void
): [value: T, setValue: (update: T | ((prev: T) => T)) => void];
```

**作用:**

- 自动处理 Electron Store 的初始化
- 监听来自其他地方的数据变化
- 提供同步的 setter 函数

**参数:**

- `storeAtom`: atomWithStore 创建的 atom
- `onStoreChange`: 可选的变化回调

## 使用场景

### 选择合适的存储方式

| 存储方式          | 适用场景           | 特点                       |
| ----------------- | ------------------ | -------------------------- |
| `atom`            | UI 状态、临时数据  | 内存中，页面刷新丢失       |
| `atomWithStorage` | 用户偏好、缓存     | localStorage，浏览器本地   |
| `atomWithStore`   | 用户数据、应用配置 | Electron Store，跨窗口共享 |
| 混合模式          | 重要配置、备份数据 | 双重存储，更安全           |

### 实际应用示例

```ts
// 1. 应用主题设置 (localStorage)
const themeAtom = atomWithStorage("theme", "light");

// 2. 用户登录状态 (Electron Store)
const userAtom = atomWithStore("user", {
  isLoggedIn: false,
  token: "",
  profile: {},
});

// 3. 重要配置 (混合模式)
const configAtom = atomWithStore(
  "app-config",
  {
    apiEndpoint: "",
    secretKey: "",
  },
  {
    useLocalStorage: true, // 双重备份
  }
);

// 4. 临时 UI 状态 (内存)
const uiAtom = atom({
  isLoading: false,
  activeTab: 0,
});
```

## 高级功能

### 监听存储变化

```ts
const userAtom = atomWithStore("user", defaultUser);

// 监听变化
const unsubscribe = userAtom.subscribe((newValue) => {
  console.log("用户数据已更新:", newValue);
});

// 取消监听
unsubscribe();
```

### 手动刷新和同步

```ts
const configAtom = atomWithStore("config", defaultConfig);

// 手动从 Electron Store 刷新
const latestValue = await configAtom.refresh();

// 手动同步到 Electron Store
configAtom.sync(currentValue);
```

### 错误处理

```ts
function UserComponent() {
  const [user, setUser] = useStoreSync(userAtom, (newUser) => {
    // 监听变化，可以进行错误处理
    if (!newUser.id) {
      console.warn("用户ID为空");
    }
  });

  const handleSave = async () => {
    try {
      setUser(updatedUser);
      // atomWithStore 会自动处理同步
    } catch (error) {
      console.error("保存失败:", error);
    }
  };
}
```

## 最佳实践

### 1. 合理选择存储方式

```ts
// ✅ 好的做法
const uiState = atom({ sidebarOpen: false }); // 临时 UI 状态
const userPrefs = atomWithStorage("prefs", {}); // 用户偏好
const userData = atomWithStore("user", {}); // 重要用户数据

// ❌ 不推荐
const everything = atomWithStore("everything", {}); // 把所有数据都放在一起
```

### 2. 使用 useStoreSync

```ts
// ✅ 推荐：使用 useStoreSync
function UserProfile() {
  const [user, setUser] = useStoreSync(userAtom);
  // 自动处理初始化和监听
}

// ❌ 不推荐：直接使用 useAtom
function UserProfile() {
  const [user, setUser] = useAtom(userAtom);
  // 需要手动处理初始化
}
```

### 3. 适当的错误处理

```ts
const userAtom = atomWithStore("user", defaultUser);

function useUser() {
  const [user, setUser] = useStoreSync(userAtom);

  const updateUser = useCallback(
    async (updates) => {
      try {
        setUser((prev) => ({ ...prev, ...updates }));
      } catch (error) {
        console.error("更新用户失败:", error);
        // 可以显示错误提示给用户
      }
    },
    [setUser]
  );

  return { user, updateUser };
}
```

### 4. 类型安全

```ts
interface UserData {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: "light" | "dark";
    language: string;
  };
}

const userAtom = atomWithStore<UserData>("user", {
  id: "",
  name: "",
  email: "",
  preferences: {
    theme: "light",
    language: "zh-CN",
  },
});
```

## 常见问题

### Q: 什么时候使用混合模式？

A: 当数据非常重要且需要备份时，比如用户的重要配置、加密密钥等。

```ts
const importantConfigAtom = atomWithStore(
  "important-config",
  {
    apiKey: "",
    secretToken: "",
  },
  {
    useLocalStorage: true, // 双重备份
  }
);
```

### Q: 如何处理初始化加载？

A: 使用 `useStoreSync` hook，它会自动处理：

```ts
function MyComponent() {
  const [data, setData] = useStoreSync(dataAtom);
  // data 会自动从 Electron Store 加载初始值
}
```

### Q: 如何监听来自其他窗口的变化？

A: 使用 subscribe 方法：

```ts
useEffect(() => {
  const unsubscribe = dataAtom.subscribe((newData) => {
    console.log("其他窗口更新了数据:", newData);
  });

  return unsubscribe;
}, []);
```

### Q: 性能考虑？

A: `atomWithStore` 的同步是异步的，不会阻塞 UI。但对于频繁变化的数据，建议使用内存 atom：

```ts
// ✅ 频繁变化的数据用内存 atom
const mousePositionAtom = atom({ x: 0, y: 0 });

// ✅ 重要且不常变化的数据用 atomWithStore
const userProfileAtom = atomWithStore("profile", {});
```

## 迁移指南

### 从 atomWithStorage 迁移

```ts
// 之前
const oldAtom = atomWithStorage("key", defaultValue);

// 迁移后
const newAtom = atomWithStore("key", defaultValue, {
  useLocalStorage: true, // 保持 localStorage 兼容性
});

// 使用方式改变
// 之前
const [value, setValue] = useAtom(oldAtom);

// 之后
const [value, setValue] = useStoreSync(newAtom);
```

### 从普通 atom 迁移

```ts
// 之前
const oldAtom = atom(defaultValue);

// 迁移后
const newAtom = atomWithStore("unique-key", defaultValue);

// 使用方式改变
const [value, setValue] = useStoreSync(newAtom);
```
