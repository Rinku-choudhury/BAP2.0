# Migration Guide (Prisma Schema)

This document is for the migration team to load legacy data into the schema defined in `prisma/schema.prisma`. It focuses on the most used tables, required relationships, and conventions so the target database stays consistent.

## Environment
- Database: PostgreSQL (see `datasource db`).
- ORM: Prisma Client JS.
- Timestamps: store in UTC; ISO 8601 when seeding (`YYYY-MM-DDTHH:MM:SSZ`).
- Booleans: `true`/`false`; avoid `0/1` strings.
- Numbers: use numeric types; avoid stringified numbers.
- JSON columns: valid JSON only; keep keys/casing consistent with the code (e.g., `master_data`, `jsonData`).

## High-Level Load Order (parent before child)
1) `countries` → `states` → `cities`
2) `tbl_roles`
3) `tbl_users` (FKs: role_id, country_id, state_id, city_id)
4) Masters (core)
   - `Master`, `MasterValue`
   - `MasterDepartment`, `MasterZone`, `MasterWard`, `MasterColony`
   - `Market`, `Shops`
5) Dynamic mapping
   - `MappingHeader`, `MappingDetail`, `MasterDependency`
6) Forms and permissions
   - `tbl_forms`, `tbl_form_role_mapping`, `tbl_role_forms`
7) Services and payment
   - `tbl_services`, `PaymentDefinition`, `LateFeeRule`, `PaymentInvoice`, `PaymentTransaction`, `PaymentAllocation`, `PaymentStatusHistory`, `PaymentRefund`
   - `DemandModification`, `DayClosure`
8) Applications
   - `tbl_application_submission` (ApplicationSubmission)
   - `tbl_application_master` (ApplicationMaster) and `tbl_application_master_history`
   - `tbl_application_process_log`
9) Notifications
   - `tbl_notification_templates`, `tbl_notification_event_logs`
10) Rentals / Community Halls
    - `CommunityHall`, `CommunityHallUnavailability`, `RentalRate`, `SecurityDepositReturn`
11) Misc
    - `Holiday`, `RouteAccess`, `OtpRequest`, `DownloadToken`, `AllottedTo`, `UserJurisdiction`, `tbl_document`, `tbl_certificates`

## Key Tables and Required Fields
- `tbl_users`: `phone` and `email` are unique; `status` enum `active/inactive`; set `created_at`, `updated_at` (updated_at auto-updates).
- `tbl_roles`: unique ids auto-increment; `created_at` has default.
- `tbl_forms`: `accessRoleId` is JSON (default `[1]`).
- `ApplicationSubmission`: must have `form_id`, `master_data` in `form_values`; `status` defaults to `Pending`; `submission_on` default now; `updated_on` auto-updates.
- `ApplicationMaster`: `service_id`, `regNumber` unique, `source_submission_id`; `updated_on` auto-updates.
- `PaymentDefinition`: ties to `tbl_forms.form_id`; enums: `calculationType`, `recurrenceFrequency`, `interestType`, `PenaltyType`, `PenaltyFrequency`, `StatusType`.
- `PaymentInvoice`: unique composite `[paymentDefinitionId, regNumber, periodMonth]`; `status` enum; `periodMonth` must be a date (store first day of month).
- `PaymentTransaction`: `paymentMode`, `status` enums; link to invoice/regNumber.
- `CommunityHall`: `status` default true.
- `CommunityHallUnavailability`: requires `communityHallId`, `disabled_date`; `updated_on` auto-updates.

## Enum Values (case-sensitive)
- `Gender`: Male, Female, Other
- `UserStatus`: active, inactive
- `JurisdictionType`: WARD, ZONE, DEPARTMENT, CITY, STATE, COUNTRY
- `SubmissionStatus`: Draft, Pending, Reverted, Approved, Rejected, AppointmentConfirmed, ReadyForPayment, Paid
- `ApplicationStatus`: Draft, Pending, Forward, Reverted, Approved, Rejected, AppointmentConfirmed, ReadyForPayment, Paid, Freezed, Unfreezed
- Payment-related: `LateFeeNature` (FIXED, PERCENTAGE); `PaymentType` (FULLY_PAID, PARTIALLY_PAID); `InvoiceStatus` (UNPAID, PARTIALLY_PAID, PAID, CANCELLED); `TransactionStatus` (PENDING, SUCCESS, FAILED, REFUNDED, PARTIAL); `PaymentMode` (CASH, CHEQUE, NEFT, POS, WEB, ONLINE, UPI, RTGS); `DemandHead` (FEES, SGST, CGST, PENALTY, OTHER); `RateType` (FIX, PER_SQ_FT); `RateStatus` (ACTIVE, INACTIVE)
- Notification: `NotificationChannel` (SMS, EMAIL, BOTH); `TemplateStatus` (ACTIVE, INACTIVE); `MessageType` (SERVICE_IMPLICIT, SERVICE_EXPLICIT, PROMOTIONAL); `Provider` (AIRTEL_IQ, OTHER); `DispatchStatus` (QUEUED, SENT, FAILED)

## Defaults & Auto-Managed Columns
- Auto-increment PKs: most `id` columns.
- Timestamps: many tables have `created_at/created_on` default now; `updated_at/updated_on` uses `@updatedAt` (auto-update).
- Booleans default true/false on masters (`status`).
- JSON defaults: `tbl_forms.accessRoleId` default `[1]`.

## JSON Shape Notes
- `ApplicationSubmission.master_data` and `ApplicationMaster.master_data` store form payloads; keys are case-sensitive. For community hall bookings, code expects `requiredDate` and `communityHall` (object with `id`).
- Keep consistent key names from source to avoid downstream failures.

## Data Quality Checks Before Load
- Ensure all FKs point to existing parent rows (e.g., `user.role_id`, `applicationMaster.service_id`, `applicationSubmission.form_id`).
- Dates valid ISO; no invalid timezone strings.
- Enum values exactly match casing above.
- Unique constraints respected (e.g., `tbl_users.email/phone`, `ApplicationMaster.regNumber`, invoice composite key).

## Suggested Migration Approach
1) Extract and cleanse source data to match column names/types and enum casing.
2) Load reference data in the order above (disable app traffic during load).
3) Load transactional tables (submissions, masters, payments) with FK checks on.
4) Run spot queries to verify counts and sample joins (e.g., users per role, submissions per form, invoices per regNumber).
5) Regenerate Prisma client if schema changes (`npx prisma generate`).

## Post-Migration Validation
- Row counts vs legacy system (per table).
- Random record sampling for JSON fields (`master_data`, `form_json`).
- Verify unique indexes not violated.
- Confirm `updatedAt` fields changed only once during load (use explicit timestamps if needed).

## Contact Points
- Application forms & master data: consult form JSON owners.
- Payments: reconcile `PaymentDefinition`/`PaymentInvoice` with legacy billing.
- Community halls: ensure `requiredDate` and `communityHall.id` populated in `master_data` for bookings; set `CommunityHallUnavailability` for blackout dates.
