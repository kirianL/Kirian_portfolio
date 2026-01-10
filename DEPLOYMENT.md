# Vercel Deployment Guide - Portfolio Kirian

## 🚀 Opción 1: Deploy desde GitHub (Recomendado)

### Paso 1: Preparar Git

```bash
# Si no tienes git inicializado
git init
git add .
git commit -m "Portfolio optimizado listo para deploy"
```

### Paso 2: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `Portfolio-Kirian` (o el que prefieras)
3. Descripción: "Mi portfolio personal optimizado"
4. **NO** marques "Initialize with README"
5. Click "Create repository"

### Paso 3: Subir a GitHub

```bash
git branch -M main
git remote add origin https://github.com/TU-USUARIO/Portfolio-Kirian.git
git push -u origin main
```

### Paso 4: Deploy en Vercel

1. Ve a https://vercel.com/signup
2. Click "Continue with GitHub"
3. Autoriza Vercel
4. Click "Import Project"
5. Importa tu repositorio `Portfolio-Kirian`
6. Vercel detectará Vite automáticamente
7. Click "Deploy" 🎉

**¡Listo!** Tu portfolio estará en: `https://portfolio-kirian.vercel.app`

---

## 🔧 Opción 2: Deploy Directo (Sin GitHub)

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Login

```bash
vercel login
```

- Selecciona tu método preferido (GitHub, GitLab, Email)
- Sigue las instrucciones en el navegador

### Paso 3: Deploy

```bash
# Desde la carpeta del proyecto
vercel
```

Responde las preguntas:

- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Tu cuenta personal
- **Link to existing project?** → `N` (No)
- **What's your project's name?** → `portfolio-kirian`
- **In which directory is your code located?** → `./`
- **Want to override the settings?** → `N` (No)

### Paso 4: Deploy a Producción

```bash
vercel --prod
```

**¡Listo!** Vercel te dará la URL de tu portfolio.

---

## 📝 Configuración Incluida

Ya creé el archivo `vercel.json` con la configuración óptima:

- ✅ Build command configurado
- ✅ Output directory correcto
- ✅ Rewrites para SPA
- ✅ Framework detectado

---

## 🎨 Dominio Personalizado (Opcional)

### Después del deploy:

1. Ve a tu proyecto en Vercel Dashboard
2. Click en "Settings" → "Domains"
3. Agrega tu dominio personalizado
4. Sigue las instrucciones de DNS

---

## 🔄 Auto-Deploy (Con GitHub)

Una vez conectado a GitHub:

- Cada `git push` → Deploy automático
- Preview deployments para branches
- Rollback instantáneo si algo falla

---

## 📊 Después del Deploy

Vercel te dará:

- 🌐 URL de producción
- 📈 Analytics gratis
- ⚡ Edge Network global
- 🔒 SSL automático
- 📱 Preview en móvil

---

## ⚠️ Troubleshooting

### Error: "Build failed"

```bash
# Verifica que el build funcione localmente
npm run build
```

### Error: "Module not found"

```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "404 on refresh"

- Ya está solucionado con `vercel.json` (rewrites)

---

## 🎯 Próximos Pasos

1. ✅ Deploy a Vercel
2. 📱 Prueba en móvil
3. 🔗 Comparte tu portfolio
4. 📊 Revisa analytics
5. 🎨 Considera dominio personalizado

---

## 📞 Soporte

- Documentación: https://vercel.com/docs
- Discord: https://vercel.com/discord
- GitHub Issues: Si algo no funciona

---

**¡Tu portfolio está listo para brillar! 🌟**
