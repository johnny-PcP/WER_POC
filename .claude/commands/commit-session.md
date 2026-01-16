# /commit-session - 本次 Session 變更的 Commit 檢查

> **禁止事項**：
> - **禁止執行 `git add`** - 僅提供指令建議
> - **禁止執行 `git commit`** - 僅提供 commit 訊息
> - 所有 git 操作由用戶自行執行

針對**本次 session** Claude 所做的變更進行 commit 前檢查。

---

## 執行流程

### 1. 確認本次 Session 變更的檔案

回顧本次對話中 Claude 建立或修改的檔案清單。

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
git add <本次 session 變更的檔案清單>
```

---

## 注意事項

- **不自動執行 `git commit`**，由用戶自行執行
- 過程中**不執行** `npm run build`
- Commit 訊息只描述**本次 session** Claude 所做的變更
