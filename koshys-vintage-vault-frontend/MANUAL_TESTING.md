# Manual Testing Checklist

Use this checklist before a release or after changes to navigation, collection data, responsive styles, authentication, or the admin panel.

## Test setup

- [ ] Run `npm install` if dependencies are not installed.
- [ ] Set valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` values in `.env.local`.
- [ ] Populate enough data to test pagination. The provided `supabase/seed.sql` creates 16 items per collection.
- [ ] Run `npm run dev` and open the displayed local URL.
- [ ] Open the browser console and confirm there are no unexpected errors during testing.
- [ ] Test desktop (at least 1280 px), tablet (approximately 768 px), and mobile (approximately 390 px).

## Public navigation

- [ ] **NAV-01:** Open `/`. The fixed navbar is visible and does not cover the hero content.
- [ ] **NAV-02:** Select Home, Stamps, Coins, and Postal Covers. Every link opens the correct page and active styling follows the selected page.
- [ ] **NAV-03:** Scroll each public page. There is no gap between the fixed navbar and the page header or hero.
- [ ] **NAV-04:** On mobile, open the hamburger menu. All links are readable and selectable.
- [ ] **NAV-05:** On mobile, click outside the open menu. The menu closes.
- [ ] **NAV-06:** Single-click the public logo. It returns to the homepage.
- [ ] **NAV-07:** Double-click the public logo. It opens the protected admin route or redirects to sign-in.

## Home page

- [ ] **HOME-01:** The hero logo, heading, background image, and primary action render without clipping.
- [ ] **HOME-02:** Collection cards open the correct Stamps, Coins, and Postal Covers pages.
- [ ] **HOME-03:** Four collection cards can fit across a sufficiently large desktop where applicable.
- [ ] **HOME-04:** Tablet layouts show two cards per row where applicable.
- [ ] **HOME-05:** Mobile layouts show one card per row with concise text and no horizontal scrolling.
- [ ] **HOME-06:** Buttons, prices, titles, and rarity tags remain proportionate at all target widths.

## Public collections

Repeat these cases for Stamps, Coins, and Postal Covers.

- [ ] **COL-01:** The page title and filters share the header cleanly without overlapping.
- [ ] **COL-02:** Items load from Supabase and the loading message disappears.
- [ ] **COL-03:** Each card shows its complete image, title, details, price, and rarity correctly.
- [ ] **COL-04:** Select a country. Only matching records remain and the result count updates.
- [ ] **COL-05:** Select a year. Only matching records remain.
- [ ] **COL-06:** Select CAD. Only prices beginning with `CAD $` remain.
- [ ] **COL-07:** Select Rupee. Only prices using `₹` or INR-format legacy values remain.
- [ ] **COL-08:** Combine country, year, and currency. Results satisfy every selected filter.
- [ ] **COL-09:** Search by full and partial name. Matching records appear.
- [ ] **COL-10:** Search by country, year, rarity, or description text. Matching records appear.
- [ ] **COL-11:** Search with no matches. A clear empty-state message appears.
- [ ] **COL-12:** Select Clear filters. Every field resets and the full collection returns.
- [ ] **COL-13:** With more than 12 matching records, pagination appears with the correct total and page count.
- [ ] **COL-14:** Next and Previous load the correct page; buttons are disabled at the first and last pages.
- [ ] **COL-15:** Changing a filter while on a later page returns to page 1.
- [ ] **COL-16:** Click anywhere on a card. The correct detail page opens.

## Collection details

- [ ] **DET-01:** The selected item image, title, rarity, year, country, price, and description are correct.
- [ ] **DET-02:** The rarity tag appears at the upper-right without covering the title.
- [ ] **DET-03:** A tall image is fully usable without requiring horizontal scrolling or clipping important content.
- [ ] **DET-04:** On a pointer device, click the image to enable magnification and hover across its center and edges.
- [ ] **DET-05:** The magnifier shows a genuinely enlarged image, tracks the pointer, and magnifies all border areas without leaving the image boundary.
- [ ] **DET-06:** Click the image again to disable magnification.
- [ ] **DET-07:** On mobile, tapping the image opens the enlarged view and the details remain concise.
- [ ] **DET-08:** Directly open an invalid item URL. A helpful not-found or loading-error state appears without crashing.

## Admin authentication

- [ ] **AUTH-01:** Open `/admin` while signed out. The app redirects to `/sign-in`.
- [ ] **AUTH-02:** The sign-in card and admin logo are concise, centered, and do not overflow on mobile.
- [ ] **AUTH-03:** The Back to main website link returns to `/`.
- [ ] **AUTH-04:** Submit empty or invalid credentials. An accessible error appears and the page remains usable.
- [ ] **AUTH-05:** Submit valid admin credentials. The admin page opens.
- [ ] **AUTH-06:** Select Sign out. The session ends and the app returns to sign-in.
- [ ] **AUTH-07:** After signing out, revisiting `/admin` remains protected.

## Admin navigation and layout

- [ ] **ADM-01:** On desktop, the sidebar stays fixed, with navigation at the top and Sign out at the bottom.
- [ ] **ADM-02:** Stamps, Coins, and Postal Covers switch to the correct inventory.
- [ ] **ADM-03:** Double-click the admin logo. The main website opens.
- [ ] **ADM-04:** Focus the admin logo with the keyboard and press Enter or Space. The main website opens.
- [ ] **ADM-05:** On mobile, the sidebar becomes a compact top navigation with a hamburger.
- [ ] **ADM-06:** Clicking outside the mobile admin menu closes it.
- [ ] **ADM-07:** The admin page has no public website footer.

## Admin search, filters, and pagination

- [ ] **ADMF-01:** Search matches item name, description, country, year, and rarity.
- [ ] **ADMF-02:** Country, year, and currency filters return the expected inventory.
- [ ] **ADMF-03:** Combined filters work together and Clear filters resets them.
- [ ] **ADMF-04:** The item count reports the total matching records, not just the visible page.
- [ ] **ADMF-05:** With more than eight matching records, pagination appears.
- [ ] **ADMF-06:** Next and Previous load the expected items and show the correct page number.
- [ ] **ADMF-07:** Changing a search or filter returns to page 1.
- [ ] **ADMF-08:** Filters and pagination remain usable without overlap on mobile.

## Admin add and validation

Repeat the successful add case for a stamp, coin, and postal cover.

- [ ] **ADD-01:** Select Add. A focused modal opens with enough spacing from the viewport edges.
- [ ] **ADD-02:** Close the modal using its close button, Cancel, Escape, and an outside click.
- [ ] **ADD-03:** Submit an empty form. Required-field validation prevents saving.
- [ ] **ADD-04:** Name accepts 1–40 characters and rejects or prevents more than 40.
- [ ] **ADD-05:** Country accepts 1–60 characters and rejects or prevents more than 60.
- [ ] **ADD-06:** Year accepts numbers only, from 0 through 9999.
- [ ] **ADD-07:** Price accepts a positive number with no more than two decimal places.
- [ ] **ADD-08:** CAD saves with `CAD $`; Rupee saves with `₹` and does not include `INR` in the displayed price.
- [ ] **ADD-09:** Rarity requires a valid option.
- [ ] **ADD-10:** Description accepts 10–200 characters and rejects values outside that range.
- [ ] **ADD-11:** Image rejects unsupported formats and files larger than 2 MB.
- [ ] **ADD-12:** A valid JPG, PNG, or WebP image displays a preview.
- [ ] **ADD-13:** Submit valid values. A success notification appears, the modal closes, and the new item appears in the correct collection.
- [ ] **ADD-14:** The new item is searchable and its country/year appears in filter options.

## Admin edit and delete

- [ ] **EDIT-01:** Select Edit. Existing fields, currency, and image preview are populated correctly.
- [ ] **EDIT-02:** Save changes without selecting a replacement image. The original image remains.
- [ ] **EDIT-03:** Save with a replacement image. The new image appears in admin, public list, and detail views.
- [ ] **EDIT-04:** Validation rules also prevent invalid edits.
- [ ] **EDIT-05:** Editing a value that no longer matches active filters removes it from the filtered results.
- [ ] **DEL-01:** Select Delete and cancel the confirmation. Nothing is removed.
- [ ] **DEL-02:** Confirm Delete. A success notification appears and the item disappears.
- [ ] **DEL-03:** Delete the final item on the last page. Pagination moves to the preceding valid page instead of showing a stranded empty page.

## Accessibility and regression

- [ ] **A11Y-01:** Navigate all interactive controls using only Tab, Shift+Tab, Enter, Space, and Escape.
- [ ] **A11Y-02:** Focus indicators are visible against light and dark backgrounds.
- [ ] **A11Y-03:** Images have appropriate alternative text; decorative images do not create noise.
- [ ] **A11Y-04:** Form labels, menu expanded states, dialogs, notifications, and pagination have meaningful accessible names.
- [ ] **A11Y-05:** At 200% browser zoom, content remains readable without lost controls or unintended horizontal scrolling.
- [ ] **REG-01:** Refresh every route directly. No route returns a blank page.
- [ ] **REG-02:** Test slow network mode. Loading and empty states do not flash incorrect content.
- [ ] **REG-03:** Check the browser console after the complete run. No unexpected errors or warnings are present.
- [ ] **REG-04:** Run `npm run lint` and `npm run build`; both finish successfully.

## Test record

| Field | Value |
| --- | --- |
| Tester | |
| Date | |
| Commit/build | |
| Browser and version | |
| Desktop viewport | |
| Tablet viewport | |
| Mobile viewport | |
| Supabase environment | Local / Staging / Production |
| Result | Pass / Fail / Blocked |
| Notes or issue links | |
