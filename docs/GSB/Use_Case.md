# Use Case Diagram - Projet GSB

Ce document présente le diagramme des cas d'utilisation pour le projet GSB. Vous pouvez copier le code Mermaid ci-dessous et l'importer directement dans **Draw.io** (via le menu `Arrange` > `Insert` > `Advanced` > `Mermaid`).

## Diagramme Mermaid

```mermaid
useCaseDiagram
    actor "Visiteur Médical" as VM
    actor "Administrateur" as ADM
    
    package "Application GSB" {
        usecase "S'authentifier" as UC1
        usecase "Gérer son profil" as UC2
        
        usecase "Consulter son portefeuille de praticiens" as UC3
        usecase "Rechercher/Filtrer des praticiens" as UC4
        usecase "Mettre à jour les infos d'un praticien" as UC5
        
        usecase "Créer un rapport de visite" as UC6
        usecase "Consulter l'historique des rapports" as UC7
        usecase "Modifier un rapport de visite" as UC8
        
        usecase "Saisir les échantillons offerts" as UC9
        
        usecase "Gérer le référentiel Praticiens" as UC10
        usecase "Consulter les médicaments" as UC11
    }

    VM --> UC1
    VM --> UC2
    VM --> UC3
    VM --> UC4
    VM --> UC5
    VM --> UC6
    VM --> UC7
    VM --> UC8
    VM --> UC11
    
    UC6 ..> UC9 : <<include>>
    UC4 ..> UC3 : <<extend>>
    
    ADM --> UC1
    ADM --> UC10
```

---

## 🏗️ Description des Cas de Base

### 1. Gestion des Rapports
- **Acteur principal** : Visiteur Médical
- **Précondition** : Être authentifié.
- **Description** : Le visiteur renseigne les champs obligatoires (date, praticien, motif, bilan). Il peut inclure des échantillons offerts.

### 2. Gestion des Praticiens (Médecins)
- **Acteur principal** : Visiteur Médical / Administrateur
- **Description** : Permet la mise à jour des coordonnées des médecins cibles. L'administrateur a plus de droits (création/suppression).

### 3. Référentiel Médicaments
- **Acteur principal** : Visiteur Médical
- **Description** : Permet de consulter les médicaments classés par familles pour préparer l'argumentaire de vente lors des visites.
