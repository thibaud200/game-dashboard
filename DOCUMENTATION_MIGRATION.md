# 📁 Documentation Réorganisée

## ⚠️ Fichiers Migrés

Les fichiers de documentation suivants ont été réorganisés dans le répertoire `/src/docs/` :

### 🔄 Migrations Effectuées

| **Ancien Fichier** | **Nouveau Emplacement** | **Description** |
|-------------------|------------------------|-----------------|
| `FIELD_MAPPING_AUDIT.md` | `/src/docs/FIELD_MAPPING_DOCUMENTATION.md` | Mapping des champs frontend/BDD |
| `FIELD_MAPPING_DOCUMENTATION.md` | `/src/docs/FIELD_MAPPING_DOCUMENTATION.md` | Documentation des correspondances |
| `src/ARCHITECTURE.md` | `/src/docs/ARCHITECTURE.md` | Architecture frontend complète |
| `src/REFACTORING_GUIDE.md` | `/src/docs/REFACTORING_GUIDE.md` | Guide de refactoring et patterns |

### 📂 Structure de Documentation Frontend

```
src/docs/
├── ARCHITECTURE.md                # Architecture complète du frontend
├── REFACTORING_GUIDE.md          # Guide de refactoring et patterns
└── FIELD_MAPPING_DOCUMENTATION.md # Mapping des champs frontend/BDD
```

### 🎯 Prochaines Étapes

1. **Supprimer les anciens fichiers** du répertoire racine
2. **Mettre à jour les références** dans le code
3. **Utiliser la nouvelle structure** pour la documentation

### 📖 Comment Accéder à la Documentation

- **Architecture** : Voir `/src/docs/ARCHITECTURE.md`
- **Refactoring** : Voir `/src/docs/REFACTORING_GUIDE.md`
- **Mapping BDD** : Voir `/src/docs/FIELD_MAPPING_DOCUMENTATION.md`

La documentation frontend est maintenant centralisée et organisée dans le répertoire source approprié.