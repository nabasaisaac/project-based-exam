# Group contributions — CineQuest (Software Construction project)

This document records **who did what** in our team implementation of **CineQuest**: a TMDB-powered movie discovery app with a **Django REST Framework** backend and **Next.js** frontend.

**Repository:** [https://github.com/nabasaisaac/project-based-exam.git](https://github.com/nabasaisaac/project-based-exam.git)

**How we worked:** Responsibilities were split by **layer and feature** (settings and migrations; API views and services; serializers and recommendations; backend tests; navbar and search; page styling and home data; marathon backend and UI; shared TypeScript types; frontend Jest tests). Each member worked on **feature branches** and integrated changes through **pull requests** into `main`, with **clear, descriptive commit messages** so contributions stay traceable for assessment.

---

## 1. KIISA Angela Grace

**Registration:** S23B23/027 · **Access:** B24258 · **Year:** 3

**Role:** Backend configuration, environment safety, and database schema alignment for real TMDB data.

**Primary files / areas**

- `backend/cinequest/settings.py`
- `backend/.env` (pattern / documentation for secrets — not committing real keys)
- `backend/movies/migrations/0001_initial.py`

**What she contributed (detail)**

- Ensured **Django project wiring** is correct so the `movies` app and related apps load reliably (including `INSTALLED_APPS` correctness).
- Configured **CORS** so the browser-originated Next.js dev server can call the API without cross-origin blocks.
- Moved sensitive values (**`SECRET_KEY`**, TMDB key) toward **environment-based configuration** instead of hard-coding, which supports local development and future deployment.
- Adjusted the **initial migration** so model fields (notably **`Movie.title` max length**) accommodate long titles from TMDB without truncation or import failures.

---

## 2. KISUZE Gareth Neville

**Registration:** S23B23/029 · **Access:** B24260 · **Year:** 3

**Role:** Backend REST API views — bug fixes, HTTP semantics, shared response handling, and maintainability.

**Primary files / areas**

- `backend/movies/views.py`

**What he contributed (detail)**

- Aligned **read-only** operations (e.g. search, trending lists) with **GET** semantics where appropriate, matching REST expectations and typical caching behaviour.
- Introduced or extended a **shared pagination helper** for TMDB list-style responses so JSON shape (results, page, totals) stays **consistent** across endpoints.
- Improved **readability**: clearer variable names, **docstrings** on key view functions, and removal of **dead or duplicate** code paths (e.g. redundant comparison logic) so the API surface is easier to review and extend.

---

## 3. NABASA Isaac

**Registration:** M23B23/043 · **Access:** B22448 · **Year:** 3

**Role:** TMDB/Wikipedia integration layer, serializers, and recommendation engine correctness.

**Primary files / areas**

- `backend/movies/services/tmdb_service.py`
- `backend/movies/serializers.py`
- `backend/recommendations/services/engine.py`

**What he contributed (detail)**

- Hardened **TMDB** and **Wikipedia** related logic (search/query construction, safer URL handling using **`urllib.parse`** instead of deprecated quoting patterns).
- Fixed **recommendation engine** query parameters so they match **TMDB’s expected filter names** (e.g. vote-count style parameters); incorrect names can silently drop filters.
- Relaxed or corrected **serializer** behaviour (e.g. optional fields / sensible defaults such as **`genre_ids`**) to reduce validation noise for partial payloads from the client.
- Added **module-level documentation** where it helps the next developer understand integration boundaries quickly.

---

## 4. ITUNGO Agaba

**Registration:** M23B23/018 · **Access:** B20715 · **Year:** 3

**Role:** Backend automated tests — models, serializers, and HTTP API contracts.

**Primary files / areas**

- `backend/movies/tests.py`

**What he contributed (detail)**

- Wrote **unit / API tests** covering **models** and **serializers** to lock in expected constraints and serialization shapes.
- Added tests for key **endpoints** (including **search**, **trending**, **mood**, and **marathon** routes) asserting **status codes** and representative **JSON** structure.
- Tests act as **living documentation** of the API for the frontend team and catch regressions when views or serializers change.

---

## 5. MAGOOLA Angela

**Registration:** M24B23/047 · **Access:** B28735 · **Year:** 2

**Role:** Global navigation, search experience, and shared UI components.

**Primary files / areas**

- `frontend/src/components/Navbar.tsx`
- `frontend/src/components/SearchModal.tsx`
- `frontend/src/components/PersonalizedSection.tsx`
- `frontend/src/components/MovieCard.tsx`

**What she contributed (detail)**

- Improved **navbar** behaviour and discoverability (including entry points relevant to project features such as **Movie Night / marathon**).
- Implemented or refined **search UX** (e.g. **Ctrl+K** style shortcut) with **single, de-duplicated** keyboard handling to avoid double triggers.
- Cleaned **imports** and small **layout** issues (including **`next/image`** usage) so cards and sections render predictably across viewports.

---

## 6. KIRABO Esther

**Registration:** S24B23/045 · **Access:** B30102 · **Year:** 2

**Role:** Frontend styling reliability (Tailwind), home page data handling, and carousel/grid polish.

**Primary files / areas**

- `frontend/src/components/MoodTeaser.tsx`
- `frontend/src/components/GenreGrid.tsx`
- `frontend/src/components/MovieCarousel.tsx`
- `frontend/src/app/layout.tsx`
- `frontend/src/app/page.tsx`

**What she contributed (detail)**

- Addressed **Tailwind JIT** constraints (e.g. **statically visible** class strings for hover/active states) so styles are not stripped at build time.
- Fixed **home page** handling of **trending** API payloads (including cases where the client must read a **`.results`** list) to avoid runtime errors when the wrapper shape differs.
- Tidied **layout** typing (e.g. **`ReactNode`**) and removed duplicate utility patterns where they caused noise or inconsistency.

---

## 7. RUGABA Adrian Asiimwe

**Registration:** S24B23/054 · **Access:** B30111 · **Year:** 2

**Role:** **Movie Night / marathon** frontend — user flow, timeline/results UI, and API wiring.

**Primary files / areas**

- `frontend/src/app/marathon/page.tsx`
- `frontend/src/app/movie/[id]/page.tsx`
- `frontend/src/lib/api.ts`

**What he contributed (detail)**

- Built the **marathon planner** experience: theme selection, movie count, and a clear **results / timeline** presentation after generation.
- Centralised HTTP calls (**theme list**, **generate marathon**) in the **API client** layer for consistency with the rest of the app.
- Improved **local development robustness** (e.g. safe **`API_BASE`** fallback) so detail pages and API calls behave when environment variables differ between machines.

---

## 8. NAKIWALA Josephine

**Registration:** M24B23/044 · **Access:** B29182 · **Year:** 2

**Role:** Marathon **backend** feature (themes + generation endpoints), URL routing, and **TypeScript** types shared with the UI.

**Primary files / areas**

- `backend/movies/views.py` (marathon-related views / configuration)
- `backend/movies/urls.py`
- `frontend/src/types/movie.ts`

**What she contributed (detail)**

- Defined **marathon theme metadata** (e.g. curated **`MARATHON_THEMES`** or equivalent) consumable by the frontend list UI.
- Exposed **URL routes** for listing themes vs generating a line-up, aligned with Adrian’s marathon page.
- Extended **shared types** (e.g. **watchlist-related** shapes) so the frontend matches backend JSON contracts and editors catch mistakes early.

---

## 9. MUTEGEKI James

**Registration:** M24B23/007 · **Access:** B27501 · **Year:** 2

**Role:** Frontend **test infrastructure** (Jest + TypeScript) and initial test suites.

**Primary files / areas**

- `frontend/jest.config.js`
- `frontend/tsconfig.jest.json`
- `frontend/src/__tests__/`

**What he contributed (detail)**

- Configured **Jest** with **TypeScript** support and **`@/` path aliases** consistent with Next.js imports.
- Added tests for **utilities** (e.g. runtime helpers, poster URL helpers), **components** such as **`MovieCard`**, and **types / setup** where appropriate.
- Used **jest-dom**-style assertions so component behaviour is verified in a realistic DOM environment as the UI evolves.

---

## Maintenance note

If the codebase moves (files renamed or split), update the **Primary files / areas** lines above to match the repository **at submission time**. The **What … contributed** bullets describe the **substance** of each member’s work and should remain accurate even if paths shift slightly.
