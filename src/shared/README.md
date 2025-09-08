# 共享类型

这个目录包含了在整个应用程序中共享的类型定义，包括 main 进程、preload 进程和 renderer 进程。

## 使用方式

### 在 Main 进程中使用

```typescript
import type { AppVersions, KernalVersionType } from "@/shared/types/index.js";
```

### 在 Preload 进程中使用

```typescript
import type { AppVersions, KernalVersionType } from "@/shared/types/index.js";
```

### 在 Renderer 进程中使用

```typescript
import type { AppVersions, KernalVersionType } from "@/renderer/types/index.js";
// 或者直接从共享类型导入
import type {
  AppVersions,
  KernalVersionType,
} from "../../shared/types/index.js";
```

## 注意事项

- 共享类型应该只包含接口和类型定义，不应该包含具体的实现代码
- 新增类型时，请确保在对应的 `index.ts` 文件中导出
- 保持类型定义的一致性和向后兼容性
