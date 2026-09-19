![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)
# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。專案以離線可運作為目標，提供日常待辦事項的新增、整理、篩選與保存功能，並加入深色模式與基本的操作回饋。

## 線上展示

[GitHub Pages](https://weber-hsu.github.io/my_copilot_workshop/)

> 請將上方網址中的佔位文字替換成實際的 GitHub 帳號與 repository 名稱。

## 功能

- 新增待辦事項，會忽略空白輸入。
- 勾選待辦事項為已完成，完成項目會顯示刪除線並淡化文字。
- 刪除單筆待辦事項。
- 顯示整體未完成項目數量，不受目前篩選條件影響。
- 清單為空時顯示提示文字。
- 提供「全部」、「未完成」與「已完成」篩選。
- 篩選結果為空時，顯示對應提示，說明項目可能只是被篩選條件過濾。
- 篩選條件會保存至 `localStorage`，重新整理後維持上次選擇；無效值會安全回退為「全部」。
- 提供淺色與深色模式切換，按鈕會顯示對應圖示與文字。
- 使用者手動選擇的主題會保存至 `localStorage`。
- 使用者未手動選擇主題時，會跟隨作業系統的 `prefers-color-scheme` 設定。
- 提供「清除已完成」功能，沒有已完成項目時按鈕會停用。
- 清除已完成項目之前會跳出確認對話框，確認後才會批次刪除並同步更新資料。
- 使用 CSS 變數、鍵盤焦點樣式與 ARIA 標籤，支援基本的可及性需求。
- 版面採卡片式設計並支援手機螢幕的 RWD。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 不使用任何框架或第三方套件。
- 不引用外部 CDN，可直接離線開啟。
- 使用 `localStorage` 保存待辦資料、篩選條件與主題偏好。
- 使用 CSS 自訂變數集中管理顏色，並透過 `prefers-color-scheme` 支援系統主題偏好。

## 開發方式

本專案是在 GitHub Copilot 實戰工作坊中，透過以下方式逐步完成：

- 使用 GitHub Copilot Agent Mode，從需求描述開始建立待辦清單的 HTML、CSS 與原生 JavaScript。
- 使用 MCP 連接 Microsoft Learn 文件，查詢 `prefers-color-scheme` 與深色模式色彩對比等官方建議，再檢查專案的配色。
- 使用 GitHub MCP 工具讀取 issue、整理需求、建立修復分支、提交變更並建立 Pull Request。
- 使用 `.github/prompts` 中的 agentic workflow，將「讀取 issue、等待確認、修改、驗證、提交、推送與建立 PR」整理成可重複執行的協作流程。
- 透過瀏覽器實際驗證待辦操作、主題切換、篩選保存、空結果提示與批次清除行為。

## 我學到什麼

- 如何把產品需求拆解成可驗證的前端功能與使用者流程。
- 如何使用 `localStorage` 保存介面狀態，讓重新整理後仍能延續使用者選擇。
- 如何使用 `prefers-color-scheme` 與 CSS 變數設計可切換的淺色、深色主題。
- 如何透過 GitHub MCP、issue 與 Pull Request 進行有步驟的開發協作。
- 如何將重複的修 bug 流程整理成 `.github/prompts` 的 agentic workflow，並在修改前保留人工確認環節。
