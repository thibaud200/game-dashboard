# Nettoyage Frontend : Références et Doublons

## 🔍 Audit des Références

### Fichiers à Supprimer du Répertoire Racine
- `FIELD_MAPPING_AUDIT.md` ❌
- `FIELD_MAPPING_DOCUMENTATION.md` ❌  
- `field-inconsistencies-final.md` ❌
- `field-mapping-analysis.md` ❌
- `field-mapping-corrections.md` ❌
- `field-mapping-final.md` ❌
- `database-alignment-summary.md` ❌

### Services en Doublon
- `src/services/BGGService.ts` ⚠️ (Doublon de bggApi.ts)
- `src/services/bggApi.ts` ✅ (À conserver)

### Imports à Vérifier
- Rechercher les imports vers les anciens fichiers markdown
- Vérifier les références dans les commentaires
- Nettoyer les imports inutilisés

## 🧹 Actions de Nettoyage

### 1. Supprimer les Fichiers Obsolètes
```bash
# Fichiers markdown mixtes du répertoire racine
rm FIELD_MAPPING_AUDIT.md
rm FIELD_MAPPING_DOCUMENTATION.md  
rm field-inconsistencies-final.md
rm field-mapping-analysis.md
rm field-mapping-corrections.md
rm field-mapping-final.md
rm database-alignment-summary.md

# Service en doublon
rm src/services/BGGService.ts
```

### 2. Mettre à Jour les Références
- Tous les imports doivent pointer vers `/src/docs/`
- Vérifier les commentaires et documentation
- Nettoyer les imports inutilisés avec ESLint

### 3. Validation Post-Nettoyage
- ✅ Vérifier que l'application fonctionne
- ✅ Pas de références cassées
- ✅ Documentation accessible
- ✅ Tests passent

## 📁 Structure Frontend Finale

```
src/
├── docs/                           # 📖 Documentation frontend
│   ├── ARCHITECTURE.md
│   ├── REFACTORING_GUIDE.md  
│   └── FIELD_MAPPING_DOCUMENTATION.md
├── components/                     # 🎯 Composants (logique)
├── hooks/                          # 🔄 Hooks (logique métier)
├── views/                          # 🎨 Vues (présentation)
├── services/                       # 🌐 Services API
│   ├── ApiService.ts              # ✅ Service principal
│   └── bggApi.ts                  # ✅ Service BGG
├── types/                          # 📝 Types TypeScript
│   └── index.ts                   # ✅ Types centralisés
├── utils/                          # 🛠️ Utilitaires
├── styles/                         # 🎨 Styles
├── lib/                           # 📚 Bibliothèques
├── App.tsx                        # 🚀 Composant racine
├── index.css                      # 🎨 Styles principaux
└── README.md                      # 📖 Documentation principale
```

## ✅ Résultat Attendu

Après nettoyage, le frontend sera :
- **100% organisé** selon l'architecture Container/Presenter
- **Documentation centralisée** dans `/src/docs/`
- **Aucun doublon** de fichiers ou services
- **Références propres** sans liens cassés
- **Structure cohérente** et maintenable