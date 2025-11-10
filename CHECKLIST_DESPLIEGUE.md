# ✅ Checklist de Despliegue - Sabuesos Pasto

## 📋 Pre-Despliegue

### Verificación Local
- [ ] Ejecutar `npm run check:deploy`
- [ ] Verificar que no hay errores de TypeScript
- [ ] Probar la aplicación localmente
- [ ] Verificar que el backend responde en http://localhost:3000
- [ ] Verificar que el frontend carga en http://localhost:5173

### Archivos de Configuración
- [ ] `render.yaml` existe
- [ ] `.gitignore` configurado
- [ ] `frontend/src/config/api.ts` creado
- [ ] Variables de entorno configuradas

## 🔧 Git y GitHub

### Inicializar Repositorio
- [ ] `git init` ejecutado
- [ ] `git add .` ejecutado
- [ ] `git commit -m "Preparar para despliegue"` ejecutado

### Crear Repositorio en GitHub
- [ ] Ir a https://github.com/new
- [ ] Crear repositorio "sabuesos-pasto"
- [ ] Copiar URL del repositorio

### Subir Código
- [ ] `git remote add origin [URL]` ejecutado
- [ ] `git branch -M main` ejecutado
- [ ] `git push -u origin main` ejecutado
- [ ] Código visible en GitHub

## 🚀 Render.com

### Crear Cuenta
- [ ] Ir a https://render.com
- [ ] Crear cuenta o iniciar sesión
- [ ] Conectar cuenta de GitHub

### Desplegar con Blueprint
- [ ] Click en "New" → "Blueprint"
- [ ] Seleccionar repositorio "sabuesos-pasto"
- [ ] Render detecta `render.yaml`
- [ ] Click en "Apply"

### Esperar Build
- [ ] Backend: Build iniciado
- [ ] Backend: Build completado ✅
- [ ] Frontend: Build iniciado
- [ ] Frontend: Build completado ✅

### Verificar Servicios
- [ ] `sabuesos-backend` está "Live"
- [ ] `sabuesos-frontend` está "Live"
- [ ] Copiar URL del backend
- [ ] Copiar URL del frontend

## 🔄 Configuración Post-Despliegue

### Actualizar Variables de Entorno

#### Backend
- [ ] Ir a Backend → Environment
- [ ] Actualizar `CORS_ORIGIN` con URL del frontend
- [ ] Ejemplo: `https://sabuesos-frontend.onrender.com`
- [ ] Guardar cambios
- [ ] Click en "Manual Deploy" → "Deploy latest commit"

#### Frontend
- [ ] Ir a Frontend → Environment
- [ ] Actualizar `VITE_API_URL` con URL del backend
- [ ] Ejemplo: `https://sabuesos-backend.onrender.com`
- [ ] Guardar cambios
- [ ] Click en "Manual Deploy" → "Clear build cache & deploy"

### Esperar Redespliegue
- [ ] Backend: Redespliegue completado ✅
- [ ] Frontend: Redespliegue completado ✅

## ✅ Verificación Final

### Probar Backend
- [ ] Abrir: `https://sabuesos-backend.onrender.com`
- [ ] Debe mostrar: "Pet Finder API is running!"
- [ ] Probar: `https://sabuesos-backend.onrender.com/reports`
- [ ] Debe devolver JSON con reportes

### Probar Frontend
- [ ] Abrir: `https://sabuesos-frontend.onrender.com`
- [ ] La página carga correctamente
- [ ] Se ven las tarjetas de mascotas
- [ ] El mapa funciona
- [ ] Los filtros funcionan

### Probar Autenticación
- [ ] Click en "Iniciar Sesión"
- [ ] Email: `admin@sabuesos.com`
- [ ] Password: `123456`
- [ ] Login exitoso
- [ ] Dashboard carga correctamente
- [ ] Se ven las mascotas del usuario

### Probar Funcionalidades
- [ ] Ver detalle de una mascota
- [ ] Filtrar por tipo (Perdidas/Encontradas)
- [ ] Abrir el mapa
- [ ] Ver marcadores en el mapa
- [ ] Cerrar sesión
- [ ] Registrar nuevo usuario (opcional)

## 🎯 Optimizaciones Opcionales

### Mantener Servicio Activo
- [ ] Crear cuenta en https://uptimerobot.com
- [ ] Agregar monitor para backend
- [ ] URL: `https://sabuesos-backend.onrender.com`
- [ ] Intervalo: 5 minutos
- [ ] Tipo: HTTP(s)

### Dominio Personalizado
- [ ] Comprar dominio (opcional)
- [ ] Render → Settings → Custom Domain
- [ ] Agregar dominio
- [ ] Configurar DNS

### Monitoreo
- [ ] Configurar notificaciones en Render
- [ ] Email para alertas
- [ ] Webhook para Slack/Discord (opcional)

## 📊 Post-Despliegue

### Documentación
- [ ] Guardar URLs en lugar seguro
- [ ] Documentar credenciales de admin
- [ ] Compartir URLs con equipo/cliente

### Backup
- [ ] Código en GitHub ✅
- [ ] Variables de entorno documentadas
- [ ] Configuración de Render documentada

### Monitoreo Continuo
- [ ] Revisar logs regularmente
- [ ] Verificar uptime
- [ ] Monitorear errores

## 🎉 ¡Completado!

### URLs Finales
```
Frontend: https://sabuesos-frontend.onrender.com
Backend: https://sabuesos-backend.onrender.com
```

### Credenciales Demo
```
Admin: admin@sabuesos.com / 123456
Usuario: usuario@sabuesos.com / 123456
```

### Próximos Pasos
- [ ] Compartir aplicación con usuarios
- [ ] Recopilar feedback
- [ ] Planear mejoras futuras
- [ ] Considerar upgrade a plan pagado

---

**Fecha de despliegue**: _______________
**Desplegado por**: _______________
**Versión**: 1.0.0

## 📝 Notas Adicionales

_Espacio para notas personales sobre el despliegue:_

_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
