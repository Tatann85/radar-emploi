// Script ponctuel : ajoute le champ "description" (texte complet copié
// depuis l'offre d'origine) à chaque offre de data/offres.json, et met à
// jour l'archivage de deux offres découvertes lors de la collecte du
// 11/10/2026 (interaction-indre-naval = placement chez Naval Group ;
// valeuriad-nantes-po = candidatures fermées). Exécuté une fois puis
// supprimable.
'use strict';
const fs = require('fs');
const path = require('path');
const DATA_PATH = path.join(__dirname, '..', 'data', 'offres.json');

const descriptions = {};

descriptions['huguet-lucon-be-electrique'] = `CDI - 85400 Luçon

Missions du poste

Et si vous pilotiez un bureau d'études reconnu pour la qualité de ses réalisations électriques ?

Huguet Ingénierie recherche un Responsable Bureau d'Études Électrique pour encadrer et coordonner les activités techniques au sein de son service. Vous intervenez sur des projets en milieu industriel et tertiaire, en lien étroit avec les chargés d'affaires et les techniciens d'études.

Vos principales responsabilités :
- Encadrer et organiser le travail des techniciens du bureau d'études
- Superviser la production des dossiers d'exécution et des propositions commerciales
- Réaliser des études complètes et assurer les pré-bouclages
- Contrôler la conformité technique avant validation finale
- Rédiger les mémoires techniques des offres commerciales

Profil recherché

Formation en électrotechnique (BTS à ingénieur), au moins 5 ans d'expérience en bureau d'études électricité. Maîtrise d'AutoCAD, Caneco et SEE Electrical. Environnements industriels et tertiaires.

Entreprise : Huguet Ingénierie, groupe de 120 personnes (Luçon 85, Pouzauges 85, Sauvagnon 64) : conception/fabrication de machines spéciales, installations électriques, maintenance industrielle.

Conditions : forfait 218 jours, participation et intéressement, mutuelle prise en charge à 80%, statut cadre avec retraite supplémentaire payée par l'entreprise. Rémunération : 38-46 K€/an.`;

descriptions['exxelia-antigny-methodes'] = `Entreprise

Exxelia, groupe industriel international (3100 salariés), leader dans la conception et la fabrication de composants et systèmes électroniques de haute technologie (Aéronautique, Spatial, Défense, Ferroviaire, Médical). Implantations aux États-Unis, au Maroc et au Vietnam ; 6 sites industriels en France.

Poste

Rattaché(e) à la Direction de Site, en lien avec les équipes techniques du site et la GBU Magnetics. Mission : orchestrer une industrialisation produit fluide du bureau d'études vers la production de série.

Missions clés :
1. Rigueur et maîtrise des processus (normes EN9100, documentation technique, culture "bon du premier coup").
2. Anticipation et stratégie industrielle (Design for Manufacturing, plannings, montées en cadence, arbitrages techniques/financiers).
3. Management et conduite du changement (accompagnement des équipes, revues AIC, culture de collaboration BE/Atelier, amélioration continue).

Profil

Bac+5 technique (électronique, électrotechnique de préférence), 8-10 ans d'expérience en industrialisation produit dont 4-5 ans en management de projet. Homme/femme de terrain, sens du détail, capacité d'anticipation, pédagogie.`;

descriptions['atlantic-roche-sur-yon-industrialisation'] = `À propos

Groupe Atlantic, site industriel et logistique de La Roche-sur-Yon (~1000 équipiers), spécialisé depuis plus de 50 ans dans la conception/production d'appareils de chauffage, d'eau chaude sanitaire et de gestion d'énergie. Démarche pro-vélo / décarbonation.

Mission

Au sein du service Industrialisation & Productivité de l'unité Chauffage, pilotage de projets d'industrialisation (conception, développement, mise en service de nouveaux moyens de production : automatisation, robotique, amélioration continue).

Missions :
- Piloter des projets d'industrialisation de machines et procédés, de l'étude de faisabilité à la mise en production.
- Participer à l'amélioration continue des équipements existants.
- Définir les besoins, rédiger les cahiers des charges, piloter les consultations fournisseurs, suivre budgets et plannings.
- Coordonner la conception mécanique, électrique, automatisme et robotique avec les partenaires du projet.
- Veille technologique, usine 4.0, accompagnement des équipes de production/maintenance.

Profil

Expérience confirmée en pilotage de projets d'industrialisation ou conception de machines spéciales. Connaissances en conception mécanique, automatisme ou électricité industrielle. Anglais opérationnel requis.

Avantages : CDI, restaurant d'entreprise, intéressement, participation, 13e mois. Certifié "Top Employer".`;

descriptions['lapeyre-chaize-giraud-be'] = `Description de l'entreprise

Lapeyre, spécialiste de l'équipement et de l'aménagement durable de la maison (particuliers et professionnels), 2300 salariés, 130 magasins, 9 usines. L'usine Ouest Production (La Chaize-Giraud, Vendée, depuis 1936) est spécialisée dans la conception et la fabrication de portes d'extérieur et fermetures standard et personnalisées.

Description du poste

Le/la Chef(fe) de projets BE conçoit et développe les produits de l'entreprise en garantissant conformité technique, performance et coût de production. Assure la liaison entre le bureau d'études, la production et les clients.

Savoir-faire : conception et développement, analyse et optimisation, coordination et communication, amélioration continue, assistance bureau d'études.

Savoir : maîtrise CAO/DAO (Inventor, AutoCAD...), normes et standards techniques, analyse de faisabilité technique et économique, procédés de production.

Conditions : travail en journée du lundi au vendredi, salaire sur 13,3 mois (prime de congés, bonus, intéressement semestriel, participation, mutuelle, prévoyance). Accessible avec un Bac+5 en ingénierie, génie industriel, mécanique, design produit ou équivalent.`;

descriptions['lieot-herbiers-dev-produit'] = `Le Groupe LIÉBOT est organisé autour de 2 métiers : fenêtre industrielle (K-LINE, WiBaie, MéO, BIPA) et façade (OUEST ALU). Groupe familial européen, plus de 4500 salariés, 13 sociétés, 800 M€ de CA en 2025.

Rattaché(e) au Directeur du Pôle Innovation & Développement Produit, collaboration avec marketing, achats, informatique, supply chain, méthodes, qualité, commerce. Moteur de la conception et du développement de nouveaux produits industriels, au sein du pôle occultation.

Responsabilités :
- Analyser les besoins des services internes et rédiger les spécifications techniques.
- Piloter les projets dans le respect des coûts, délais et exigences qualité.
- Concevoir et mettre en œuvre des solutions techniques innovantes.
- Assurer le suivi, le reporting et la qualité des livrables.
- Accompagner les équipes dans la conduite du changement.
- Interagir avec fournisseurs et organismes de certification.

Profil : Bac+5 en mécanique (ou équivalent) ou expérience significative (5 ans min), outils de conception 2D/3D, gestion de projet, analyse technique (thermique, acoustique, mécanique), normes métiers et propriété intellectuelle.

Avantages : participation, intéressement, prime d'objectifs, prime de vacances.`;

descriptions['industrie-recrute-lucon-be'] = `LOUINEAU, entreprise spécialisée dans la conception et la fabrication de systèmes de fixation et d'habillages de menuiseries extérieures depuis 1981, leader sur le marché des pattes de fixation. Démarche RSE (Ecovadis).

Dans le cadre du renforcement du Bureau d'Études, recrutement d'un Ingénieur BE souhaitant rester dans l'opérationnel, développer son expertise et contribuer à l'organisation du service. Équipe BE de 7 salariés, rattachement au Responsable Technique.

Missions :
1. Analyser le besoin et démontrer la faisabilité (dossiers techniques, contraintes réglementaires/industrielles/économiques, comparaison de solutions).
2. Concevoir, dimensionner et chiffrer (modélisation, calculs de dimensionnement, offre technique et financière).
3. Préparer et accompagner la fabrication (codification pièces/gammes/nomenclatures, plans, suivi ERP/GED, prototypes, SAV).
4. Appliquer les référentiels et contribuer aux essais (normes, DTU, fiabilité des calculs).
5. Structurer et fluidifier le BE (analyse des flux, configurateurs, bibliothèques 2D/3D, standardisation).

Profil : Bac+5 en ingénierie mécanique, conception industrielle, génie mécanique, bâtiment/enveloppe ou équivalent. Maîtrise SolidWorks et DriveWorks. Expérience en tôlerie/menuiserie/façade appréciée (5-8 ans en BE industriel un vrai plus).`;

descriptions['frinergy-olonne-froid'] = `Votre rôle

Interface entre clients industriels, frigoristes, fournisseurs et sous-traitants. Pilotage des projets liés aux installations de froid : petits travaux, remplacement d'équipements, maintenance, amélioration de la performance, suivi des prestations.

- Pilotage et suivi de projets froid, coordination des frigoristes et sous-traitants
- Suivi des contrats de maintenance, analyse des consommations énergétiques
- Préparation et analyse d'appels d'offres, suivi des travaux
- Préconisations techniques auprès des clients, suivi des performances

Note : ce n'est pas un poste de frigoriste itinérant - rôle de pilotage, analyse, coordination et conseil.

Profil recherché : expérience solide en froid industriel (frigoriste, chargé d'affaires froid, responsable maintenance froid, technicien SAV ou BE froid). Un technicien frigoriste souhaitant évoluer vers le pilotage peut être étudié. Connaissances en régulation, automatismes, électricité et performance énergétique appréciées.

Rémunération : 3350-4000 €/mois. Avantages : RTT, télétravail occasionnel, véhicule de fonction. Télétravail hybride, Olonne-sur-Mer.`;

descriptions['fayat-sallertaine-be-enveloppe'] = `Mission (chez ARNAUDEAU, groupe FAYAT)

- Analyser les plans d'architectes, CCTP et devis marchés ; études budgétaires et de faisabilité technique.
- Sélectionner les fournisseurs (coûts, délais, besoins) ; saisir les commandes sur SAP ; suivi des livraisons et de la facturation via SAP.
- Suivre la préparation des boulons/fixations pour les chantiers ; participer aux réunions hebdomadaires (planning, CODIR).
- Résolution réactive des litiges.
- Piloter l'activité du Bureau d'Études Enveloppe, accompagner dessinateurs enveloppe et magasinier.

Profil recherché : Ingénieur ou Bac+5 en Génie Civil, Structures ou BTP, expérience significative dans l'enveloppe du bâtiment. Rigueur, organisation, autonomie, force de proposition, aisance relationnelle. Maîtrise de BATIGEST, SAP, Pack Office. Connaissance des réglementations du bâtiment.

Avantages : intéressement et participation, plan d'épargne entreprise, mutuelle famille.`;

descriptions['industrie-recrute-achards-be-batiment'] = `MODEAL, acteur majeur de la construction modulaire en France (400 collaborateurs, 7 sites) : conception, fabrication et installation de bâtiments modulaires, solutions réutilisables et éco-performantes.

Rattaché(e) au Directeur Compétitivité de l'Offre, pilotage du Bureau d'Études Exécution (études tous corps d'état dont dépendent production, achats et chantiers).

Missions :
- Études d'exécution : coordination des études tous corps d'état, conformité technique/réglementaire, intégration des contraintes de fabrication/transport/pose, sous-traitance.
- Pilotage de l'activité : répartition des projets, plannings, charge d'équipe, performance qualité-coûts-délais.
- Management de l'équipe : encadrement de proximité, développement des compétences.
- Progrès du métier : modernisation des méthodes/standards/outils, veille normative.

Compétences : réglementations et normes du bâtiment, pilotage d'activité, CAO/DAO 2D-3D, ERP. 5 ans minimum dans le bâtiment (conduite de travaux/opérations), modulaire un plus. Management de proximité.

Rémunération : 53-60 K€ brut annuel.`;

descriptions['sodebo-montaigu-po-sirh'] = `Chez Sodebo, en lien avec le responsable du domaine Applicatif RH (service informatique) : faire évoluer les applications RH (une quinzaine d'applications intégrées couvrant RH et vie de l'entreprise). Premier défi : projet structurant de changement de l'outil de paie.

Missions : comprendre et challenger les besoins RH, les traduire en spécifications ; proposer des solutions et en challenger la faisabilité technique ; porter la vision produit et la roadmap ; prioriser le backlog ; rédiger les User Stories, cadrer les contrats d'interface (API) ; coordonner les développements ; piloter évolutions et MCO (supervision, incidents) ; cartographier flux et dépendances ; accompagner les utilisateurs.

Profil : expérience similaire, bonne maîtrise des processus RH appréciée. Pas besoin d'être développeur, mais appétence technique indispensable (architecture SI, API, mapping, SQL, supervision). Aisance avec l'automatisation et les environnements en transformation.

Avantages : rémunération sur 12 mois + prime de fin d'année (1 mois), intéressement/participation, CSE, restaurant d'entreprise, 1 jour de télétravail/semaine. Montaigu, Vendée.`;

descriptions['sodebo-montaigu-po-supply'] = `Chez Sodebo, au cœur d'une Supply automatisée et robotisée : écosystème applicatif pilotant les flux de la commande à l'expédition. En tant que PO confirmé(e), responsabilité du périmètre applicatif Supply, lien entre équipes métiers terrain et DSI.

Missions : comprendre et challenger les besoins Supply ; rechercher des solutions adaptées ; construire la vision, prioriser le backlog, formaliser les User Stories ; collaborer avec les développeurs ; piloter évolutions et MCO ; comprendre flux/données/dépendances ; accompagner les utilisateurs.

Terrain de jeu : une vingtaine d'applications au service de la préparation de commandes, approvisionnements, transport et service client.

Profil : expérience sur fonction similaire, connaissance de la Supply Chain/logistique/environnement industriel appréciée. Pas besoin d'être expert technique, mais compréhension de l'architecture SI et des flux de données.

Avantages : rémunération sur 12 mois + prime de fin d'année, intéressement/participation, CSE, restaurant d'entreprise, 1 jour de télétravail/semaine. Montaigu, Vendée (30 km au sud de Nantes).`;

descriptions['europe-technologies-carquefou-rd'] = `Depuis plus de 30 ans, le groupe Europe Technologies apporte son expertise pour l'industrialisation, la fabrication et la maintenance de pièces et sous-ensembles (aéronautique, naval, énergie, défense, agroalimentaire).

Filiale SONIMAT (marques SONIMAT et SONATS) : solutions industrielles de soudure/découpe/tranchage et traitements de surface par impact (grenaillage de précontrainte, martelage ultrason, redressage/formage ultrason).

Au sein de SONATS, petite équipe pluridisciplinaire sous la responsabilité du Responsable R&D. Projets de traitement de surface par impact (laser, ultrasons), de la preuve de concept au prototype chez les partenaires.

Missions : gestion de projet (coûts/qualité/délais), suivi conception/fabrication des solutions, rédaction de plans d'essais et tests, analyse des résultats et rapports, reporting interne/partenaires, veille technologique. Accompagnement par des spécialistes (roboticiens, mécaniciens, automaticiens).

Profil : Bac+5 généraliste, bonnes bases en mécanique et matériaux, débutant accepté (stage/alternance en gestion de projet R&D), connaissances en matériaux métalliques/métallurgie, anglais B2. Poste à Carquefou, 1 jour de télétravail.`;

descriptions['fayat-nantes-chef-projet'] = `Chez Comète-J.Paris (groupe FAYAT), équipe projet d'une vingtaine de personnes : exécution des projets depuis la signature du contrat jusqu'à la réception du chantier (gestion technique, contractuelle et financière).

Phases : analyse et suivi du contrat, consolidation du planning avec les acteurs, suivi de l'affaire et du budget, mise en service et réception du chantier. Interlocuteur privilégié du client, animation des réunions, reporting qualité/financier, anticipation des problématiques.

Profil : Bac+5 avec singularité Mécanique ou Contrôle Commande, plus de 10 ans d'expérience en gestion d'affaires (études, travaux, production) dans l'industrie lourde ou les machines spéciales. Connaissance du relationnel client en environnement Défense/Nucléaire. Anglais.

Rémunération : 45-60 K€ + 1 mois de variable selon objectifs. Forfait jours + RTT, titres restaurant, mutuelle prise en charge à 100%, participation/intéressement, télétravail possible.`;

descriptions['interaction-indre-naval'] = `[ATTENTION : poste identifié comme un placement en intérim chez Naval Group, ancien employeur d'Antoine - voir archive_motif]

Interaction (intérim) recherche, pour une entité de l'industrie navale et de la défense nationale (site spécialisé région nantaise, propulsion des navires militaires, de la conception au maintien opérationnel), un Responsable de Conception Équipements Nucléaires.

Au sein du service conception Générateur de Vapeur/Pressuriseur, définition et justification des composants de chaufferie nucléaire pour la propulsion navale : dossiers de définition/justificatifs, documents techniques/dessins/nomenclatures, intégration retour d'expérience, conformité aux normes, gestion des configurations, soutien technique fabrication, études R&D, encadrement opérationnel de techniciens.

Profil : Bac+5 ingénierie générale/mécanique, conception mécanique/calculs/matériaux métalliques, codes de construction, équipements nucléaires, CAO (3D Experience un plus).

Salaire : 45-55 K€/an. Forfait cadre, CET 5%.`;

descriptions['ethis-rh-vendee-be-electrique'] = `ETHIS RH recrute pour un groupe indépendant à taille humaine spécialisé dans la conception d'équipements industriels, les installations électriques et la maintenance, un Responsable Bureau d'Études électriques basé en Vendée.

Clientèle diversifiée (industriels, agroalimentaire, grandes surfaces, collectivités) : installations courant fort/faible, TGBT/coffrets/réseaux de distribution, raccordements de machines industrielles, réseaux informatiques/contrôle d'accès/sécurité incendie, GTB/GTC, photovoltaïque/bornes de recharge. Équipe d'une dizaine de collaborateurs, en développement.

Missions : organiser et coordonner l'activité, encadrer techniciens et projeteurs, réaliser/superviser études et dimensionnements électriques, contrôler plans/notes de calcul/dossiers d'exécution, chiffrage et réponses aux appels d'offres, mémoires techniques.

Profil : BTS à ingénieur en électrotechnique, 5 ans minimum en BE électricité (industriel/tertiaire). Maîtrise AutoCAD, Caneco, SEE Electrical. Rémunération : 40-50 K€/an.`;

descriptions['totalenergies-saint-herblain-po'] = `Contexte : l'activité Péage est un vecteur de croissance stratégique pour TotalEnergies/AS24 en Europe. Équipe de plusieurs Product Owners, rattachement au Responsable du Département Product Owner Péage.

Activité autour de 3 axes : pilotage du produit (vision, conformité, alignement stratégique, maîtrise d'ouvrage) ; trait d'union Métiers/réalisation (spécifications fonctionnelles, backlog, test & validation, agilité) ; garant qualité et conformité des livrables (recette, documentation, conformité réglementaire, indicateurs).

Profil : ingénieur informatique ou équivalent, 5 ans d'expérience minimum. Méthodologie Agile, Confluence/Jira/Squash TM. Capacité d'analyse stratégique marketing. Suite Microsoft 365/Teams/Copilot. Anglais courant (Bright >= 3,5). Saint-Herblain (44).`;

descriptions['astek-nantes-po'] = `Chez Astek, intégration d'un acteur clé de la mobilité nationale, programme stratégique sur un service backend essentiel (anti-fraude, embarquement, service à bord, contrôle, opérations terrain). Équipe produit expérimentée : 6 développeurs, 2 PPO, 1 Ops, 1 QA, 1 Agile Master, 1 Delivery Manager.

Missions : référent fonctionnel client/équipe, accompagnement de l'expression des besoins, suivi des rituels agiles (daily, grooming, sprint planning), gestion et structuration du backlog, rédaction de User Stories et critères d'acceptation, garant de la qualité des livrables, définition et suivi des KPI, partage de bonnes pratiques.

Stack : Jira, Confluence, Scrum, SI complexe multi-services.

Profil : école d'ingénieur ou Bac+5, 5 ans d'expérience minimum, capacité d'analyse/synthèse/décision. Process : 2 entretiens maximum. Astek valorisée #TopEmployer2026. Nantes, hybride.`;

descriptions['paprec-saint-herblain-po'] = `Paprec, fondé en 1994, leader français du recyclage et grand acteur européen de la gestion des déchets et production d'énergies vertes (18 000 collaborateurs, 400 sites, 10 pays).

Interface entre métiers et équipes de réalisation, garant de la valeur du produit : piloter la vision/trajectoire produit (roadmap, alignement stratégique) ; recueillir/formaliser les besoins métiers (ateliers, backlog, epics/user stories) ; accompagner les équipes de réalisation (Agile, démonstrations, validation) ; garantir qualité/performance/adoption (critères d'acceptation, recettes) ; suivre la valeur créée (KPI).

Périmètre : production sur sites industriels de recyclage des plastiques (réception à expédition, qualification des flux, traçabilité, interfaces ERP).

Profil : expérience significative en Product Owner/Product Manager en environnement Agile. Agile (Scrum, Kanban), Jira/Azure DevOps. Expérience industrielle/logistique appréciée. Saint-Herblain (44).`;

descriptions['valeuriad-nantes-po'] = `[ATTENTION : "Les candidatures ne sont plus acceptées" sur cette offre - voir archive_motif]

Valeuriad, ESN Agile 100% nantaise. Rôle de Product Owner : articuler les besoins métiers en fonctionnalités techniques, gérer le backlog (User Stories, priorisation par la valeur), faciliter la collaboration dev/métiers, porter la vision auprès du client, animer les rituels agiles.

Télétravail : 2 jours/semaine. Rémunération : 39-46 K€. Convention Syntec.

Profil : 4 ans d'expérience minimum en Product Owner, forte capacité de compréhension technique, pédagogie, proactivité, esprit collaboratif. Process : RH, Commu Agile, commercial. Nantes Centre (70% des projets).`;

descriptions['elephant-technologies-nantes-po'] = `CDI - Nantes - Hybride (2 jours/semaine télétravail) - 40-50 K€ - ASAP à 3 mois. ELEPHANT Technologies, ESN nantaise (70 collaborateurs), ancrage 100% local, aucune clause de mobilité.

En tant que Product Owner agile : recueillir/analyser les besoins métiers/clients, traduire en spécifications fonctionnelles et User Stories, gérer le backlog (priorisation, planification des sprints), concevoir parcours utilisateurs, participer aux revues de sprint, présenter les fonctionnalités à l'équipe technique, cérémonies agiles avec le Scrum Master.

Parcours d'intégration avec parrain, questionnaire de ressenti, point avec manager et client, entretien annuel.

Profil : Bac+5, 5 ans d'expérience minimum en CDI sur poste similaire, anglais professionnel un atout. Salaire 37-50K fixe + primes (partage de la valeur, vacances), carte restaurant, indemnités kilométriques, congés d'ancienneté dès 3 ans, RTT, CSE. 2 jours de télétravail en moyenne.`;

descriptions['scalian-nantes-po'] = `Groupe SCALIAN, TOP10 des sociétés de conseil en ingénierie en France : management de projets industriels, supply chain, architecture/systèmes numériques embarqués, SI, IA (aéronautique, spatial, automobile, ferroviaire, retail...). 5500 collaborateurs, 11 pays, 550 M€ de CA. Great Place to Work.

Poste : Nantes, CDI, 38-45 K€, démarrage immédiat, 5 ans d'expérience minimum. Contribution à l'évolution d'un écosystème public en transformation, pilotage de produits numériques stratégiques.

Missions : vision produit avec le client, feuille de route, ateliers de définition des fonctionnalités, user stories, planification des itérations, pilotage développement/déploiement, conduite du changement, conformité qualité.

Qualifications : 3 ans minimum en PO/PPO sur projets build, méthodes agiles, arbitrage valeur/faisabilité/délais/budget. Expérience environnement public/parapublic un plus.

Avantages : RTT (9-10j), télétravail, tickets restaurant, mutuelle/prévoyance, participation, épargne salariale, vélo électrique, cooptation.`;

descriptions['sii-nantes-po'] = `SII Atlantique (groupe SII, 16 000 personnes, 20 pays, créé en 1979) : communauté de 300 ingénieurs. Recherche un Product Owner confirmé à expert pour environnements Agile et projets à forte complexité.

Profil : animation/fédération d'équipe Agile, gestion priorités/backlog/roadmap, maîtrise de Jira, recueil/analyse/formalisation des besoins métiers, interlocuteurs variés (métiers, techniques, gouvernance), arbitrage des priorités, suivi budgétaire.

Clients Grands Comptes, PME et ETI : compétences techniques, fonctionnelles et méthodologiques variées. Accompagnement personnalisé (manager, RH, administratif), formations régulières.

Avantages : positionnement salarial équitable, participation, tickets restaurant, mutuelle, CSE, chèques vacances, télétravail, indemnités vélo ou 75% transports, solutions de crèche. Great Place To Work (9e année consécutive). Nantes, hybride.`;

descriptions['thales-rungis-po'] = `Thales, leader mondial des hautes technologies (Défense & Sécurité, Aéronautique & Spatial, Cyber & Digital), ~85 000 collaborateurs, 65 pays, 4,5 Mds€/an en R&D.

Poste : Rungis (sud de Paris). Business Line Integrated Airspace Protection Systems (IAS) - solutions de surveillance et d'opérations aériennes depuis 50 ans, protection de l'espace aérien des Nations.

Missions : définir et maîtriser la vision du produit (besoins clients, communication, démonstrations) ; assurer le succès de l'équipe (User Stories, critères d'acceptation, backlog, études de marché, disponibilité pendant le sprint, interface avec les parties prenantes).

Profil : Bac+5, 6 ans d'expérience minimum en pilotage/suivi d'activités de développement logiciel sur systèmes complexes. Expérience en gestion de projet/produit (idéalement PO) en Agilité/lean. Bon niveau d'anglais. Entreprise Handi-Engagée.`;

descriptions['fortil-rennes-po'] = `fortil, groupe international d'ingénierie indépendant (2500 collaborateurs, 30 agences, 14 pays). Développement des activités à Nantes : recrutement d'un Product Owner.

Rattaché(e) au Responsable de projets, équipe Agile sur produits Data stratégiques (connaissance client, usages digitaux).

Missions : recueillir/analyser/prioriser les besoins, définir la roadmap produit, piloter le backlog (User Stories), garantir la création de valeur (UX, ROI, Time-to-Market), critères d'acceptation, vie de la squad Agile, ateliers utilisateurs, conduite du changement, qualité/sécurité/conformité RGPD, suivi budgétaire.

Profil : Bac+5 informatique/ingénierie/data/école de commerce, 7 ans d'expérience minimum en environnement Agile. Connaissance marketing (segmentation, ciblage), environnements Data/Big Data, RGPD, Scrum, Jira/Jira Align. Secteur agroalimentaire apprécié. Rémunération : 42-48 K€. Rennes.`;

// Archivages découverts pendant la collecte des descriptions (11/10/2026 soir) :
const newArchives = {
  'interaction-indre-naval': "Vérifié le 11/10/2026 : l'offre place en réalité sur le site nantais de Naval Group (propulsion navale/nucléaire). Exclusion stricte : ancien employeur (Naval Group / Sirehna).",
  'valeuriad-nantes-po': 'Vérifié le 11/10/2026 : "Les candidatures ne sont plus acceptées" sur la page LinkedIn.',
};

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  let n = 0;
  data.offres.forEach(function (o) {
    if (descriptions[o.id]) {
      o.description = descriptions[o.id];
      n++;
    }
    if (newArchives[o.id]) {
      o.archive = true;
      o.archive_motif = newArchives[o.id];
    }
  });
  data.generated_at = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('OK : ' + n + ' descriptions ajoutees, ' + Object.keys(newArchives).length + ' nouvelles archives.');
}

main();
