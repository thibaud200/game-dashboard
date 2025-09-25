# Audit des incohérences UI - Desktop Mode Sombre

## 1. Couleurs
- Les stats (Players, Games, Wins) sont toutes blanches, mais les boutons principaux restent emerald.
- Les onglets (StatsPage, GameDetailView) utilisent `bg-slate-800 text-emerald-400` pour l’onglet actif, mais certains labels restent en `text-white/60`.
- Les boutons d’action (stats, éditer, supprimer) utilisent teal, white, red : cohérent, mais à harmoniser avec le reste.

## 2. Fonts & Tailles
- Font principale : `text-2xl font-bold` pour les titres, cohérent.
- Font onglets : `text-lg font-semibold`, cohérent entre StatsPage et GameDetailView.
- Font labels : `text-xs text-white/60`, cohérent.

## 3. Boutons
- Boutons "Ajouter" (haut et flottant) : emerald, cohérent sur toutes les pages.
- Boutons retour et stats : style identique, cohérent.
- Boutons d’action (stats, éditer, supprimer) : teal, white, red, cohérent.

## 4. Onglets
- Présents uniquement sur StatsPage et GameDetailView, absents sur Players/Games.
- Structure et style harmonisés entre StatsPage et GameDetailView.

## 5. Cartes
- Cartes joueur/jeu/stats : `bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl`, cohérent.

## 6. Inputs
- Barre de recherche : `pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60`, cohérent.

## 7. Dropdowns
- Menu actions mobile : `bg-slate-800 border-slate-700 text-white`, cohérent.

## 8. Logique
- Ouverture des dialogs harmonisée (setAddDialogOpen(open: boolean)).
- Utilisation de composants réutilisables (Button, Input, Dialogs).

## 9. Incohérences à corriger
- Les stats pourraient utiliser une couleur emerald pour plus de cohérence avec les boutons principaux.
- Les onglets devraient être présents sur toutes les pages pour une navigation uniforme, ou bien retirés partout sauf là où ils sont nécessaires.
- Les labels de stats pourraient utiliser la même couleur que les boutons principaux pour renforcer la cohérence.
- Les boutons d’action pourraient adopter le style emerald pour les actions principales.
