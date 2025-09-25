# 🗺️ Roadmap Board Game Dashboard

*Dernière mise à jour : Septembre 2025*

## 🎯 Stratégie Smart
Exploiter au maximum le code existant des projets [boardGameScore](https://github.com/thibaud200/boardGameScore) et [board-game-scorekeep](https://github.com/thibaud200/board-game-scorekeep) plutôt que de repartir de zéro.

---

## ✅ Terminé

### Architecture & Infrastructure
- Architecture frontend complète (Container/Presenter, modulaire, documentation centralisée)
- Backend API RESTful (CRUD, validation Zod, Express)
- Normalisation BDD, optimisation SQL, schémas relationnels
- Responsive design, navigation contextuelle, design system moderne (React 19, Radix UI, Tailwind CSS, shadcn/ui)
- Dashboard analytics, menu principal, breadcrumbs

### Fonctionnalités Core
- Gestion joueurs et jeux avancée (CRUD, stats, recherche, profils, intégration BGG API)
- Sessions de jeu sophistiquées (création, scoring, sauvegarde, types multiples)
- Extensions/personnages (CRUD, modales, intégration contextuelle)
- Intégration BGG avancée (API service complet, import automatique, détection modes de jeu)
- Recherche & découverte (multi-critères, filtres avancés, interface BGG)
- Analytics avancé (dashboard, métriques, graphiques prêts)
- Icônes cohérentes, notifications utilisateur

### Tests & Qualité
- Infrastructure tests solide (Vitest, RTL, MSW, 31/31 tests passent, scripts manuels)

---

## 🔄 En cours / Partiellement fait

### Backend & Données
- BGG base de données : stockage partiel des métadonnées étendues (certains champs manquants)
- Service UltraBoardGames : service placeholder non fonctionnel, mapping à copier/adapter
- Cache BGG local : à implémenter (localStorage + expiration)
- Système migration automatique : versioning schema sécurisé à finaliser


### Frontend & UX
- Thème sombre/clair : interface et couleurs prêtes, manque ThemeProvider et persistance localStorage (Provider React Context, toggle, persistance utilisateur)
- Harmonisation UI/UX globale : audit complet réalisé (desktop/mobile, sombre/clair), fichiers d’incohérences centralisés, corrections à appliquer (couleurs stats, onglets, labels, boutons d’action)
- Extraction de composants communs à finaliser (onglets, boutons, cartes)
- Graphiques temporels : infrastructure prête, visualisations à implémenter
- Sélection personnages en session : détection en place, interface sélection manquante

### Tests
- Tests avancés : migration vers structure organisée, extension coverage 50+, E2E, mocks sophistiqués, fixtures réalistes
- Tests performance : benchmarks et optimisation à compléter

---


## ❌ À faire / Priorité immédiate

- Appliquer les corrections d’incohérence UI identifiées (voir fichiers d’audit)
- Finaliser extraction et utilisation des composants communs (onglets, boutons, cartes)
- Finaliser propagation du thème sombre/clair sur toutes les pages et dialogs (ThemeProvider, persistance)
- Copier et adapter le service UltraBoardGames depuis boardGameScore
- Implémenter cache BGG local pour limiter les appels API
- Copier et adapter le formulaire BGG pré-import depuis board-game-scorekeep
- Migrer et organiser l’infrastructure de tests pour atteindre 50+ tests et structure mature
- Implémenter visualisations graphiques temporelles (Recharts)
- Finaliser interface sélection personnages en session

---

## 📋 Ressources à réutiliser

### boardGameScore
- Service complet : `backend/src/services/externalGameDataService.ts`
- Mapping BGG ID → UltraBoardGames slug déjà fait

### board-game-scorekeep
- Tests complets : 52/52 ✅ avec Jest + React Testing Library
- BGG schema étendu : Tous les champs manquants dans votre DB
- Formulaire BGG : Édition complète avant import

---

## 💡 Plan d’action smart
1. Copier service UltraBoardGames de boardGameScore
2. Ajouter champs BGG manquants de board-game-scorekeep
3. Porter infrastructure tests complète
4. Cache BGG et formulaire pré-import
5. Finitions UX (thème, graphiques)

---

## 📊 Légende

**Impact Projet**
- ⭐ Faible : Amélioration mineure
- ⭐⭐ Moyen : Amélioration notable
- ⭐⭐⭐ Élevé : Transformation significative

**Effort Développement**
- 🔨 Faible : 1-3 jours
- 🔨🔨 Moyen : 1 semaine
- 🔨🔨🔨 Élevé : 2-3 semaines
- 🔨🔨🔨🔨 Très élevé : 1+ mois

**État Avancement**
- ✅ Terminé et fonctionnel
- 🔄 En cours ou partiellement fait
- ❌ Pas commencé
- [ ] À faire dans les phases futures

---

*Prochaine révision : Octobre 2025 (post-implémentation priorités immédiates)*