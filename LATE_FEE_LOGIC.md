# Late Fee / Penalty Collection Logic

## Overview
Late fee (penalty) accrues on **unpaid base + tax** at **1% per month** (excluding current month).

The key principle: **Collect penalty BEFORE settling principal** to ensure the late fee amount is captured upfront.

---

## Payment Allocation Order (FIFO)

When a payment is made, it's allocated in this strict order:

1. **ARREARAMT** — Arrear amounts from previous periods
2. **FINEAMT** — Fine amounts
3. **LATEFEE** — Late fee / Penalty (collected BEFORE principal)
4. **TAX & BASE** (proportional) — Tax and Base allocated proportionally to their due amounts

### Why This Order?

- **Arrear & Fine first** — These are past obligations
- **Penalty before Principal** — Ensures late fee is collected while funds are available
- **Principal last** — After all fees are covered, remaining payment goes to base and tax

---

## Detailed Example

**Initial State (3 months pending):**

| Month | BASE | TAX | LATEFEE | Total |
|-------|------|-----|---------|-------|
| Feb 2026 | 1,200 | 213 | 0 | 1,413 |
| Jan 2026 | 500 | 100 | 14.13 | 614.13 |
| Dec 2025 | 300 | 50 | 9.52 | 359.52 |

**Total Pending: 2,386.78**

---

### Payment Sequence

#### **Payment 1: ₹30**
- Goes to LATEFEE (penalty) for Jan 2026
- Allocated: LATEFEE ₹14.13 (settled), remaining ₹15.87 → LATEFEE Dec 2025
- **Remaining balance:**
  - Jan: BASE ₹500, TAX ₹100, LATEFEE ₹0
  - Dec: BASE ₹300, TAX ₹50, LATEFEE ₹0 (partial pay ₹15.87 of ₹9.52, so fully paid)

#### **Payment 2: ₹100**
- Jan LATEFEE already paid
- Goes to proportional TAX & BASE for Jan
  - TAX ratio: 100/600 = 16.67%
  - BASE ratio: 500/600 = 83.33%
  - Allocates: TAX ₹16.67, BASE ₹83.33
- **Jan now:** BASE ₹416.67, TAX ₹83.33

#### **Payment 3: ₹200**
- Continue proportional TAX & BASE
- **Result:** Most of principal is now cleared

---

## Key Principles

✅ **Penalty collected upfront** — LATEFEE allocated before TAX/BASE
✅ **Full penalty amount shown** — User sees ₹14.13 for Jan, not a reduced amount
✅ **Prevents shortfall** — Ensures late fee is captured before principal consumes the payment
✅ **Fair allocation** — TAX & BASE settled proportionally after penalty is collected
✅ **Auditable** — Each allocation type is recorded separately

---

## Implementation

### collectPayment.js
```javascript
// Order: ARREARAMT → FINEAMT → LATEFEE → TAX & BASE

if (remaining > EPS && arrearDue > EPS) {
  alloc.ARREARAMT = pushAlloc(...);
}
if (remaining > EPS && fineDue > EPS) {
  alloc.FINEAMT = pushAlloc(...);
}
// LATEFEE: Calculated upfront on full principal
if (remaining > EPS && lateDue > EPS) {
  alloc.LATEFEE = pushAlloc(...);  // Penalty collected FIRST
}
// TAX & BASE: Only after penalty
if (remaining > EPS && (taxDue > EPS || baseDue > EPS)) {
  // Proportional allocation
}
```

### demand.js
Same FIFO order during settlement simulation:
- Loop through months in order
- Settle ARREAR, FINE, **LATEFEE**, then TAX/BASE

---

## Late Fee Calculation

**Rule Definition:**
```javascript
{
  penaltyType: "PERCENTAGE",
  penaltyRate: 1,           // 1% per month
  applyFrequency: "MONTHLY",
  graceDays: 0,
  maxPenalty: null          // No cap (or set cap value)
}
```

**Calculation:**
```
Months Overdue = months between due date and query date
Late Fee = Principal * ((1 + rate)^months - 1)
         = 1,213 * ((1.01)^1 - 1)
         = 1,213 * 0.01
         = ₹12.13
```

---

## Response Display (demand.js)

When user checks their bill, they see:
- **BASE** — Original base amount
- **TAX** — Calculated tax (18%)
- **FINE** — Any fine amount
- **ARREAR** — Arrear amount
- **LATEFEE** — Full penalty calculated on principal (shown for collection)
- **Total** — Sum of all due amounts

The LATEFEE shown is the **full calculated penalty**, not reduced by what they've paid so far.

---

## Summary

| Aspect | Old Approach | New Approach |
|--------|--------------|--------------|
| **Penalty timing** | After TAX/BASE | Before TAX/BASE |
| **Shown amount** | Reduced by payments | Full calculated penalty |
| **Collection** | Last priority | High priority |
| **Risk** | Late fee might not be collected | Late fee collected early |

