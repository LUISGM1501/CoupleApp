# Nosotros 💕

App personal (solo para dos) construida con React + Vite + TypeScript + Tailwind, Supabase como backend, PWA instalable y APK generable con Capacitor.

---

## 0. Lo que hay en este repo

```
├── src/                    # Código React
│   ├── app/                # Shell: App, routes, providers
│   ├── features/           # auth, couple, memories, mood, comments
│   ├── pages/              # Una por ruta (lazy)
│   ├── shared/             # ui, hooks, lib, reutilizable
│   ├── styles/             # CSS + tokens TS
│   └── types/              # Tipos compartidos (database.ts)
├── supabase/migrations/    # 4 archivos SQL en orden
│   ├── 0001_schema.sql
│   ├── 0002_rls.sql
│   ├── 0003_functions.sql
│   └── 0004_storage.sql
├── public/
├── .github/workflows/deploy.yml
├── capacitor.config.ts
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 1. Setup Supabase (primero, antes de cualquier código)

1. Crear proyecto nuevo en https://supabase.com (tier gratuito)
2. En **Authentication → Providers → Email**: desactivá "Confirm email" para el uso personal (te ahorra tener que confirmar mails). Si la dejás activa, el signUp seguirá funcionando porque el código hace login manual después.
3. En **SQL Editor**, ejecutá los 4 archivos **en orden**:
   - `supabase/migrations/0001_schema.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/migrations/0003_functions.sql`
   - `supabase/migrations/0004_storage.sql`
4. Verificá en **Database → Tables** que aparezcan `profiles`, `couples`, `memories`, `comments`.
5. Verificá en **Storage → Buckets** que estén `memories` y `avatars` como públicos.
6. En **Project Settings → API**, copiá `Project URL` y `anon public key`. Los necesitás en `.env.local`.

---

## 2. Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Variables de entorno
cp .env.example .env.local
# editá .env.local con tus valores de Supabase

# 3. Correr en dev
npm run dev
# abre http://localhost:5173
```

El archivo `.env.local` debe tener:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_BASE_PATH=/
VITE_MOCK=false
```

> `VITE_BASE_PATH` se deja en `/` para dev y Capacitor. Para GitHub Pages **project site** (URL tipo `usuario.github.io/repo/`), poné `/repo/`. Si usás **custom domain** o **user page** (`usuario.github.io`), dejalo en `/`.

### 🎨 Modo preview (probar sin Supabase)

Para ver la app y navegar sin tener que registrarte ni crear datos reales:

```
VITE_MOCK=true
```

en `.env.local`, después `npm run dev`. Arranca directo en Home con un usuario falso ("Luis"), su pareja ("Sofi"), 5 recuerdos de ejemplo y 2 comentarios. Podés:

- navegar entre Home / Recuerdos / Perfil
- crear, editar y borrar recuerdos (persisten en memoria durante la sesión)
- cambiar de mood, editar tu nombre, cambiar avatar
- comentar y borrar comentarios

Los cambios se pierden al recargar (F5) porque es todo en memoria. Una barra amarilla arriba te recuerda que estás en modo preview. **Acordate de poner `VITE_MOCK=false` (o borrar la línea) antes de hacer build para producción.**

---

## 3. Comandos que vas a correr (en orden)

### Durante el desarrollo

```bash
npm run dev           # dev server con hot reload
npm run lint          # chequeo de tipos (tsc --noEmit)
npm run build         # build de producción a /dist
npm run preview       # previsualizá el build localmente
```

### Deploy a GitHub Pages (primera vez)

1. Crear el repo en GitHub y hacer push inicial:
   ```bash
   git init
   git add .
   git commit -m "feat: nosotros v2"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

2. En **GitHub → Settings → Pages**, elegí source: **GitHub Actions**.

3. En **Settings → Secrets and variables → Actions**, agregá:
   - Secret `VITE_SUPABASE_URL`
   - Secret `VITE_SUPABASE_ANON_KEY`
   - Variable (no secret) `VITE_BASE_PATH` = `/TU_REPO/` (con slashes al inicio y final)

4. Cada `git push origin main` desplegará solo. La primera corrida deja la URL pública en la pestaña Actions.

### Generar APK con Capacitor (opcional)

Primera vez:

```bash
# Capacitor ya está en package.json; inicializar el proyecto nativo
npm run build
npx cap add android
```

Cada vez que querés un APK nuevo:

```bash
npm run cap:build:android
# Abre Android Studio → Build → Build Bundle(s) / APK(s) → Build APK(s)
# APK queda en android/app/build/outputs/apk/debug/app-debug.apk
# Pasarlo al cel (Drive, WhatsApp, email) e instalarlo.
```

Si necesitás Android Studio, se instala gratis desde https://developer.android.com/studio.

---

## 4. Errores del v1 que ya están resueltos aquí

| Problema | Solución |
|---|---|
| Código de pareja no validable antes de auth | RPC `validate_couple_code` con `SECURITY DEFINER`, grant a `anon` |
| Fotos HEIC del iPhone | Rechazo explícito en web + cámara nativa de Capacitor en APK |
| Compresión bloqueaba el hilo | `useWebWorker: true` en `browser-image-compression` |
| Token JWT expiraba a la hora | `persistSession + autoRefreshToken: true` desde `supabase.ts` |
| Operaciones async colgadas | `withTimeout` obligatorio en cada llamada de `api.ts` |
| `catch {}` ocultando errores | Política: todo catch loguea (`console.error`) y notifica (`toast.error`) |
| Edit de recuerdos faltante | `MemoryForm` compartido entre `NewMemory` y modal en `MemoryDetail` |
| Recursión en RLS de `profiles` | Función helper `my_couple_id()` con `SECURITY DEFINER` |

---

## 5. Arquitectura

- **`features/*`** son autocontenidos (api, hooks, components). Una feature no importa de otra.
- **`pages/*`** solo componen: importan componentes de features y los arman. No tienen lógica de negocio.
- **`shared/*`** son primitivos y utilidades sin conocimiento de features.
- **Cada `api.ts`** es la única puerta a Supabase de su feature. Los componentes nunca llaman a `supabase.*` directo.
- **TanStack Query** cachea todo con `staleTime: 2min`, `gcTime: 10min`, sin refetch al focus.
- **Realtime** solo donde hace falta (Home: mood del partner + cambios en memories; MemoryDetail: comentarios).
- **Bundle splitting** por ruta (lazy) + manual chunks por librería en `vite.config.ts`.

---

## 6. Checklist antes de decir "terminado"

- [ ] Las 4 migraciones corren sin error en Supabase
- [ ] `.env.local` existe y tiene los 3 valores correctos
- [ ] `npm run dev` levanta sin warnings de env
- [ ] Registro + código + segundo usuario = pareja completa
- [ ] Subida de 10 fotos a un recuerdo sin colgarse
- [ ] Cambio de mood llega a la otra sesión en <3s (realtime)
- [ ] Edit y delete de recuerdos funcionan
- [ ] Build (`npm run build`) termina sin errores
- [ ] Deploy automático a GH Pages corre verde
- [ ] APK generado con `npm run cap:build:android` se instala en el cel

---

## 7. Notas finales

- **Edge Function:** el spec mencionaba una Edge Function para `validate_couple_code`; esta implementación la resuelve con una función SQL `SECURITY DEFINER` con `GRANT EXECUTE TO anon`, que logra exactamente lo mismo sin requerir despliegue de Deno. Si más adelante querés audit logs o rate limiting aparte, convertila en Edge Function llamando a la función SQL interna.
- **Lista de comandos resumida** está arriba en la sección 3.
- **Variables de entorno nunca al repo:** `.env` y `.env.local` ya están en `.gitignore`.
