# Entorno de desarrollo

## Requisitos
- Docker Desktop (macOS/Windows) o Docker Engine (Linux)
- Git
- Expo Go (aplicación móvil para pruebas)

## Estructura del proyecto
Raíz principal del proyecto y archivos/significado:

```
expo_app/
├─ App.js            — Punto de entrada; configura navegación y proveedores globales
├─ app/
|   ├─ context/      — Proveedores y contextos (ej. AuthContext)
|   ├─ lib/          — Bibliotecas internas e integraciones (ej. cliente Supabase)
|   ├─ services/     — Lógica para llamadas API e integraciones backend
|   ├─ screens/      — Pantallas principales (Home, Login, Profile, ...)
|   └─ navigation/   — Configuraciones de routing (React Navigation)
├─ app.json          — Configuración Expo
├─ .env              — Variables de entorno (NO commitear)
├─ assets/           — Imágenes, iconos, fuentes
├─ index.js          — Bootstrap de la app para Expo
└─ package.json      — Dependencias y scripts
```

## Inicio rápido (desarrollo local)

1. Clona el repositorio y entra en la carpeta:
```bash
git clone https://github.com/PIN-11-07/Turboo.git
cd Turboo
```

2. Construye la imagen Docker (instala dependencias en el contenedor):
```bash
docker compose build
```

3. Inicia los servicios en segundo plano:
```bash
docker compose up -d
```

4. Entra en el contenedor `expo` para el entorno de desarrollo:
```bash
docker compose exec expo bash
```
Dentro del contenedor:
```bash
npm i
apt-get update -y && apt-get upgrade -y
npx expo start --tunnel
```

5. Abre Expo Go en el dispositivo móvil y escanea el código QR muestrado por `expo start`.

Nota: el flag `--tunnel` utiliza ngrok para exponer una URL pública, útil para probar desde redes diferentes.

## Variables de entorno
Agrega las claves en `.env` (no commitear el archivo en el VCS):
- SUPABASE_URL
- ANON_KEY


# Autenticación

## Bibliotecas
- @supabase/supabase-js
- @react-native-async-storage/async-storage (persistencia de sesión)

## Cliente Supabase
- Archivo: `app/lib/supabase.js`
- Usa variables de entorno y AsyncStorage para guardar/restaurar la sesión.

## AuthContext
- Archivo: `app/context/AuthContext.js`
- Gestiona `user` y `session`
- Expone `signIn`, `signUp`, `signOut`
- Suscripción a eventos de Supabase y restauración de sesión vía AsyncStorage

## Integración en la app
- En `App.js`, la app está envuelta en `<AuthProvider>` para estado auth global.
- La navegación muestra Home si está autenticado, de lo contrario Login.

## Pantalla de login
- `LoginScreen`: registro y acceso vía email/password.


# Navegación

## Estructura general
1. RootNavigator → decide si mostrar área pública o privada
2. AuthNavigator → pantallas públicas (Login)
3. AppNavigator → pantallas privadas (Home, Profile, Settings)

Fragmento de código decisional:
```js
{user ? <AppNavigator /> : <AuthNavigator />}
```

## Estructura de carpetas de navegación
```
app/
├── navigation/
│   ├── AuthNavigator.js        # Stack público (Login, Signup)
│   ├── AppNavigator.js         # Navegador privado (Home, Perfil, Settings)
│   └── RootNavigator.js        # Router principal
├── screens/
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── ProfileScreen.js
│   └── SettingsScreen.js
└── App.js                      # Punto d’ingresso con AuthProvider
```

## Detalles de navegadores
- RootNavigator: muestra `AuthNavigator` si `user` es null, de lo contrario `AppNavigator`.
- AuthNavigator: Stack sin header (`headerShown: false`), contiene Login.
- AppNavigator: Bottom Tab con `HomeScreen`, `ProfileScreen`, `SettingsScreen`. Acceso a `useAuth`.

## Entrada de la app
- `App.js` envuelve todo:
```js
<AuthProvider>
  <RootNavigator />
</AuthProvider>
```

## Flujo de navegación
1. All’avvio, `AuthContext` recupera la sesión (AsyncStorage).
2. `RootNavigator` verifica `user`:
   - Si está ausente → `AuthNavigator` → `LoginScreen`
   - Si está presente → `AppNavigator` → `HomeScreen`
3. Después de `signIn()`, `user` cambia → paso automático all’area privata.
4. Da `ProfileScreen`, `signOut()` → `user` null → ritorno a `LoginScreen`.


# 🧩 Tabla `listings`
La tabla listings representa la estructura de datos principal de la aplicación y contiene todos los anuncios de automóviles publicados por los usuarios. Cada fila corresponde a un vehículo puesto a la venta, con los respectivos detalles técnicos, información de localización y metadatos de publicación.

---

#### Prompt per AI
En la base de datos tengo una tabla llamada listings con los siguientes campos principales:

id (uuid, PK)

user_id (uuid → auth.users.id)

title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, location

images (jsonb con array de URLs públicas del bucket listing-images)

is_active (boolean, default true)

created_at (timestamp)

Está activa la Row Level Security con estas políticas:

Todos pueden leer los anuncios con is_active = true

Solo el propietario (auth.uid() = user_id) puede crear, modificar o eliminar sus propios anuncios

---

### 🏗 Estructura

| Campo            | Tipo                              | Descripción                                                                                                                               |
| ---------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **id**           | `uuid` *(PK)*                     | Identificador único generado automáticamente (`gen_random_uuid()`).                                                                    |
| **user_id**      | `uuid` *(FK → auth.users.id)*     | Identificativo dell’utente proprietario dell’annuncio. È una chiave esterna che collega l’annuncio al sistema di autenticazione Supabase. |
| **title**        | `text`                            | Titolo breve dell’annuncio (es. “Fiat Panda 1.2 Easy”).                                                                                   |
| **description**  | `text`                            | Descripción estesa del veicolo.                                                                                                           |
| **price**        | `numeric(12,2)`                   | Precio solicitado en euros. Controlado con restricción `CHECK (price >= 0)`.                                                                   |
| **make**         | `text`                            | Marca del vehículo (es. Fiat, BMW, Tesla).                                                                                                 |
| **model**        | `text`                            | Modelo específico del vehículo.                                                                                                            |
| **year**         | `int`                             | Año de matriculación, con restricción de validez tra 1900 e l’anno corrente +1.                                                          |
| **mileage**      | `int`                             | Chilometraggio (km). Deve essere non negativo.                                                                                            |
| **fuel_type**    | `text`                            | Tipo de combustible (es. “Gasolina”, “Diésel”, “Híbrido”, “Eléctrico”).                                                                   |
| **transmission** | `text`                            | Tipo de transmisión (es. “Manual”, “Automática”).                                                                                             |
| **doors**        | `int`                             | Número de puertas.                                                                                                                          |
| **color**        | `text`                            | Colore esterno del veicolo.                                                                                                               |
| **images**       | `jsonb`                           | Array JSON di URL pubblici alle immagini del veicolo, guardadas en el bucket Supabase `listing-images`.                                       |
| **location**     | `text`                            | Ciudad o zona geográfica donde se encuentra el vehículo.                                                                                       |
| **is_active**    | `boolean` *(default `true`)*      | Flag che indica se l’annuncio è pubblicato e visibile nel feed pubblico.                                                                  |
| **created_at**   | `timestamptz` *(default `now()`)* | Timestamp di creazione dell’annuncio, utilizzato anche per l’ordinamento cronologico nel feed.                                            |

---

### 🔐 Seguridad y políticas (RLS)

La tabla utiliza **Row Level Security (RLS)** para garantizar que cada usuario pueda gestionar solo sus propios anuncios.
Las políticas activas son las siguientes:

| Nombre de política              | Acción   | Regla                                                                                                        |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| **Read active listings** | `SELECT` | Permite a cualquiera (público) leer solo los anuncios donde `is_active = true`.                           |
| **Insert own listing**   | `INSERT` | Permette l’inserimento solo se `auth.uid() = user_id`, quindi un utente può creare soltanto i propri annunci. |
| **Update own listing**   | `UPDATE` | Permette la modifica solo se l’annuncio appartiene all’utente loggato (`auth.uid() = user_id`).               |
| **Delete own listing**   | `DELETE` | Permette la cancellazione solo se l’annuncio appartiene all’utente loggato (`auth.uid() = user_id`).          |

➡️  In questo modo:

* Gli utenti **autenticati** pueden creare, modificare o eliminare **solo sus propios** annunci.
* Todos (incluso no logueados) pueden **visualizar** los anuncios públicos (`is_active = true`).

---

### ⚡️ Índices y rendimiento

Para optimizar la carga del feed (ordenado por fecha descendente), está presente un índice compuesto:

```sql
create index listings_is_active_created_id_desc
  on public.listings (is_active, created_at desc, id desc);
```

Este índice:

* acelera la paginación basada en `created_at` + `id` (keyset pagination);
* mejora el rendimiento de las consultas usadas en el feed infinito.

---

### 🖼 Almacenamiento de imágenes

Las imágenes de los vehículos se guardan en el bucket público **`listing-images`** del módulo Supabase Storage.
Las políticas del bucket están configuradas de modo que:

* **cualquiera** pueda leer (`SELECT`) los objetos, haciendo las URLs públicamente accesibles;
* **solo los usuarios autenticados** puedan cargar (`INSERT`) nuevos archivos.

Cada imagen está referenciada en el campo `images` de la tabla como array JSON de strings (ejemplo):

```json
[
  "https://<project>.supabase.co/storage/v1/object/public/listing-images/panda.jpg",
  "https://<project>.supabase.co/storage/v1/object/public/listing-images/panda_interni.jpg"
]
```

---

### 🔄 Utilizzo nel feed dell’app

Il feed principale dell’app Expo carica i dati da questa tabella utilizando Supabase Client SDK.
Las consultas principales:

* **primera página:**

  ```ts
  .from('listings')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false })
  .order('id', { ascending: false })
  .limit(PAGE_SIZE)
  ```
* **paginación (keyset):**

  ```ts
  .or(`and(created_at.eq.${cursor.created_at},id.lt.${cursor.id}),created_at.lt.${cursor.created_at}`)
  ```

L’ordinamento su `created_at DESC, id DESC` garantiza un feed **infinito, stabile e coerente**.

---

### 📦 Relaciones

* `user_id` → `auth.users.id`
  Conecta cada anuncio all’utente autenticato que lo publicó.
* Relaciones future possibili:

  * `favorites` o `saved_listings` para guardar autos en favoritos;
  * `messages` para chat entre vendedor y comprador.

---

### 🧠 Resumen técnico

| Propiedad                       | Valor                                   |
| ------------------------------- | --------------------------------------- |
| **Tabla**                       | `public.listings`                       |
| **PK**                          | `id`                                    |
| **FK**                          | `user_id → auth.users.id`               |
| **RLS**                         | Activa                                  |
| **Acceso público en lectura**   | Sí (`is_active = true`)                 |
| **Acceso en escritura**         | Solo propietario autenticado            |
| **Imágenes**                    | Bucket público `listing-images`         |
| **Feed sorting**                | `ORDER BY created_at DESC, id DESC`     |
| **Pagination**                  | Keyset (cursor-based)                   |
| **Índice**                      | `(is_active, created_at DESC, id DESC)` |

# 🧱 Tabla `profiles`

## 1. `auth.users` (gestionada por Supabase)
- Tabla predefinida de Supabase con la información de autenticación.
- Fuente de verdad para identidad y acceso.
- ⚙️ Gestionada internamente: no modificar manualmente.

## 2. `public.profiles`
Tabla personalizada que extiende `auth.users` con datos extra y facilita las relaciones (ej. listings, favorites).

| Columna              | Tipo  | Descripción                                         |
| -------------------- | ----- | --------------------------------------------------- |
| `id`                 | uuid  | PK, corresponde a `auth.users.id`.                  |
| `profile_image_url`  | text  | URL dell’immagine profilo.                          |

Relación: `id` → `auth.users(id)` (ON DELETE CASCADE).

## 3. Sincronizzazione automatica
Trigger su `auth.users` che richiama `public.ensure_profile()` per:
- crear el registro en `public.profiles` si falta;
- evitar duplicaciones o actualizaciones de los campos gestionados por `auth.users`.

Oggetti coinvolti:
- 🔧 `public.ensure_profile()` (funzione PL/pgSQL)
- 🔔 `on_auth_user_created` (trigger su `auth.users`)

## 4. Seguridad (Row Level Security)

| Política                               | Operación | Regla                               |
| ------------------------------------ | ---------- | ------------------------------------ |
| `Users can view their own profile`   | SELECT     | `auth.uid() = id`                    |
| `Users can update their own profile` | UPDATE     | `auth.uid() = id`                    |

📊 Schema logico semplificato:
```
auth.users
   └── (trigger → ensure_profile)
        └── public.profiles
```

