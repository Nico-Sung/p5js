**Description**
- **Projet**: Rosace p5.js exportable en `SVG`.
- **But**: générer un dessin avec `p5.js` (plugin `p5.svg`) et pouvoir télécharger le rendu en `SVG`.

**Fichiers clés**
- `index.html`: page principale (inclut `p5.js`, `p5.svg` et les boutons d'export).
- `sketch.js`: sketch p5 qui dessine la rosace et fournit `downloadSVG()` et `downloadPNG()`.

**Prérequis**
- Navigateur moderne (Chrome/Firefox/Edge).
- Servir les fichiers via HTTP local (recommandé) pour éviter des restrictions de sécurité.

**Lancer localement**
Ouvrez un terminal dans le dossier du projet puis lancez un serveur HTTP simple :

```bash
cd "votrefichier"
python3 -m http.server 8000
```
Puis ouvrez `http://localhost:8000` dans votre navigateur.

(Optionnel) Avec `npm` et `http-server` :

```bash
npm install --global http-server
http-server -c-1 . -p 8000
```

**Utilisation**
- Cliquez sur `Télécharger SVG` pour récupérer un fichier `.svg` du dessin.
  
**Notes techniques & dépannage**
- La version de `p5.js` a été ajustée pour compatibilité avec `p5.svg`. Si vous rencontrez l'erreur `RendererSVG... __clearCanvas`, utilisez `p5.js v1.4.0`.
