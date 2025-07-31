# Auto-Updater pour Letal GameHub

## Configuration

L'application utilise `electron-updater` pour gérer les mises à jour automatiques via GitHub Releases.

### Prérequis

1. **Token GitHub** : Vous devez créer un token GitHub avec les permissions `repo` et `workflow`
2. **Repository public** : Le repository doit être public pour que les releases soient accessibles
3. **Configuration GitHub Actions** : Les releases sont automatiquement créées via GitHub Actions

### Configuration du Token

1. Allez sur GitHub → Settings → Developer settings → Personal access tokens
2. Créez un nouveau token avec les permissions :
   - `repo` (accès complet au repository)
   - `workflow` (pour déclencher les workflows)

### Variables d'Environnement

Ajoutez ces variables dans vos GitHub Actions secrets :

```bash
GH_TOKEN=your_github_token_here
```

### Publication d'une Release

Pour publier une nouvelle version :

1. **Incrémentez la version** dans `package.json` :
   ```json
   {
     "version": "0.0.2"
   }
   ```

2. **Commitez et poussez** les changements :
   ```bash
   git add .
   git commit -m "feat: bump version to 0.0.2"
   git push origin main
   ```

3. **GitHub Actions** va automatiquement :
   - Construire l'application
   - Créer une release GitHub
   - Publier les fichiers d'installation

### Fonctionnement de l'Auto-Updater

1. **Vérification automatique** : L'app vérifie les mises à jour au démarrage (en production)
2. **Notification** : Une notification apparaît si une mise à jour est disponible
3. **Téléchargement** : L'utilisateur peut télécharger la mise à jour
4. **Installation** : L'utilisateur peut installer la mise à jour (redémarrage automatique)

### États de l'Auto-Updater

- `idle` : Aucune vérification en cours
- `checking` : Vérification des mises à jour
- `available` : Mise à jour disponible
- `not-available` : Aucune mise à jour disponible
- `downloading` : Téléchargement en cours
- `downloaded` : Mise à jour téléchargée
- `error` : Erreur lors du processus

### Développement

En mode développement, l'auto-updater est désactivé pour éviter les conflits.

### Dépannage

1. **Vérifiez les logs** dans la console Electron
2. **Vérifiez les releases** sur GitHub
3. **Vérifiez les permissions** du token GitHub
4. **Vérifiez la configuration** dans `package.json`

### Configuration Avancée

Vous pouvez modifier la configuration dans `electron/main.cjs` :

```javascript
// Configuration de l'auto-updater
autoUpdater.autoDownload = false // Désactive le téléchargement automatique
autoUpdater.autoInstallOnAppQuit = true // Installe automatiquement au redémarrage
```

### Sécurité

- Les mises à jour sont signées par GitHub
- Les fichiers sont vérifiés avant installation
- L'auto-updater utilise HTTPS pour les téléchargements 