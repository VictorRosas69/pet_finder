#!/usr/bin/env node

/**
 * Script de verificación pre-despliegue
 * Verifica que todo esté configurado correctamente antes de desplegar
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración para despliegue...\n');

let errors = 0;
let warnings = 0;

// Verificar archivos necesarios
const requiredFiles = [
  'render.yaml',
  'package.json',
  'backend/package.json',
  'frontend/package.json',
  'backend/src/main.ts',
  'frontend/src/config/api.ts',
];

console.log('📁 Verificando archivos necesarios...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NO ENCONTRADO`);
    errors++;
  }
});

// Verificar package.json scripts
console.log('\n📦 Verificando scripts de package.json...');
const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));

const requiredScripts = {
  backend: ['build', 'start:prod'],
  frontend: ['build'],
};

if (backendPackage.scripts.build && backendPackage.scripts['start:prod']) {
  console.log('  ✅ Backend scripts configurados');
} else {
  console.log('  ❌ Backend scripts faltantes');
  errors++;
}

if (frontendPackage.scripts.build) {
  console.log('  ✅ Frontend scripts configurados');
} else {
  console.log('  ❌ Frontend scripts faltantes');
  errors++;
}

// Verificar variables de entorno
console.log('\n🔐 Verificando archivos de variables de entorno...');
if (fs.existsSync('.env.example')) {
  console.log('  ✅ .env.example existe');
} else {
  console.log('  ⚠️  .env.example no encontrado (recomendado)');
  warnings++;
}

if (fs.existsSync('frontend/.env.production')) {
  console.log('  ✅ frontend/.env.production existe');
} else {
  console.log('  ⚠️  frontend/.env.production no encontrado');
  warnings++;
}

// Verificar .gitignore
console.log('\n🚫 Verificando .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('node_modules') && gitignore.includes('.env')) {
    console.log('  ✅ .gitignore configurado correctamente');
  } else {
    console.log('  ⚠️  .gitignore puede estar incompleto');
    warnings++;
  }
} else {
  console.log('  ❌ .gitignore no encontrado');
  errors++;
}

// Verificar configuración de API
console.log('\n🌐 Verificando configuración de API...');
const apiConfig = fs.readFileSync('frontend/src/config/api.ts', 'utf8');
if (apiConfig.includes('import.meta.env.VITE_API_URL')) {
  console.log('  ✅ API configurada para usar variables de entorno');
} else {
  console.log('  ❌ API no usa variables de entorno');
  errors++;
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
  console.log('✅ Todo está listo para desplegar!');
  console.log('\n📝 Próximos pasos:');
  console.log('1. git add .');
  console.log('2. git commit -m "Preparar para despliegue"');
  console.log('3. git push origin main');
  console.log('4. Seguir la guía en DESPLIEGUE_RENDER.md');
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} error(es) encontrado(s)`);
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} advertencia(s) encontrada(s)`);
  }
  console.log('\n🔧 Por favor corrige los errores antes de desplegar.');
  process.exit(1);
}
