# /commit-all - 所有未提交變更的 Commit 檢查

> **禁止事項**：
> - **禁止執行 `git add`** - 僅提供指令建議
> - **禁止執行 `git commit`** - 僅提供 commit 訊息
> - 所有 git 操作由用戶自行執行

針對**所有未提交的變更**進行 commit 前檢查。

---

## 執行流程

### 1. 查看所有變更

```bash
git status
git diff --staged
```

### 2. 執行 Pre-Commit 檢查

依照 `.claude/skills/pre-commit-check/SKILL.md` 規範執行檢查：
- Console/Alert 檢查
- 註解清理
- ESLint（可選）

### 3. 提供輸出

#### Commit 訊息建議

```
<type>(<scope>): <主題>

- 要點 1
- 要點 2
```

**Type 選項**：

| Type | 說明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 錯誤修復 |
| `refactor` | 重構 |
| `docs` | 文件更新 |
| `style` | 樣式調整 |
| `chore` | 建置/工具 |

#### Git Add 指令

```bash
git add -A
```

---

## 注意事項

- **不自動執行 `git commit`**，由用戶自行執行
- 過程中**不執行** `npm run build`
- 可執行 `npm run lint` 檢查
