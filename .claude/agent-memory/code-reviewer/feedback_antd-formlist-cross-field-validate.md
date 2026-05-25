---
name: antd-formlist-cross-field-validate
description: In antd Form.List, a per-item validator that compares against sibling items does NOT auto re-validate the siblings when one changes — flag this as a realtime-validation gap
metadata:
  type: feedback
---

When a Form.List item field has a uniqueness/dup validator that reads `form.getFieldValue(listName)` and counts duplicates, only the field currently being edited re-runs its validator. Sibling items keep their stale validation state until they are individually re-validated.

**Why:** antd validates per-field on change; it has no built-in cross-field dependency for list items. Spec wording "realtime dup check" implies BOTH the new duplicate AND the original should show the error immediately.

**How to apply:** When a spec asks for realtime uniqueness across a Form.List, check for an explicit re-validation trigger — e.g. `onValuesChange`/`Form.List` `add/remove` callback calling `form.validateFields([[listName, i, fieldName], ...])` for all siblings. If absent, flag as a correctness gap (major if spec mandates realtime, minor if submit-time validation suffices). Seen in GEOQ-1392 guidance-pattern-item.part.tsx pattern_name dup validator.
