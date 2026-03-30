# User Stories - Projet GSB (Gestion des Soins et Biologie)

Ce document présente les **User Stories** pour le projet GSB, focalisé sur la gestion des visites des visiteurs médicaux auprès des praticiens.

## Acteurs
1. **Visiteur Médical** : Commercial qui effectue les visites.
2. **Administrateur** : Responsable de la gestion des praticiens et des comptes.

---

## 📋 Gestion des Comptes
| ID | User Story (En tant que...) | Action (Je veux...) | But (Afin de...) | Critères d'Acceptation |
|:---|:---|:---|:---|:---|
| US01 | Visiteur Médical | m'authentifier avec un identifiant et un mot de passe | accéder à mes outils de travail | - Connexion sécurisée - Redirection vers le tableau de bord |
| US02 | Visiteur Médical | me déconnecter de l'application | fermer ma session en toute sécurité | - Session détruite - Retour à la page de connexion |

---

## 👨‍⚕️ Gestion des Praticiens (Médecins)
| ID | User Story (En tant que...) | Action (Je veux...) | But (Afin de...) | Critères d'Acceptation |
|:---|:---|:---|:---|:---|
| US03 | Visiteur Médical | consulter mon portefeuille de praticiens | voir les médecins qui me sont attribués | - Liste paginée - Filtre par spécialité ou zone |
| US04 | Visiteur Médical | modifier les informations d'un praticien (ex. adresse, téléphone) | maintenir les données à jour | - Formulaire de modification - Validation des données |
| US05 | Administrateur | ajouter ou supprimer un praticien dans le système | gérer le référentiel des cibles | - CRUD complet - Confirmation avant suppression |

---

## 📝 Gestion des Rapports de Visite
| ID | User Story (En tant que...) | Action (Je veux...) | But (Afin de...) | Critères d'Acceptation |
|:---|:---|:---|:---|:---|
| US06 | Visiteur Médical | créer un nouveau rapport de visite | rendre compte de mon activité | - Sélection du praticien - Saisie du motif (6 choix) - Saisie du bilan |
| US07 | Visiteur Médical | lister mes échantillons offerts lors d'une visite | tracer les dons de médicaments | - Sélection du médicament - Saisie de la quantité offerte |
| US08 | Visiteur Médical | consulter mes rapports passés | préparer mes prochaines visites | - Recherche par date ou praticien - Affichage détaillé |
| US09 | Visiteur Médical | modifier un rapport non finalisé | corriger des erreurs de saisie | - Bouton de modification - Mise à jour en base |

---

## 💊 Référentiel Médicaments
| ID | User Story (En tant que...) | Action (Je veux...) | But (Afin de...) | Critères d'Acceptation |
|:---|:---|:---|:---|:---|
| US10 | Visiteur Médical | consulter les familles de médicaments | connaître l'offre du laboratoire | - Liste par catégorie (antibio, etc.) |
| US11 | Visiteur Médical | voir la fiche détaillée d'un médicament | répondre aux questions du praticien | - Affichage du nom commercial et de la composition |
