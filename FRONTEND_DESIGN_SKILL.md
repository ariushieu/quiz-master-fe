# 🎨 Frontend Design Skill — IELTS Platform

> Bộ quy chuẩn thiết kế dành cho AI Agent sinh code FE cho nền tảng **luyện thi IELTS**.
> Chuẩn hóa theo phong cách: **Clean SaaS · Light Mode · Academic · Trustworthy**

---

## 0. QUY TRÌNH BẮT BUỘC — ĐỌC TRƯỚC, REFACTOR SAU

> ⚠️ **Agent PHẢI thực hiện đúng thứ tự này. KHÔNG được bỏ qua Bước 1.**

### Bước 1 — AUDIT (Đọc hiểu toàn bộ project)

Trước khi chạm vào bất kỳ dòng code nào, agent đọc toàn bộ codebase và xuất báo cáo:

```
📋 PROJECT AUDIT REPORT
========================

1. TECH STACK
   - Framework:  [React / Vue / Next.js / ...]
   - Styling:    [Tailwind / CSS Modules / Styled-Components / ...]
   - Router:     [React Router / Next Router / ...]
   - State:      [Redux / Zustand / Context / ...]
   - Charts:     [Recharts / Chart.js / ...]

2. CẤU TRÚC THƯ MỤC
   - Pages / Routes tìm thấy
   - Components tìm thấy
   - Shared UI hiện tại

3. CHỨC NĂNG ĐÃ CÓ — UI + logic hoạt động
   ✅ [Tên]  →  [Route / Component]

4. CHỨC NĂNG CÓ UI NHƯNG CHƯA CÓ LOGIC
   ⚠️ [Tên]  →  [Route / Component]  —  ghi chú vấn đề

5. CHỨC NĂNG CHƯA CÓ GÌ → cần MaintenancePlaceholder
   🚧 [Tên]  →  [Route dự kiến]

6. VẤN ĐỀ UI/UX HIỆN TẠI
   ❌ [Vấn đề]  →  [File liên quan]

7. KẾ HOẠCH REFACTOR
   - Sẽ sửa:      [danh sách file, thứ tự ưu tiên]
   - Sẽ tạo mới:  [danh sách file mới]
   - Giữ nguyên:  [logic / component không đụng vào]
```

**Chỉ sau khi user xác nhận báo cáo → mới bắt đầu Bước 2.**

---

### Bước 2 — REFACTOR

Thực hiện từng file theo kế hoạch đã duyệt:
- Áp design system IELTS (các section bên dưới)
- **Giữ nguyên toàn bộ logic**, chỉ thay đổi UI layer
- Chức năng chưa có → dùng `MaintenancePlaceholder` (Section 10)
- Sau mỗi file, note ngắn: đã sửa gì, giữ nguyên gì

---

### Bước 3 — HANDOFF REPORT

Sau khi refactor xong, xuất báo cáo bàn giao:

```
📦 REFACTOR COMPLETE
=====================
✅ Đã refactor:          [danh sách file]
🚧 Maintain placeholder: [chức năng + route]
⚠️  Cần follow-up:       [điểm cần backend / logic bổ sung]
📌 Breaking changes:     [thay đổi props/interface nếu có]
```

---

## 1. DESIGN PHILOSOPHY — IELTS PLATFORM

| Yếu tố | Định hướng |
|---|---|
| **Tone** | Academic · Professional · Encouraging |
| **Aesthetic** | Clean SaaS — nghiêm túc như học thuật, hiện đại như EdTech |
| **Học viên** | Lo lắng về band score — cần cảm giác "tôi đang tiến bộ" |
| **Admin/Giáo viên** | Cần xử lý dữ liệu nhanh — cần cảm giác "tôi kiểm soát được" |
| **Memorable** | Progress bar rõ ràng, badge band score nổi bật, typography dễ đọc lâu |

**Kim chỉ nam**: Mỗi element phải có lý do tồn tại. Không padding thừa, không màu sắc vô nghĩa.

---

## 2. COLOR SYSTEM

```css
:root {
  /* === PRIMARY === */
  --color-primary:        #2563EB;   /* Blue 600 — CTA, active state, accent */
  --color-primary-light:  #EFF6FF;   /* Blue 50  — icon bg, tag bg */
  --color-primary-hover:  #1D4ED8;   /* Blue 700 — hover */

  /* === NEUTRALS === */
  --color-bg:             #F4F6F9;   /* Nền tổng thể */
  --color-surface:        #FFFFFF;   /* Card, sidebar, modal */
  --color-border:         #E5E7EB;   /* Divider, input border */
  --color-border-light:   #F3F4F6;   /* Table row separator */

  /* === TEXT === */
  --color-text-primary:   #111827;   /* Heading, label quan trọng */
  --color-text-secondary: #6B7280;   /* Sub-label, placeholder */
  --color-text-muted:     #9CA3AF;   /* Timestamp, caption */

  /* === SEMANTIC === */
  --color-success:        #10B981;   /* Completed, tăng trưởng */
  --color-success-bg:     #ECFDF5;
  --color-danger:         #EF4444;   /* Failed, cảnh báo */
  --color-danger-bg:      #FEF2F2;
  --color-warning:        #F59E0B;   /* Pending */
  --color-warning-bg:     #FFFBEB;

  /* === CHART PALETTE === */
  --chart-blue:           #2563EB;
  --chart-blue-light:     #BFDBFE;   /* Area fill opacity */
  --chart-yellow:         #F59E0B;
  --chart-gray:           #D1D5DB;
}
```

**Nguyên tắc màu:**
- **60%** màu trung tính (bg, surface, border)
- **30%** màu text
- **10%** màu accent (primary, semantic)
- KHÔNG dùng gradient purple, KHÔNG dark mode nếu không được yêu cầu

**IELTS Band Score Colors — dùng nhất quán toàn app:**

```css
:root {
  /* Band score — áp dụng cho badge, progress bar, score card */
  --band-9:    #059669;   /* 9.0       — Expert         → xanh lá đậm */
  --band-8:    #10B981;   /* 8.0–8.5   — Very Good      → xanh lá */
  --band-7:    #2563EB;   /* 7.0–7.5   — Good           → xanh dương (primary) */
  --band-6:    #F59E0B;   /* 6.0–6.5   — Competent      → vàng */
  --band-5:    #F97316;   /* 5.0–5.5   — Modest         → cam */
  --band-low:  #EF4444;   /* < 5.0     — Limited        → đỏ */

  /* IELTS 4 Skills — dùng cho tag, chart, filter */
  --skill-listening: #2563EB;   /* xanh dương */
  --skill-reading:   #8B5CF6;   /* tím */
  --skill-writing:   #F59E0B;   /* vàng */
  --skill-speaking:  #10B981;   /* xanh lá */

  /* Skill bg tương ứng (cho tag/badge bg) */
  --skill-listening-bg: #EFF6FF;
  --skill-reading-bg:   #F5F3FF;
  --skill-writing-bg:   #FFFBEB;
  --skill-speaking-bg:  #ECFDF5;
}
```

**Hàm helper lấy màu band score (JS/TS):**

```js
export function getBandColor(score) {
  if (score >= 9)   return 'var(--band-9)';
  if (score >= 8)   return 'var(--band-8)';
  if (score >= 7)   return 'var(--band-7)';
  if (score >= 6)   return 'var(--band-6)';
  if (score >= 5)   return 'var(--band-5)';
  return 'var(--band-low)';
}
```

---

## 3. TYPOGRAPHY

```css
/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Plus Jakarta Sans', sans-serif;

  /* Scale */
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 14px;
  --text-md:   15px;
  --text-lg:   18px;
  --text-xl:   22px;
  --text-2xl:  28px;
  --text-3xl:  36px;

  /* Weight */
  --fw-regular:  400;
  --fw-medium:   500;
  --fw-semibold: 600;
  --fw-bold:     700;

  /* Line height */
  --lh-tight:  1.25;
  --lh-normal: 1.5;
  --lh-loose:  1.75;
}
```

**Hierarchy rules:**
- Page title: `--text-2xl / --fw-bold / --color-text-primary`
- Section title: `--text-lg / --fw-semibold`
- Card metric: `--text-3xl / --fw-bold`
- Label/Nav item: `--text-sm / --fw-medium`
- Caption/Timestamp: `--text-xs / --fw-regular / --color-text-muted`

---

## 4. SPACING & LAYOUT

```css
:root {
  /* Spacing scale (4px base) */
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;

  /* Layout */
  --sidebar-width:     260px;
  --topbar-height:     64px;
  --content-padding:   24px;
  --card-padding:      20px;
  --card-radius:       12px;
  --button-radius:     8px;
  --input-radius:      8px;
  --badge-radius:      6px;

  /* Shadows */
  --shadow-card:   0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-hover:  0 4px 12px rgba(0,0,0,0.08);
  --shadow-modal:  0 20px 60px rgba(0,0,0,0.12);
  --shadow-topbar: 0 1px 0 var(--color-border);
}
```

**Grid system:**
- Dashboard layout: CSS Grid `grid-template-columns: var(--sidebar-width) 1fr`
- Stat cards: `repeat(4, 1fr)` — responsive xuống `repeat(2, 1fr)` tại 768px
- Main content: `repeat(12, 1fr)` grid với gap `--space-6`

---

## 5. COMPONENT PATTERNS

### 5.1 Sidebar Navigation

```
Structure:
├── Logo area (height: 64px, padding: 16px 20px)
├── Nav items (padding: 10px 16px, border-radius: 8px)
│   ├── Icon (20px, color: --color-text-secondary)
│   ├── Label (14px medium)
│   └── Active state: bg --color-primary, text white, icon white
├── Divider (1px, --color-border, margin: 16px 0)
└── Bottom items (Settings, Help, Logout)

Hover: bg --color-primary-light, text --color-primary
Active: bg --color-primary, text white
```

### 5.2 Stat Cards

```
Layout: flex, align-center, gap 16px
├── Icon container: 48x48px, border-radius 12px, bg --color-primary-light
│   └── Icon: 22px, color --color-primary
├── Content:
│   ├── Value: --text-2xl, --fw-bold, --color-text-primary
│   └── Label: --text-sm, --color-text-secondary
└── Arrow icon: 16px, --color-text-muted, margin-left auto

Card: bg white, border 1px --color-border, border-radius --card-radius
      padding: 20px, box-shadow: --shadow-card
Hover: box-shadow --shadow-hover, transform translateY(-1px)
Transition: all 0.2s ease
```

### 5.3 Chart Cards

```
Header:
├── Title: --text-lg, --fw-semibold
└── Right: dropdown / date picker button

Chart area: recharts hoặc Chart.js
- Area chart: fill gradient từ --chart-blue → transparent
- Bar chart: --chart-blue và --chart-yellow xen kẽ
- Donut chart: strokeWidth 20, --chart-blue + --chart-yellow

Tooltip style:
  bg: white, border: 1px --color-border
  border-radius: 8px, box-shadow: --shadow-hover
  padding: 8px 12px, font-size: --text-sm
```

### 5.4 Data Table

```
Table container: border 1px --color-border, border-radius 10px, overflow hidden

Header row:
  bg: --color-bg, padding: 12px 20px
  font: --text-xs, --fw-semibold, --color-text-secondary, uppercase, letter-spacing 0.5px

Data row:
  padding: 14px 20px, border-bottom: 1px --color-border-light
  hover: bg #FAFAFA

Status badge:
  Completed: color --color-success, bg --color-success-bg
  Failed:    color --color-danger,  bg --color-danger-bg
  Pending:   color --color-warning, bg --color-warning-bg
  Style: padding 4px 10px, border-radius --badge-radius, font --text-xs --fw-semibold
```

### 5.5 Topbar

```
Layout: flex, align-center, height --topbar-height
        padding: 0 --content-padding
        bg: white, border-bottom: --shadow-topbar

Left: Search input
  width: 280px, height: 38px
  bg: --color-bg, border: 1px --color-border
  border-radius: 8px, padding: 0 12px
  icon: search, 16px, --color-text-muted

Right: flex gap-16
  ├── Notification bell: icon 20px + red dot badge
  ├── Divider: 1px height 24px --color-border
  └── User avatar + name + role
```

### 5.6 Buttons

```css
/* Primary */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  border-radius: var(--button-radius);
  font-size: var(--text-sm);
  font-weight: var(--fw-semibold);
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}
.btn-primary:hover  { background: var(--color-primary-hover); }
.btn-primary:active { transform: scale(0.98); }

/* Ghost / Outline */
.btn-ghost {
  background: white;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  /* same padding/radius */
}
.btn-ghost:hover { background: var(--color-bg); color: var(--color-text-primary); }
```

### 5.7 IELTS Band Score Badge

```
Dùng ở mọi nơi hiển thị điểm số: bảng kết quả, profile, leaderboard, score card

Layout: inline-flex, align-center, gap 4px
├── Score number: --text-sm, --fw-bold, màu theo getBandColor(score)
└── Container: padding 3px 10px, border-radius 20px
    background: màu band ở opacity 12% (dùng hex + "1F" hoặc rgba)

Size variants:
  sm:  font 11px, padding 2px 8px   — dùng trong table row
  md:  font 13px, padding 4px 12px  — dùng trong card
  lg:  font 20px, padding 8px 18px  — dùng trong score highlight card

Ví dụ:
  Score 7.5 → text #2563EB, bg #EFF6FF  (band-7)
  Score 5.0 → text #F97316, bg #FFF7ED  (band-5)
```

### 5.8 IELTS Skill Tag

```
Dùng để label 4 kỹ năng: Listening / Reading / Writing / Speaking

Layout: inline-flex, align-center, gap 5px
├── Dot: 6x6px, border-radius 50%, bg = --skill-[name]
└── Label: --text-xs, --fw-semibold, color = --skill-[name]
    bg = --skill-[name]-bg, padding 3px 10px, border-radius 20px

Listening → #2563EB / #EFF6FF
Reading   → #8B5CF6 / #F5F3FF
Writing   → #F59E0B / #FFFBEB
Speaking  → #10B981 / #ECFDF5
```

### 5.9 Progress Bar — Band Target

```
Dùng để hiển thị tiến độ học viên so với target band

Container: width 100%, height 8px, bg --color-border, border-radius 99px
Fill:      height 100%, border-radius 99px, bg getBandColor(currentScore)
           width = (currentScore / targetScore) * 100%
           transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1)

Label row (trên bar):
  Left:  "Band hiện tại: X.X" — --text-xs, --color-text-secondary
  Right: "Mục tiêu: X.X"     — --text-xs, --fw-semibold, --color-text-primary

Milestone dots: đánh dấu các mốc 5.0 / 6.0 / 6.5 / 7.0 / 8.0 trên bar
```

---

## 6. MOTION & INTERACTION

```css
/* Transition defaults */
* { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }

/* Page load — stagger cards */
.stat-card { animation: fadeSlideUp 0.4s ease both; }
.stat-card:nth-child(1) { animation-delay: 0.05s; }
.stat-card:nth-child(2) { animation-delay: 0.10s; }
.stat-card:nth-child(3) { animation-delay: 0.15s; }
.stat-card:nth-child(4) { animation-delay: 0.20s; }

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Sidebar nav hover */
.nav-item { transition: background 0.15s, color 0.15s; }

/* Card hover lift */
.card:hover { 
  transform: translateY(-2px); 
  box-shadow: var(--shadow-hover);
  transition: transform 0.2s, box-shadow 0.2s;
}

/* Number counter (JS) */
/* Animate metric numbers từ 0 → value trong 800ms easeOut */
```

**Nguyên tắc motion:**
- Duration: 150ms (micro) → 300ms (standard) → 500ms (page)
- Luôn dùng `ease` hoặc `cubic-bezier`, KHÔNG dùng `linear`
- Stagger delay cho list items: mỗi item +50ms
- KHÔNG animate màu sắc liên tục (pulsing) — gây mất tập trung

---

## 7. REACT COMPONENT ARCHITECTURE

```
/components
  /layout
    Sidebar.jsx        — navigation, logo, user section
    Topbar.jsx         — search, notification, avatar
    DashboardLayout.jsx — wrapper

  /ui
    Card.jsx           — base card với shadow/radius
    StatCard.jsx       — icon + metric + label
    Badge.jsx          — status badge với variant
    Button.jsx         — primary, ghost, icon variants
    Avatar.jsx         — user avatar
    Dropdown.jsx       — date range picker

  /charts
    AreaChart.jsx      — recharts AreaChart wrapper
    BarChart.jsx       — recharts BarChart wrapper
    DonutChart.jsx     — recharts PieChart wrapper

  /tables
    DataTable.jsx      — sortable table với pagination
    TableRow.jsx
```

**Tech stack ưu tiên:**
- React + Tailwind CSS (hoặc CSS Modules)
- Recharts cho data visualization
- Lucide React cho icons
- date-fns cho date formatting

---

## 8. RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
--bp-sm:  640px;
--bp-md:  768px;
--bp-lg:  1024px;
--bp-xl:  1280px;
--bp-2xl: 1536px;

/* Layout changes */
@media (max-width: 1024px) {
  /* Sidebar collapse → icon-only (64px) */
  /* Stat cards: 2 columns */
}

@media (max-width: 768px) {
  /* Sidebar: drawer overlay */
  /* Stat cards: 1 column */
  /* Charts: full width stack */
}
```

---

## 9. DO / DON'T

### ✅ DO
- Dùng `gap` thay `margin` trong flex/grid layout
- Icon containers có background màu nhạt tương ứng với màu icon
- Mọi số liệu lớn phải dùng `font-variant-numeric: tabular-nums`
- Empty state có illustration + message rõ ràng
- Loading skeleton cho cards và tables
- Tooltip đầy đủ cho chart data points
- `aria-label` cho tất cả icon buttons

### ❌ DON'T
- KHÔNG dùng `!important` trong CSS
- KHÔNG hardcode màu hex ngoài CSS variables
- KHÔNG dùng font Inter, Roboto, Arial cho heading
- KHÔNG shadow quá đậm (box-shadow đậm hơn `0 4px 12px rgba(0,0,0,0.12)`)
- KHÔNG border-radius quá lớn cho card (max 16px)
- KHÔNG dùng pure black `#000000` — dùng `#111827`
- KHÔNG mix nhiều accent color — chỉ 1 primary + semantic colors

---

## 10. MAINTAIN PLACEHOLDER — Chức năng chưa triển khai

Khi một tính năng **chưa được implement** (route chưa có, API chưa sẵn, logic chưa viết), **KHÔNG** để trống, KHÔNG ẩn menu, KHÔNG throw error. Thay vào đó render **MaintenancePlaceholder** đúng chuẩn design system.

### 10.1 Visual Design của Maintain Banner

```
┌─────────────────────────────────────────────┐
│                                             │
│   🔧  [Icon công cụ, 40px, màu primary]     │
│                                             │
│   Tính năng đang được phát triển            │  ← text-lg, fw-semibold
│   Chúng tôi đang hoàn thiện tính năng       │  ← text-sm, color-text-secondary
│   này. Vui lòng quay lại sau.               │
│                                             │
│   [ Quay về Dashboard ]                     │  ← btn-ghost
│                                             │
└─────────────────────────────────────────────┘

Style: bg white, border 1px dashed --color-border
border-radius: --card-radius, padding: 60px 40px
text-align: center, max-width: 420px, margin: 40px auto
```

### 10.2 React Component

```jsx
// components/ui/MaintenancePlaceholder.jsx
import { Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * @param {string}  title    - Tên tính năng (vd: "Quản lý người dùng")
 * @param {string}  message  - Mô tả thêm (optional)
 * @param {boolean} fullPage - true = chiếm toàn bộ content area
 */
export function MaintenancePlaceholder({
  title = 'Tính năng đang được phát triển',
  message = 'Chúng tôi đang hoàn thiện tính năng này. Vui lòng quay lại sau.',
  fullPage = true,
}) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullPage ? 'calc(100vh - var(--topbar-height) - 48px)' : '320px',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1.5px dashed var(--color-border)',
          borderRadius: 'var(--card-radius)',
          padding: '56px 48px',
          textAlign: 'center',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'var(--color-primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Wrench size={28} color="var(--color-primary)" />
        </div>

        {/* Text */}
        <h3 style={{
          fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)',
          color: 'var(--color-text-primary)', marginBottom: 8,
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
          lineHeight: 'var(--lh-normal)', marginBottom: 28,
        }}>
          {message}
        </p>

        {/* Badge tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--color-warning-bg)', color: 'var(--color-warning)',
          borderRadius: 'var(--badge-radius)',
          padding: '4px 12px', fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)', marginBottom: 24,
        }}>
          🚧 &nbsp;Đang phát triển
        </div>

        {/* CTA */}
        <div>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'white', color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--button-radius)',
              padding: '8px 18px', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--fw-medium)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--color-bg)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
          >
            ← Quay về Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 10.3 Cách dùng trong Pages / Routes

```jsx
// pages/Analytics.jsx — chưa có data/logic thật
import { MaintenancePlaceholder } from '@/components/ui/MaintenancePlaceholder';

export default function AnalyticsPage() {
  return (
    <MaintenancePlaceholder
      title="Analytics đang được phát triển"
      message="Tính năng phân tích chuyên sâu sẽ sớm ra mắt trong phiên bản tiếp theo."
    />
  );
}
```

```jsx
// Trong route config — dùng lazy wrapper để dễ swap sau:
{
  path: '/analytics',
  element: <MaintenancePlaceholder title="Analytics" />,
  // TODO: thay bằng <AnalyticsPage /> khi hoàn thiện
},
```

### 10.4 Maintain cho Section nhỏ trong Card

Khi chỉ một **phần nhỏ** trong card chưa có dữ liệu:

```jsx
// InlineMaintenanceBanner — dùng bên trong card, chart area, table
export function InlineMaintenance({ label = 'Sắp có' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '32px 20px',
      color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)',
    }}>
      <Wrench size={15} />
      <span>{label} — đang hoàn thiện</span>
    </div>
  );
}
```

### 10.5 Quy tắc bắt buộc

| Tình huống | Cách xử lý |
|---|---|
| Toàn bộ page chưa có | `<MaintenancePlaceholder fullPage />` |
| Chart chưa có API | `<InlineMaintenance label="Biểu đồ" />` trong chart wrapper |
| Button/action chưa có handler | Vẫn render button, thêm `disabled` + `title="Sắp có"` tooltip |
| Nav item chưa có route | Vẫn hiển thị trong sidebar, click → toast "Tính năng đang phát triển" |
| Form submit chưa có API | Show modal xác nhận → sau đó show toast "Đang trong quá trình phát triển" |

**KHÔNG BAO GIỜ:**
- Ẩn hoàn toàn nav item / button
- Để trang trắng hoặc 404
- Hardcode `console.log('TODO')` mà không có UI feedback
- Để người dùng bị confused không biết tính năng có tồn tại không

---

## 11. SAMPLE PROMPT TEMPLATE

Khi giao việc refactor cho AI agent, dùng template này:

```
Bạn là một frontend developer chuyên nghiệp, chuyên refactor UI/UX cho nền tảng IELTS.

=== DESIGN SYSTEM ===
[paste toàn bộ nội dung file FRONTEND_DESIGN_SKILL.md vào đây]

=== NHIỆM VỤ ===
Refactor toàn bộ giao diện của project theo design system IELTS ở trên.

=== QUY TRÌNH BẮT BUỘC ===

BƯỚC 1 — AUDIT:
Đọc toàn bộ codebase, sau đó xuất PROJECT AUDIT REPORT đầy đủ theo
đúng format trong Section 0. DỪNG LẠI và chờ tôi xác nhận trước khi làm tiếp.

BƯỚC 2 — REFACTOR (chỉ thực hiện sau khi tôi confirm):
- Refactor từng file theo kế hoạch đã duyệt
- Giữ nguyên 100% logic, chỉ thay UI layer
- Áp đúng design system: màu sắc, typography, spacing, components
- Chức năng chưa có → dùng MaintenancePlaceholder (Section 10 của design system)
- Sau mỗi file, ghi chú ngắn: đã sửa gì / giữ nguyên gì

BƯỚC 3 — HANDOFF:
Sau khi xong, xuất REFACTOR COMPLETE report theo format trong Section 0.

=== RÀNG BUỘC ===
- KHÔNG tự ý thay đổi logic, API calls, state management
- KHÔNG xóa bất kỳ chức năng nào dù chưa có UI
- KHÔNG dùng màu hardcode — luôn dùng CSS variables
- KHÔNG dùng font Inter / Roboto / Arial
- Với mọi chức năng chưa implement: render MaintenancePlaceholder, KHÔNG để trống
```

---

*Design system này được tối ưu cho nền tảng IELTS. Version 1.2*
