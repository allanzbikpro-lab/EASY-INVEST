# PEA Terminal — Application de suivi PEA

Application PWA installable sur smartphone pour suivre ton PEA, optimiser tes achats Fortuneo, et tracker les zones d'accumulation rationnelle (ZAR).

## ✨ Fonctionnalités

- Dashboard personnalisé avec KPIs, allocation, jauge plafond PEA
- Plan d'achat optimisé Fortuneo Starter (combo Amundi Star Partners + ordre gratuit)
- Zone d'Accumulation Rationnelle avec graphiques en bougies hebdo (Yahoo Finance)
- Suivi positions, transactions, versements, dividendes
- Simulateur fiscal PEA (avant/après 5 ans)
- Données stockées localement sur le téléphone (localStorage)
- Fonctionne hors-ligne après installation (PWA)

---

## 🚀 Installation — guide pas à pas

### Étape 1 : Créer le repository GitHub

1. Va sur [github.com](https://github.com) et clique sur le **"+"** en haut à droite → **"New repository"**
2. Nomme-le `pea-terminal` (ou ce que tu veux)
3. Coche **Public** (nécessaire pour Vercel gratuit)
4. Ne coche PAS "Add a README" (on en a déjà un)
5. Clique sur **"Create repository"**

### Étape 2 : Uploader les fichiers

Le plus simple : **glisser-déposer** depuis le navigateur GitHub.

1. Sur la page de ton nouveau repo vide, clique sur **"uploading an existing file"**
2. Glisse tous les fichiers et dossiers de ce projet dans la zone (sauf `node_modules` qui n'existe pas encore)
3. En bas, écris un message de commit : `Initial commit`
4. Clique sur **"Commit changes"**

> 💡 Alternative en ligne de commande si tu préfères :
> ```bash
> git init
> git add .
> git commit -m "Initial commit"
> git branch -M main
> git remote add origin https://github.com/TON_USERNAME/pea-terminal.git
> git push -u origin main
> ```

### Étape 3 : Déployer sur Vercel (gratuit, ~2 min)

1. Va sur [vercel.com](https://vercel.com) et clique **"Sign Up"** → **"Continue with GitHub"** (autorise l'accès)
2. Une fois connecté, clique sur **"Add New..."** → **"Project"**
3. Tu verras la liste de tes repos GitHub. Clique **"Import"** à côté de `pea-terminal`
4. Vercel détecte automatiquement Vite — laisse tous les paramètres par défaut
5. Clique **"Deploy"**
6. Attends ~1 min. Vercel te donne une URL du type `pea-terminal-xxx.vercel.app`

🎉 Ton app est en ligne ! Vercel rebuilde automatiquement à chaque push GitHub.

### Étape 4 : Installer sur ton téléphone (PWA)

#### 📱 Sur iPhone (Safari)

1. Ouvre Safari et va sur ton URL Vercel (`pea-terminal-xxx.vercel.app`)
2. Appuie sur l'icône **partage** en bas (carré avec flèche vers le haut)
3. Fais défiler et choisis **"Sur l'écran d'accueil"**
4. Confirme — l'icône PEA Terminal apparaît sur ton home screen
5. Lance-la : elle s'ouvre en plein écran sans la barre d'adresse Safari, comme une vraie app

#### 🤖 Sur Android (Chrome)

1. Ouvre Chrome et va sur ton URL Vercel
2. Une bannière "Installer l'application" apparaît automatiquement → tape **"Installer"**
3. Sinon : menu **⋮** → **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**
4. L'app apparaît avec son icône dorée

---

## 🔄 Mises à jour

À chaque modification du code dans GitHub, Vercel rebuilde automatiquement et déploie la nouvelle version. Sur le téléphone, l'app se met à jour automatiquement à la prochaine ouverture (PWA + Service Worker).

---

## 💾 Données

- Toutes tes données sont stockées dans le **localStorage** du navigateur de ton téléphone
- Elles ne quittent jamais ton appareil
- ⚠️ Si tu désinstalles l'app ou changes de téléphone, tu perdras tes saisies — pense à exporter régulièrement (fonctionnalité à ajouter)

---

## 🛠️ Développement local (optionnel)

Si tu veux tester en local avant de déployer :

```bash
npm install
npm run dev
```

Puis ouvre `http://localhost:5173` dans ton navigateur.

Pour build une version production :

```bash
npm run build
npm run preview
```

---

## 📦 Structure du projet

```
pea-terminal/
├── public/              # Icônes PWA
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-512-maskable.png
│   └── apple-touch-icon.png
├── src/
│   ├── main.jsx        # Point d'entrée React
│   └── App.jsx         # Application principale (toute la logique)
├── index.html
├── package.json
├── vite.config.js      # Config Vite + PWA
├── .gitignore
└── README.md
```

---

## ⚙️ Stack technique

- **React 18** + **Vite** : build léger et rapide
- **Recharts** : graphiques (ligne, aire, camembert, barres)
- **Lucide React** : icônes
- **vite-plugin-pwa** : génération du Service Worker et manifeste PWA
- **localStorage** : persistance des données (pas de backend nécessaire)
- **Yahoo Finance API** (via proxies CORS) : cours hebdomadaires des ETF

## 📄 Notes

- Yahoo Finance peut parfois rate-limiter les requêtes — l'app essaie 3 proxies CORS en cascade (corsproxy.io, allorigins.win, codetabs.com)
- Le simulateur fiscal est indicatif et ne remplace pas un conseil fiscal professionnel
- Cours des actions à mettre à jour manuellement via le bouton "Cours" en haut
