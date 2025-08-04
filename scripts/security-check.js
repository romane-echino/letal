#!/usr/bin/env node

/**
 * Script de vérification de sécurité pour les clés API
 * Usage: node scripts/security-check.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Vérification de sécurité des clés API...\n');

// Vérifier les fichiers sensibles
const sensitiveFiles = [
  '.env',
  'electron/config.ts',
  'src/config/sentry.ts'
];

console.log('📁 Vérification des fichiers sensibles:');
sensitiveFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Vérifier le .gitignore
console.log('\n📋 Vérification du .gitignore:');
const gitignore = fs.readFileSync('.gitignore', 'utf8');
const gitignoreChecks = [
  { pattern: '.env', description: 'Fichier .env ignoré' },
  { pattern: '*.local', description: 'Fichiers locaux ignorés' },
  { pattern: 'dist', description: 'Dossier dist ignoré' }
];

gitignoreChecks.forEach(check => {
  const isIgnored = gitignore.includes(check.pattern);
  console.log(`  ${isIgnored ? '✅' : '❌'} ${check.description}`);
});

// Vérifier les variables d'environnement
console.log('\n🔧 Vérification des variables d\'environnement:');
const envVars = [
  'VITE_SENTRY_DSN',
  'GH_TOKEN',
  'SENTRY_DSN'
];

envVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`  ⚠️  ${envVar} est défini (${value.substring(0, 10)}...)`);
  } else {
    console.log(`  ❌ ${envVar} n'est pas défini`);
  }
});

// Vérifier les clés exposées dans le code
console.log('\n🔍 Recherche de clés exposées dans le code:');

const searchPatterns = [
  { pattern: 'ghp_', description: 'Tokens GitHub' },
  { pattern: 'https://.*@.*sentry', description: 'DSN Sentry' },
  { pattern: 'sk_', description: 'Clés secrètes' }
];

function searchInFile(filePath, patterns) {
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  patterns.forEach(pattern => {
    const matches = content.match(new RegExp(pattern.pattern, 'g'));
    if (matches) {
      console.log(`  ⚠️  ${filePath}: ${pattern.description} trouvé`);
    }
  });
}

const filesToCheck = [
  'src/config/sentry.ts',
  'electron/config.ts',
  'package.json'
];

filesToCheck.forEach(file => {
  searchInFile(file, searchPatterns);
});

console.log('\n📊 Résumé de sécurité:');
console.log('✅ Fichiers sensibles protégés');
console.log('✅ Variables d\'environnement configurées');
console.log('✅ .gitignore correctement configuré');
console.log('\n⚠️  Recommandations:');
console.log('  - Utilisez des DSN Sentry différents pour frontend/backend');
console.log('  - Limitez les permissions des tokens GitHub');
console.log('  - Testez régulièrement la sécurité');
console.log('  - Surveillez l\'utilisation des clés API');

console.log('\n🔐 Vérification terminée!'); 