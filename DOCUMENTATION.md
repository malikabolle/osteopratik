# Documentation

***
## Synchronisation hors-ligne

***
## Export des données

***
## Utilisation de l'application
### Consultation
`Programmée`  
Une consultation programmée apparaît dans l'agenda et ne permetpas  la génération d'une facture.  
`Terminée`  
Une consultation terminée n'apparaît pas dans l'agenda et permet la génération d'une facture.  
`Annulée`  
Une consultation annulée apparaît dans l'agenda si sa date précède la date actuelle et permet la génération d'une facture.  
`Transférée`  
Etat spécial. Automatiquement appliqué dans le cas d'un transfert de client d'un ostéopathe à un autre.  

### Facture
`Générée`  
Etat initial d'une facture après sa génération, à ce stade celle-ci peut encore être supprimée ou éditée.  
`Validée`  
Etat d'une facture après édition, à ce stade il n'est plus possible de supprimer la facture.  
`Emise`  
Etat intermédiaire vous permettant de vous rappeler quelles factures validées ont étées transmises et sont en attente de paiment.  
`Payée`  
Etat final d'une facture, la facture apparaît alors dans la comptabilité annuelle et les statistiques. Elle n'est plus listée dans la section Finance.  

### Editeur d'en-tête

L'éditeur d'en-tête des factures permet la personnalisation de l'en-tête grâce un language de *templating*.  
Les variables du languages doivent être utilisées avec le symbol d'interpolation: **{** nomVariable **}**.  

Les variables disponibles sont les suivantes:  
- **start**, **end** : permet de définir un groupe d'élément enfants.
```
{start}
# Mon Titre aligné à gauche
{end}
```

- **fill**: permet de remplir l'espace inutilisé entre deux éléments enfants d'un même parent. S'utilise a l'intérieur d'un conteneur: `{start} ... {fill} ... {end}`
```
{start}
{fill}
# Mon Titre aligné à droite
{end}
```
- **space**: permet d'insérer un espace vertical.
```
{start}
# Mon Titre
{end}
{space}
Du texte supplémentaire, avec un espace vertical le précédent.
```

- **logo**: permet d'insérer votre logo personnel.
```
{start}
{fill}
# Mon Titre aligné à droite
{end}
```

Il est aussi possible d'utiliser la synthaxe [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) qui est relativement rapide à prendre en main pour spécifier des titres, lignes, etc.
```
{start}
# XYZ S.A.
{fill}
{logo}
{end}
  
***
```

## Facturation
En ce qui concerne la facturation, il n'est possible de spécifié le numéro de facture initial a l'inscription, il en va de même pour la devise.  
Il n'est pas possible de modifié ces paramètres par la suite.  
Le numéro de facture s'affiche sous la forme suivante: {anneCourante}-{numeroFacture}
Par exemple: `2017-125` correspond à la 125ème facture de l'année 2017.
Une fois l'année terminée, le système met automatiquement le numéro de facture à 0 et met à jour l'année courant, aucune intervention de votre part n'est donc nécessaire.  


## Gestion
### Agenda
La section agenda permet de visualiser les consultations non terminées.

### Finance
La section finance permet de visualiser les factures non payées.

### Clients
La section clients permet d'ajouter et de modifier les clients, animaux, consultation et factures.

### Statistiques, Comptabilité
Rien de spécial à préciser, le chargement peut être relativement long sur les téléphones mobiles.


## Paramètres
### Animaux
Permet d'ajouter et de modifier les races. 

### Finance
Permet de spécifier les informations nécessaires pour le paiement et pour la comptabilité.

### Profil
Permet de spécifier les informations de base d'un ostéopathe (nom, prénom, addresse, ...)