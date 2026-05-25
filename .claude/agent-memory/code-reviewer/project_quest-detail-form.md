---
name: quest-detail-form
description: How the create/edit quest form (questDetail page) is wired — single antd Form, validate-on-mount disable logic, payload build in onRegister
metadata:
  type: project
---

Quest create/edit screen lives in `src/pages/questDetail/quest-detail.page.tsx` (~1200 lines, large).

Key facts:
- One antd `Form` (`questForm`) wraps `BasicFormPart` + `InvestigationFormPart`. Field values read via helper `_getFormValue(key) = questForm.getFieldValue(key)`.
- Register button enable/disable driven by `checkDisabled()` which runs `validateFields({validateOnly:true})` on mount and after load; sets `isDisabled` from `error.errorFields.length`.
- Conditionally-rendered Form.Items are unregistered when hidden, so antd skips validating them — relied on for 2-mode guidance branching (single vs pattern-list).
- Rich-text fields (`guidance`, `mile_reward_condition`) are encodeURIComponent on submit, decodeURIComponent on edit-load. Plain length via `getPlainTextLength` (null-safe).
- GEOQ-1392: when `survey_type=location` AND `is_pole_designation_mode` ON, investigation-form renders `GuidancePatternList` (Form.List `guidance_patterns`, max 5) instead of single guidance fields; also hides 近接スポット (always, SHOW_NEARBY_SPOT=false) and QuestGuideLocationPart.
- `is_pole_designation_mode` is a TEMP flag (real owner GEOQ-1391); temp checkbox in basic-form. `USE_GUIDANCE_PATTERN_MOCK=true` in constants forces edit-load to read empty mock instead of real BE patterns (BE not built).

**Why:** FE-first delivery before BE contract exists.
**How to apply:** When reviewing quest-form changes, check the validate-on-mount path and whether new fields are conditionally rendered (unmounted = not validated). Verify payload shape in `onRegister` guidanceFields branch.
