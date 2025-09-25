# Audit des incohérences UI - Desktop Mode Clair

## 1. Couleurs
- Les stats (Players, Games, Wins) utilisent différentes couleurs (emerald, blue, purple) selon la page, mais les boutons principaux sont toujours emerald.
- Les onglets (StatsPage, GameDetailView) utilisent `bg-slate-100 text-emerald-700` pour l’onglet actif, mais certains labels restent en `text-slate-500`.
- Les boutons d’action (stats, éditer, supprimer) utilisent teal, slate, red : cohérent, mais à harmoniser avec le reste.

## 2. Fonts & Tailles
- Font principale : `text-2xl font-bold` pour les titres, cohérent.
- Font onglets : `text-lg font-semibold`, cohérent entre StatsPage et GameDetailView.
- Font labels : `text-xs text-slate-500`, cohérent.

## 3. Boutons
- Boutons "Ajouter" (haut et flottant) : emerald, cohérent sur toutes les pages.
- Boutons retour et stats : style identique, cohérent.
- Boutons d’action (stats, éditer, supprimer) : teal, slate, red, cohérent.

## 4. Onglets
- Présents uniquement sur StatsPage et GameDetailView, absents sur Players/Games.
- Structure et style harmonisés entre StatsPage et GameDetailView.

## 5. Cartes
- Cartes joueur/jeu/stats : `bg-white rounded-xl p-4 border border-slate-200 shadow-xl`, cohérent.

## 6. Inputs
- Barre de recherche : `pl-10 bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-500`, cohérent.

## 7. Dropdowns
- Menu actions mobile : `bg-white border-slate-200 text-slate-700`, cohérent.

## 8. Logique
- Ouverture des dialogs harmonisée (setAddDialogOpen(open: boolean)).
- Utilisation de composants réutilisables (Button, Input, Dialogs).

## 9. Incohérences à corriger
- Les couleurs des stats (emerald, blue, purple) pourraient être harmonisées pour plus de cohérence visuelle.
- Les onglets devraient être présents sur toutes les pages pour une navigation uniforme, ou bien retirés partout sauf là où ils sont nécessaires.
- Les labels de stats pourraient utiliser la même couleur que les boutons principaux pour renforcer la cohérence.
- Les boutons d’action pourraient adopter le style emerald pour les actions principales.
