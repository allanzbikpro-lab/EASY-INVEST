# Chngr — Guide de connexion Apple Santé

## Architecture de la solution

```
iPhone (Apple Santé)
    ↓  pesée détectée automatiquement
Raccourci iOS (Automatisation)
    ↓  POST JSON
Make.com ou n8n (webhook gratuit)
    ↓  relaye vers Chngr
App Chngr (polling 30 sec)
```

---

## Option A — Make.com (recommandé, sans code)

### 1. Créer le webhook Make

1. Créez un compte sur **make.com** (gratuit, 1000 ops/mois)
2. **Créer un scénario** → Ajouter un module → **Webhooks → Custom webhook**
3. Cliquez **Add** → donnez un nom (ex. `chngr-pesee`) → **Save**
4. Copiez l'URL webhook générée (ex. `https://hook.eu2.make.com/abcd1234...`)

### 2. Configurer le scénario Make

Ajoutez un second module **HTTP → Make a request** :
- **URL** : `https://votre-domaine.com/webhook/pesee` (ou localhost en dev)
- **Method** : POST
- **Body type** : Raw
- **Content type** : application/json
- **Request content** :
```json
{
  "userId": "{{1.userId}}",
  "date": "{{1.date}}",
  "poids": {{1.poids}}
}
```

### 3. Créer le Raccourci iOS

1. Ouvrez **Raccourcis** sur iPhone
2. **Automatisation** → **Nouvelle automatisation** → **Santé**
3. Choisissez **Poids corporel** → **Lorsque la valeur est mise à jour**
4. Ajoutez l'action **Obtenir les dernières mesures de santé** :
   - Type : **Poids corporel**
   - Limite : **1**
5. Ajoutez l'action **Obtenir les valeurs des données de santé** depuis le résultat
6. Ajoutez l'action **URL** → collez votre URL webhook Make
7. Ajoutez l'action **Obtenir le contenu de l'URL** :
   - Method : POST
   - Headers : `Content-Type: application/json`
   - Body :
```json
{
  "userId": "VOTRE_USER_ID",
  "date": "{{date du jour}}",
  "poids": {{Valeur de poids}}
}
```

> 💡 **Votre User ID** est affiché dans l'app Chngr (panneau "Connecter Apple Santé")

---

## Option B — n8n (open source, auto-hébergé)

1. Installez n8n : `npx n8n` ou via Docker
2. Créez un **Workflow** avec un nœud **Webhook** (méthode POST)
3. Ajoutez un nœud **HTTP Request** qui pointe vers votre serveur Chngr
4. Configurez le Raccourci iOS comme ci-dessus en pointant vers l'URL n8n

---

## Option C — Serveur Node.js (webhook-server.js)

Si vous hébergez vous-même :

```bash
# Installation
npm install express cors

# Lancement
node webhook-server.js

# Test
curl -X POST http://localhost:3000/webhook/pesee \
  -H "Content-Type: application/json" \
  -d '{"userId":"usr_test","date":"2025-05-15","poids":82.5}'
```

Pour exposer en HTTPS (requis pour iOS) : utilisez **ngrok** en dev,
ou déployez sur **Railway**, **Render**, ou **Fly.io** (gratuits).

---

## Format JSON attendu

```json
{
  "userId": "usr_abc123",
  "date": "2025-05-15",
  "poids": 82.5
}
```

| Champ | Type | Description |
|-------|------|-------------|
| `userId` | string | ID affiché dans Chngr |
| `date` | string | Format `YYYY-MM-DD` |
| `poids` | number | Poids en kg (ex: 82.5) |

---

## Fréquence de mise à jour

L'app Chngr interroge le backend toutes les **30 secondes**.
Dès qu'une nouvelle pesée est détectée, elle apparaît instantanément
avec une animation de surlignage vert et une notification toast.

---

## Délai typique

```
Pesée iPhone → Raccourci (~2s) → Make webhook (~1s) → Polling Chngr (≤30s)
Total : moins d'une minute
```
