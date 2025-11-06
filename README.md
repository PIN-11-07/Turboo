# ✅ To-Do List

### 🏁 Sprint 1
- [x] Publicar vehículos (Pubblicazione veicoli)  
- [ ] Ficha de vehículo (Scheda veicolo)  
- [x] Perfil (Profilo)  
- [x] Login (Accesso)  
- [x] Registro del usuario (Registrazione utente)  
- [ ] Favoritos (Preferiti)  
- [x] Feed principal (Feed principale)  

### 🚀 Sprint 2
- [ ] Incremento de Diseño, Implementación y Poblado de BD (Incremento di progettazione, implementazione e popolamento del database)  
- [ ] Comprar vehículo (Acquisto veicolo)  
- [x] Buscador por texto (Ricerca testuale)  
- [ ] Filtros de búsqueda (Filtri di ricerca)  
- [ ] Autorrelleno IA (Compilazione automatica con IA)  
- [ ] Guardar borrador (Salvataggio bozza)  
- [ ] Matchmaking de vehículos (Matchmaking dei veicoli)  
- [ ] Valoraciones (Valutazioni)  

# Entorno de desarrollo

## Requisitos
- Docker Desktop (macOS/Windows) o Docker Engine (Linux)
- Git
- Expo Go (app móvil para pruebas)

## Estructura del proyecto
Raíz principal del proyecto y significado de archivos:

```
expo_app/
├─ App.js            — Punto de entrada; configura navegación y proveedores globales
├─ app/
|   ├─ context/      — Providers y contextos (p. ej., AuthContext)
|   ├─ lib/          — Librerías internas e integraciones (p. ej., cliente Supabase)
|   ├─ services/     — Lógica para llamadas a API e integraciones backend
|   ├─ screens/      — Pantallas principales (Home, Login, Profile, ...)
|   └─ navigation/   — Configuraciones de routing (React Navigation)
├─ app.json          — Configuración de Expo
├─ .env              — Variables de entorno (NO hacer commit)
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
2. Variables de entorno
Añade las claves en `.env` (no hagas commit del archivo en el VCS):
- SUPABASE_URL
- ANON_KEY

3. Construye la imagen de Docker (instala dependencias en el contenedor):
```bash
docker compose build
```

4. Inicia los servicios en segundo plano:
```bash
docker compose up -d
```

5. Entra en el contenedor `expo` para el entorno de desarrollo:
```bash
docker compose exec expo bash
```
6. Dentro del contenedor:
```bash
npm i
apt-get update -y && apt-get upgrade -y
npx expo start --tunnel
```

7. Abre Expo Go en el dispositivo móvil y escanea el código QR mostrado por `expo start`.

Nota: la opción `--tunnel` utiliza ngrok para exponer una URL pública, útil para pruebas desde redes diferentes.


# Autenticación

## Librerías
- @supabase/supabase-js
- @react-native-async-storage/async-storage (persistencia de sesión)

## Cliente de Supabase
- Archivo: `app/lib/supabase.js`
- Usa variables de entorno y AsyncStorage para guardar/restaurar la sesión.

## AuthContext
- Archivo: `app/context/AuthContext.js`
- Gestiona `user` y `session`
- Expone `signIn`, `signUp`, `signOut`
- Suscripción a eventos de Supabase y restauración de sesión vía AsyncStorage

## Integración en la app
- En `App.js`, la app está envuelta por `<AuthProvider>` para el estado global de autenticación.
- La navegación muestra Home si está autenticado, en caso contrario Login.

## Pantalla de login
- `LoginScreen`: registro e inicio de sesión vía email/contraseña.


# Navegación

## Estructura general
1. RootNavigator → decide si muestra el área pública o privada
2. AuthNavigator → pantallas públicas (Login)
3. AppNavigator → pantallas privadas (Home, Profile, Settings)

Fragmento de decisión:
```js
{user ? <AppNavigator /> : <AuthNavigator />}
```

## Estructura de carpetas de navegación
```
app/
├── navigation/
│   ├── AuthNavigator.js        # Stack público (Login, Signup)
│   ├── AppNavigator.js         # Navegador privado (Home, Profile, Settings)
│   └── RootNavigator.js        # Router principal
├── screens/
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── ProfileScreen.js
│   └── SettingsScreen.js
└── App.js                      # Punto de entrada con AuthProvider
```

## Detalles de los navegadores
- RootNavigator: muestra `AuthNavigator` si `user` es null, en caso contrario `AppNavigator`.
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
1. Al iniciar, `AuthContext` recupera la sesión (AsyncStorage).
2. `RootNavigator` comprueba `user`:
   - Si no existe → `AuthNavigator` → `LoginScreen`
   - Si existe → `AppNavigator` → `HomeScreen`
3. Tras `signIn()`, cambia `user` → paso automático al área privada.
4. Desde `ProfileScreen`, `signOut()` → `user` null → vuelta a `LoginScreen`.


# 🧩 Tabla `listings`
La tabla listings representa la estructura de datos principal de la aplicación y contiene todos los anuncios de automóviles publicados por los usuarios. Cada fila corresponde a un vehículo puesto a la venta, con sus detalles técnicos, información de localización y metadatos de publicación.

---

#### Prompt para IA
En la base de datos tengo una tabla llamada listings con los siguientes campos principales:

id (uuid, PK)

user_id (uuid → auth.users.id)

title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, location

images (jsonb con array de URL públicas del bucket listing-images)

is_active (boolean, default true)

created_at (timestamp)

Está activa la Row Level Security con estas políticas:

Todos pueden leer los anuncios con is_active = true

Solo el propietario (auth.uid() = user_id) puede crear, modificar o borrar sus propios anuncios

---

### 🏗 Estructura

| Campo            | Tipo                              | Descripción                                                                                                                             |
| ---------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **id**           | `uuid` *(PK)*                     | Identificador único generado automáticamente (`gen_random_uuid()`).                                                                     |
| **user_id**      | `uuid` *(FK → auth.users.id)*     | Identificador del usuario propietario del anuncio. Es una clave externa que enlaza el anuncio con el sistema de autenticación Supabase. |
| **title**        | `text`                            | Título breve del anuncio (ej.: “Fiat Panda 1.2 Easy”).                                                                                  |
| **description**  | `text`                            | Descripción extendida del vehículo.                                                                                                     |
| **price**        | `numeric(12,2)`                   | Precio solicitado en euros. Controlado con la restricción `CHECK (price >= 0)`.                                                         |
| **make**         | `text`                            | Marca del vehículo (ej.: Fiat, BMW, Tesla).                                                                                              |
| **model**        | `text`                            | Modelo específico del vehículo.                                                                                                         |
| **year**         | `int`                             | Año de matriculación, con restricción de validez entre 1900 y el año actual +1.                                                         |
| **mileage**      | `int`                             | Kilometraje (km). Debe ser no negativo.                                                                                                 |
| **fuel_type**    | `text`                            | Tipo de combustible (ej.: “Gasolina”, “Diésel”, “Híbrida”, “Eléctrica”).                                                                |

| **transmission** | `text`                            | Tipo de cambio (ej.: “Manual”, “Automática”).                                                                                           |
| **doors**        | `int`                             | Número de puertas.                                                                                                                      |
| **color**        | `text`                            | Color exterior del vehículo.                                                                                                            |
| **images**       | `jsonb`                           | Array JSON de URLs públicas a las imágenes del vehículo, guardadas en el bucket de Supabase `listing-images`.                           |
| **location**     | `text`                            | Ciudad o zona geográfica donde se encuentra el vehículo.                                                                                |
| **is_active**    | `boolean` *(default `true`)*      | Indicador de si el anuncio está publicado y visible en el feed público.                                                                 |
| **created_at**   | `timestamptz` *(default `now()`)* | Timestamp de creación del anuncio, usado también para el orden cronológico del feed.                                                    |

---

### 🔐 Seguridad y políticas (RLS)

La tabla utiliza **Row Level Security (RLS)** para garantizar que cada usuario pueda gestionar solo sus propios anuncios.
Las políticas activas son las siguientes:

| Nombre de la política      | Acción   | Regla                                                                                                       |
| -------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| **Read active listings**   | `SELECT` | Permite a cualquiera (público) leer solo los anuncios donde `is_active = true`.                             |
| **Insert own listing**     | `INSERT` | Permite la inserción solo si `auth.uid() = user_id`, por lo que un usuario puede crear solo sus anuncios.   |
| **Update own listing**     | `UPDATE` | Permite la modificación solo si el anuncio pertenece al usuario logueado (`auth.uid() = user_id`).          |
| **Delete own listing**     | `DELETE` | Permite el borrado solo si el anuncio pertenece al usuario logueado (`auth.uid() = user_id`).               |

➡️  De este modo:

* Los usuarios **autenticados** pueden crear, modificar o eliminar **solo sus propios** anuncios.
* Todos (incluso no logueados) pueden **visualizar** los anuncios públicos (`is_active = true`).

---

### ⚡️ Índices y rendimiento

Para optimizar la carga del feed (ordenado por fecha descendente), existe un índice compuesto:

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
Las políticas del bucket están configuradas para que:

* **cualquiera** pueda leer (`SELECT`) los objetos, haciendo los URLs públicamente accesibles;
* **solo los usuarios autenticados** puedan subir (`INSERT`) nuevos archivos.

Cada imagen se referencia en el campo `images` de la tabla como un array JSON de strings (ejemplo):

```json
[
  "https://<project>.supabase.co/storage/v1/object/public/listing-images/panda.jpg",
  "https://<project>.supabase.co/storage/v1/object/public/listing-images/panda_interni.jpg"
]
```

---

### 🔄 Uso en el feed de la app

El feed principal de la app Expo carga los datos de esta tabla utilizando Supabase Client SDK.
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

El orden `created_at DESC, id DESC` garantiza un feed **infinito, estable y coherente**.

---

### 📦 Relaciones

* `user_id` → `auth.users.id`
  Conecta cada anuncio con el usuario autenticado que lo publicó.
* Posibles relaciones futuras:

  * `favorites` o `saved_listings` para guardar coches en favoritos;
  * `messages` para chat entre vendedor y comprador.

---

### 🧠 Resumen técnico

| Propiedad                     | Valor                                   |
| ---------------------------- | --------------------------------------- |
| **Tabla**                    | `public.listings`                       |
| **PK**                       | `id`                                    |
| **FK**                       | `user_id → auth.users.id`               |
| **RLS**                      | Activa                                  |
| **Acceso público de lectura**| Sí (`is_active = true`)                 |
| **Acceso de escritura**      | Solo propietario autenticado            |
| **Imágenes**                 | Bucket público `listing-images`         |
| **Orden del feed**           | `ORDER BY created_at DESC, id DESC`     |
| **Paginación**               | Keyset (basada en cursor)               |
| **Índice**                   | `(is_active, created_at DESC, id DESC)` |

# 🧱 Tabla `profiles`

## 1. `auth.users` (gestionada por Supabase)
- Tabla predeterminada de Supabase con la información de autenticación.
- Fuente de verdad para identidad y acceso.
- ⚙️ Gestionada internamente: no modificar manualmente.

## 2. `public.profiles`
Tabla personalizada que extiende `auth.users` con datos extra y facilita relaciones (p. ej., listings, favorites).

| Columna             | Tipo  | Descripción                                      |
| ------------------- | ----- | ------------------------------------------------ |
| `id`                | uuid  | PK, corresponde a `auth.users.id`.              |
| `profile_image_url` | text  | URL de la imagen de perfil.                     |

Relación: `id` → `auth.users(id)` (ON DELETE CASCADE).

## 3. Sincronización automática
Trigger sobre `auth.users` que llama a `public.ensure_profile()` para:
- crear el registro en `public.profiles` si falta;
- evitar duplicaciones o actualizaciones de los campos gestionados por `auth.users`.

Objetos implicados:
- 🔧 `public.ensure_profile()` (función PL/pgSQL)
- 🔔 `on_auth_user_created` (trigger sobre `auth.users`)

## 4. Seguridad (Row Level Security)

| Política                              | Operación | Regla                               |
| ------------------------------------- | --------- | ----------------------------------- |
| `Users can view their own profile`    | SELECT    | `auth.uid() = id`                   |
| `Users can update their own profile`  | UPDATE    | `auth.uid() = id`                   |

📊 Esquema lógico simplificado:
```
auth.users
   └── (trigger → ensure_profile)
        └── public.profiles
```

## Pantalla PublishScreen
`app/screens/PublishScreen.js` define un componente funcional de React Native que gestiona todo el flujo de publicación mediante hooks (`useState`, `useMemo`) y el contexto de autenticación (`useAuth`). El estado local `form` conserva los valores de entrada, mientras que `submitting`, `error` y `successMessage` controlan el feedback del proceso.

Las constantes `MAKE_OPTIONS`, `FUEL_OPTIONS` y `TRANSMISSION_OPTIONS` encapsulan las listas de valores permitidos para los campos seleccionables. La función `handleSelectorPress` decide en tiempo de ejecución si se usa `ActionSheetIOS` o un desplegable interno, y `handleOptionSelect` actualiza el estado del formulario.

La validación previa al envío se centraliza en `validateForm`. Esta rutina verifica los campos obligatorios, normaliza los números mediante `sanitizeNumber` y `sanitizeInteger`, y asegura que los datos coincidan con los tipos de la tabla (`numeric` para `price`, `int4` para `year`, `mileage` y `doors`). Si alguna regla falla, escribe un mensaje en `error` y cancela la operación.

`handleSubmit` requiere que el usuario esté autenticado (`user?.id`). Tras pasar la validación, ejecuta `supabase.from('listings').insert` con el payload completo, asignando `user_id` y `is_active: true`. Al completarse, reinicia el formulario y muestra un mensaje de éxito; si Supabase devuelve un error, este se captura y se informa en la interfaz. La vista usa `SafeAreaView`, `KeyboardAvoidingView` y un `ScrollView` con `keyboardShouldPersistTaps="handled"` para mantener el formulario operativo en dispositivos móviles.
