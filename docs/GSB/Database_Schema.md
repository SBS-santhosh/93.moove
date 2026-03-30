# Database Relational Schema - Projet GSB

Ce document définit la structure de la base de données MySQL pour l'application GSB. Vous pouvez copier ce code Mermaid et l'importer dans **Draw.io** ou tout visualiseur Mermaid.

## Diagramme ERD (Modèle Physique de Données)

```mermaid
erDiagram
    VISITEUR ||--o{ RAPPORT : "rédige"
    MEDECIN ||--o{ RAPPORT : "est visité par"
    FAMILLE ||--o{ MEDICAMENT : "contient"
    RAPPORT ||--o{ OFFRIR : "propose"
    MEDICAMENT ||--o{ OFFRIR : "est offert"

    VISITEUR {
        string id PK "Identifiant (matricule)"
        string nom "Nom"
        string prenom "Prénom"
        string login "Identifiant de connexion"
        string mdp "Mot de passe (hashé)"
        string adresse "Adresse"
        string cp "Code Postal"
        string ville "Ville"
        date dateEmbauche "Date d'embauche"
    }

    MEDECIN {
        int id PK "Auto-incrément"
        string nom "Nom"
        string prenom "Prénom"
        string adresse "Adresse"
        string cp "Code Postal"
        string ville "Ville"
        string tel "Téléphone"
        string specialite "Spécialité (généraliste...)"
    }

    FAMILLE {
        string id PK "Code famille"
        string libelle "Libellé de la famille"
    }

    MEDICAMENT {
        string id PK "Code médicament (ex. AMOX45)"
        string nomCommercial "Nom commercial (ex. AMOXAR)"
        string idFamille FK "Lien vers FAMILLE"
        string composition "Composition"
        string informations "Informations/Contre-indications"
    }

    RAPPORT {
        int id PK "Identifiant unique"
        date dateRapport "Date de la visite"
        string motif "Motif de la visite (6 choix)"
        text bilan "Retour qualitatif"
        string idVisiteur FK "Lien vers VISITEUR"
        int idMedecin FK "Lien vers MEDECIN"
    }

    OFFRIR {
        int idRapport PK, FK "Lien vers RAPPORT"
        string idMedicament PK, FK "Lien vers MEDICAMENT"
        int quantite "Quantité d'échantillons"
    }
```

---

## 📋 Détails des Tables

1.  **VISITEUR** : Stocke les informations des visiteurs médicaux (authentification et données personnelles).
2.  **MEDECIN** : Gère les informations des praticiens (cibles des visites).
3.  **FAMILLE** : Catégorise les médicaments (ex: Antibiotiques, Antalgiques).
4.  **MEDICAMENT** : Référentiel des produits pharmaceutiques.
5.  **RAPPORT** : Table pivot du projet, consigne les détails de chaque visite effectuée par un visiteur chez un médecin.
6.  **OFFRIR** : Table d'association entre un rapport et un médicament pour tracer les échantillons (quantité offerte).

---

## 🔑 Contraintes d'Intégrité
- **Clés Primaires (PK)** : Identifiants uniques pour chaque table.
- **Clés Étrangères (FK)** : Assurent la cohérence des relations entre les visites, les médecins, les visiteurs et les médicaments.
- **Table d'association (OFFRIR)** : Utilise une clé primaire composite (idRapport + idMedicament).
