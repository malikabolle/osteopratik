# Bugs connus

- Les Charts ne s'initialisent pas correctement au chargement, un clic sur le label dont le Dataset doit être affiché est nécessaire.
- ~~Le système de pagination n'est pas traduit en français. (cf: @angular/material, Intl in master -> translate available)~~
- ~~Lors de l'échange d'un animal entre deux clients, un message d'erreur apparaît. L'échange fonctionnne correctement cependant.~~ (devrait être résolu)
- Sur la page profil et ajout de client, les entrées sont visuellement l'une sur l'autre pour la rue et la localité, ce uniquement sur Iphone, semble-t-il.

Pour déclarer un bug veuillez vous rendre dans la section suivante:
https://github.com/thibaultsavary/osteopratik/issues
Un exemple est disponible.

Le corps du rapport doit au moins contenir:
- **Plateforme, Version** de l'OS et du Navigateur ainsi que modèle du périphérique si celui-ci est un périphérique portable. (p.ex: Samsung S8, Android 4.4, Chrome 60)
- **Statut de connectivité** (en ligne ou hors ligne)
- **Message d'erreur** si présent
- **URL** à laquelle le bug s'est produit
- **Contexte** dans lequel le bug s'est produit