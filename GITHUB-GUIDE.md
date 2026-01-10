# 🚀 Guía Completa: Subir Portfolio a GitHub

## 📋 Paso 1: Instalar Git

### Opción A: Descargar Git

1. Ve a: https://git-scm.com/download/win
2. Descarga "64-bit Git for Windows Setup"
3. Ejecuta el instalador
4. Usa las opciones por defecto (Next, Next, Next...)
5. **IMPORTANTE**: Reinicia VS Code o tu terminal después de instalar

### Opción B: Usar GitHub Desktop (Más Fácil)

1. Ve a: https://desktop.github.com/
2. Descarga GitHub Desktop
3. Instala y abre la aplicación
4. Inicia sesión con tu cuenta de GitHub
5. Salta al **Paso 3B** (GitHub Desktop)

---

## 📋 Paso 2: Crear Cuenta en GitHub (si no tienes)

1. Ve a: https://github.com/signup
2. Ingresa tu email
3. Crea una contraseña
4. Elige un username (ej: `kirianluna`)
5. Verifica tu email
6. ¡Listo!

---

## 📋 Paso 3A: Subir con Git (Línea de Comandos)

### Después de instalar Git, abre una nueva terminal:

```bash
# 1. Verificar que Git está instalado
git --version

# 2. Configurar Git (primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# 3. Inicializar repositorio
git init

# 4. Agregar todos los archivos
git add .

# 5. Hacer el primer commit
git commit -m "Portfolio optimizado - Primera versión"

# 6. Renombrar rama a main
git branch -M main
```

### Crear repositorio en GitHub:

1. Ve a: https://github.com/new
2. **Repository name**: `Portfolio-Kirian` (o el que prefieras)
3. **Description**: "Mi portfolio personal optimizado"
4. Deja todo lo demás por defecto
5. Click en **"Create repository"**

### Conectar y subir:

```bash
# 7. Conectar con GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/Portfolio-Kirian.git

# 8. Subir a GitHub
git push -u origin main
```

**Si te pide credenciales:**

- Username: tu usuario de GitHub
- Password: usa un **Personal Access Token** (no tu contraseña)
  - Créalo en: https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Selecciona "repo" scope
  - Copia el token y úsalo como password

---

## 📋 Paso 3B: Subir con GitHub Desktop (MÁS FÁCIL)

1. **Abre GitHub Desktop**
2. Click en **"Add"** → **"Add Existing Repository"**
3. Selecciona la carpeta: `C:\Users\Kirian\Desktop\Work\Portfolio-Kirian`
4. Click **"Create Repository"**
5. En "Summary", escribe: `Portfolio optimizado - Primera versión`
6. Click **"Commit to main"**
7. Click **"Publish repository"**
8. Desmarca "Keep this code private" (para que sea público)
9. Click **"Publish repository"**

**¡Listo!** Tu código está en GitHub 🎉

---

## 📋 Paso 4: Verificar en GitHub

1. Ve a: `https://github.com/TU-USUARIO/Portfolio-Kirian`
2. Deberías ver todos tus archivos
3. ¡Tu código está en la nube! ☁️

---

## 🚀 Paso 5: Deploy a Vercel (Después de GitHub)

### Opción Automática (Recomendada):

1. Ve a: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Autoriza Vercel
4. Click **"Import Project"**
5. Busca `Portfolio-Kirian`
6. Click **"Import"**
7. Vercel detecta Vite automáticamente
8. Click **"Deploy"**
9. ¡Espera 1-2 minutos! ⏱️
10. **¡Tu portfolio está online!** 🎉

Tu URL será: `https://portfolio-kirian.vercel.app`

---

## 🔄 Actualizar tu Portfolio (Futuro)

### Con Git:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

### Con GitHub Desktop:

1. Escribe descripción en "Summary"
2. Click "Commit to main"
3. Click "Push origin"

**Vercel detectará los cambios y hará deploy automáticamente** ✨

---

## ⚠️ Solución de Problemas

### "git no se reconoce como comando"

- Reinicia tu terminal/VS Code después de instalar Git
- O usa GitHub Desktop (más fácil)

### "Permission denied"

- Usa un Personal Access Token en lugar de tu contraseña
- O usa GitHub Desktop (maneja autenticación automáticamente)

### "Repository already exists"

- Usa otro nombre o elimina el repo existente en GitHub

---

## 🎯 Resumen Rápido

**Opción Más Fácil (GitHub Desktop):**

1. Instalar GitHub Desktop
2. Add Existing Repository
3. Commit → Publish
4. Vercel → Import → Deploy
5. ¡Listo! 🎉

**Opción Línea de Comandos:**

1. Instalar Git
2. `git init` → `git add .` → `git commit`
3. Crear repo en GitHub
4. `git remote add` → `git push`
5. Vercel → Import → Deploy
6. ¡Listo! 🎉

---

## 📞 ¿Necesitas Ayuda?

Dime en qué paso estás y te ayudo específicamente.

**Recomendación:** Si es tu primera vez, usa **GitHub Desktop** - es mucho más fácil y visual.
