# GameHub - React + TypeScript + Vite + Tailwind CSS + Electron

Une application de gestion de jeux moderne avec interface desktop native.

## 🚀 Scripts disponibles

### Développement Web
```bash
npm run dev          # Lance le serveur de développement web
npm run build        # Construit l'application pour la production
npm run preview      # Prévisualise la version de production
npm run lint         # Lance ESLint pour vérifier le code
```

### Application Desktop (Electron)
```bash
npm run electron-dev  # Lance l'application Electron en mode développement
npm run electron      # Lance Electron avec l'app buildée
npm run electron-dist # Build et package l'application desktop
```

## 🎮 Fonctionnalités

### Interface Web
- **Design moderne** avec Tailwind CSS
- **Animations fluides** et effets de bloom
- **Menu latéral** responsive avec navigation
- **Sections Games et Shop** avec listings interactifs
- **Menu profile** avec options de déconnexion

### Application Desktop
- **Interface native** avec Electron
- **Menu système** complet (File, Edit, View, Window, Help)
- **Raccourcis clavier** intégrés
- **Gestion des fenêtres** native
- **Sécurité renforcée** avec contextIsolation

## 🛠️ Technologies utilisées

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS avec animations personnalisées
- **UI Components**: HeadlessUI + Heroicons
- **Desktop**: Electron avec configuration sécurisée
- **Build**: Electron Builder pour le packaging

## 📁 Structure du projet

```
src/
├── App.tsx          # Composant principal avec interface GameHub
├── main.tsx         # Point d'entrée de l'application
└── index.css        # Directives Tailwind CSS

electron/
├── main.js          # Processus principal d'Electron
├── preload.js       # Script de sécurité pour le renderer
└── assets/          # Icônes et assets de l'app

Configuration:
├── tailwind.config.js    # Configuration Tailwind avec animations
├── vite.config.ts        # Configuration Vite
└── package.json          # Scripts et configuration Electron Builder
```

## 🎨 Design Features

### Effets visuels
- **Dégradés dynamiques** purple → pink
- **Effets de bloom** sur les éléments interactifs
- **Animations de hover** avec scale et glow
- **Backdrop blur** pour l'effet glassmorphism
- **Background animé** avec cercles flottants

### Interface
- **Menu latéral** avec navigation Games/Shop
- **Cartes de jeux** avec images et ratings
- **Catégories colorées** avec icônes animées
- **Menu profile** avec dropdown HeadlessUI
- **Responsive design** mobile et desktop

## 🚀 Démarrage rapide

1. **Installation des dépendances**
   ```bash
   npm install
   ```

2. **Mode développement web**
   ```bash
   npm run dev
   ```

3. **Mode développement desktop**
   ```bash
   npm run electron-dev
   ```

4. **Build pour production**
   ```bash
   npm run electron-dist
   ```

## 📦 Packaging

L'application peut être packagée pour :
- **Windows**: Installateur NSIS (.exe)
- **macOS**: Application (.dmg)
- **Linux**: AppImage (.AppImage)

## 🔧 Configuration Electron

- **Sécurité**: contextIsolation activée
- **Performance**: Optimisations pour le rendu
- **UX**: Menu système complet
- **Compatibilité**: Support multi-plateforme

## 🎯 Prochaines étapes

- [ ] Intégration d'une base de données locale
- [ ] Système d'authentification
- [ ] Gestion des jeux installés
- [ ] Notifications système
- [ ] Thèmes personnalisables
