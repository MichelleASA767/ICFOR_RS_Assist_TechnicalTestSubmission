//=====================================================================================================//
//                      Remote Sensing Assistant Technical Test Submission README                      //
//                            By : Michelle Agustaranny Sekar Arum                                     //
//                                    **AOI:** East Jakarta                                            //
//                                    **Target Year:** 2018                                            //
//=====================================================================================================//

Technical Exercise: Land Cover Mapping Workflow Replication (East Jakarta)
This repository contains the deliverables for the Remote Sensing Assistant technical exercise. The objective of this exercise was to begin replicating the land cover mapping workflow presented in the paper “A national-scale land cover reference dataset from local crowdsourcing initiatives in Indonesia”, and to adapt it for a selected Area of Interest (AOI), East Jakarta, for the target year 2018.

---
## Repository Contents
- **README.md**  
  This file, which details the overall plan, workflow, challenges encountered, and proposed solutions.

- **EastJakarta_LandCover_2018.js**  
  A consolidated Google Earth Engine script that loads Landsat 8 Surface Reflectance imagery, performs cloud masking, computes spectral indices (NDVI, NDWI, NBR, SAVI, EVI2), and prepares the dataset for visualization and potential classification.
---

## 1. Overall Plan
My strategy to approach this test within the 3-hour limit was divided into five phases:
1. **Setup and Scoping**  
   Reviewed the scientific paper, GEE repository, and dataset structure. Defined East Jakarta as the AOI and identified required components for replication.
2. **Data Integration and Filtering**  
   Merged several Figshare tables to reconstruct a spatial dataset containing reference points with latitude/longitude and consensus values (but no land cover labels due to linking limitations).
3. **Imagery Preparation and Index Calculation**  
   Loaded Landsat 8 Surface Reflectance data for 2018, applied cloud masking, and computed NDVI, NDWI, NBR, SAVI, and EVI2 indices for the AOI.
4. **Placeholder for Classification**  
   Drafted commented code for Random Forest classification, assuming land cover labels would be available for training/testing.
5. **Documentation and Delivery**  
   Documented the process, limitations, and solutions in this README. Delivered all required files via GitHub.

---
## 2. Steps Taken (3-Hour Log)

### Hour 1: Understanding the Task and Scoping the Workflow  
5 min: Created a public GitHub repository and initialized the project structure, including a draft `README.md`, and the `EastJakarta_LandCover_2018.js`.  
55 min: Reviewed the technical test instructions to understand the objective, in which is to replicate the land cover mapping workflow described in the referenced scientific paper and apply it to a selected Area of Interest (AOI). For this test, the AOI is defined as the city East Jakarta. I read through the methodology in the scientific paper, downloaded the complete Figshare dataset, and reviewed the original GitHub code repository. I then studied the dataset structure using the Supplementary File 1 to determine which tables were necessary and how they could be joined to create a usable spatial training dataset.

### Hour 2: Data Preparation, Upload, and Code Adaptation  
10 min: Uploaded the AOI shapefile for East Jakarta (`SHP_JakartaTimur`) to Google Earth Engine to serve as the spatial filter for imagery processing.  
20 min: Used ArcMap to join `locations.csv` with `samplesLocation.csv` to associate `SampleID` with latitude and longitude. I then joined the result with `crowdAnnotationsConsensusPerSample_.csv` using `SampleID`, creating a dataset of reference points with spatial coordinates, consensus labels, and uncertainty values. During this process, I confirmed that a reliable join between `SampleID` and `PileClass` was not possible due to missing linkage to `PileID`. As a result, I pivoted to a workflow that did not depend on land cover class labels.  
15 min: Uploaded the resulting merged dataset (`LocationCrowdAnnotationPerSample.csv`) to GEE as a `FeatureCollection` for visualization and potential exploratory analysis.  
15 min: Drafted a unified GEE script by adapting the modular code from the original GitHub repository. This included implementing cloud masking, computing vegetation indices (NDVI, NDWI, NBR, SAVI, EVI2), and updating asset paths to point to my own GEE assets. The goal was to replicate the preprocessing workflow in a self-contained script suitable for East Jakarta and the year 2018.

### Hour 3: Script Finalization and Documentation  
30 min: Finalized the GEE script by consolidating all processing steps into a clean, single script file. This included generating a cloud-masked Landsat 8 Surface Reflectance composite for 2018 over East Jakarta and implementing five vegetation indices: NDVI, NDWI, NBR, SAVI, and EVI2 as used in the [RestoreMapping GitHub repository](https://github.com/HadiEO/RestoreMapping/blob/main/restorelcmap/1_Generate_Composites_Covariates_Functions.js).  
I ensured compatibility with Collection 2 Level 2 bands (`SR_B4`, `SR_B5`, etc.) and clipped the final composite to the AOI. I also set visualization parameters for each index and added them to the GEE map viewer to confirm their validity and interpretability. As a forward-looking step, I implemented placeholder code (commented) for point-based index extraction and Random Forest classification. This section demonstrates how the spectral index values would be extracted from reference points if class labels were available, how a classifier would be trained, and how classification accuracy would be evaluated through a confusion matrix. 
25 min: Focused on drafting and refining the `README.md` documentation. I described the objectives, technical approach, steps taken, data integration process, encountered challenges, and alternative strategies. I made sure to highlight key technical decisions and explain how I adapted the workflow given data limitations (e.g., absence of class labels).  
5 min: Submitted the final deliverables, including the script and documentation, to the email address provided in the test instructions.

---

## 3. Challenges Encountered

### 3.1 Private GEE Asset Paths  
The original code references private GEE assets (`users/hadi/...`) that are inaccessible to external users.

### 3.2 Data Join Complexity  
Creating a spatially valid reference dataset required joining multiple CSVs. While coordinates were recovered, land cover labels (`PileClass`) could not be reliably linked due to lack of a shared key.

### 3.3 Incomplete Training Labels  
As a result of 3.2, I was unable to create a labeled dataset for supervised classification.

### 3.4 Modular Code Structure  
The source code is modular and uses `require()`, which adds complexity when working in GEE Code Editor during a limited-time task.

### 3.5 Limited Documentation on Final Reference Asset  
There is no public information detailing how the private asset `REF_INDO_2019` was constructed from the raw Figshare tables.

---

## 4. Proposed Solutions

As an individual contributor, I focused on building a self-contained, replicable workflow using publicly available data and adapting to known constraints.
### 4.1 Individual-Level Solutions

As an individual contributor, I focused on building a self-contained, replicable workflow using publicly available data and adapting to known constraints.

#### 4.1.1 Reconstruct the Reference Point Dataset (Spatial)  
**Action:** Joined `locations.csv`, `samplesLocation.csv`, and `crowdAnnotationsConsensusPerSample_.csv` to generate a spatial reference dataset containing `SampleID`, coordinates, and consensus annotation values.  
**Status:** ✅ Completed. The merged CSV (`LocationCrowdAnnotationPerSample.csv`) was uploaded and visualized in GEE.

#### 4.1.2 Replace Private GEE Asset Paths  
**Action:** Downloaded public data from Figshare and uploaded the result to my personal GEE asset folder, replacing all references to inaccessible paths in the script.  
**Status:** ✅ Completed. All dataset paths in my script now point to assets I control.

#### 4.1.3 Consolidate the Code into a Single GEE Script  
**Action:** Adapted modular functions (cloud masking, vegetation indices) from the original GitHub repository into a single GEE script for clarity, speed, and reproducibility.  
**Status:** ✅ Completed. The result is a self-contained script (`EastJakarta_LandCover_2018.js`) for AOI-specific preprocessing.

#### 4.1.4 Define and Upload a Custom AOI (East Jakarta)  
**Action:** Prepared an East Jakarta shapefile and uploaded it to GEE for use as the spatial boundary for imagery filtering and clipping.  
**Status:** ✅ Completed. AOI is integrated and used in all data processing steps.

#### 4.1.5 Placeholder for Classification Workflow  
**Action:** Wrote (commented) template code for Random Forest classification based on extracted vegetation indices, assuming class labels (`PileClass`) were available.  
**Status:** ✅ Completed. Classification flow is prepared and ready to be enabled if labeled training data becomes available.

### 4.2 Team-Based / Collaborative Solutions

Some limitations in the dataset and reference structure would best be addressed through coordinated team action or support from data providers.

#### 4.2.1 Resolve Linkage Between SampleID and PileClass  
**Action:** Coordinate with the original dataset creators or metadata engineers to trace how `PileID` maps to `SampleID`, enabling access to land cover labels that is equipped with the location information and easily combined with other data that is needed.

#### 4.2.2 Establish a Shared GEE Asset Folder  
**Action:** Recommend setting up a version-controlled team asset library for collaborative work, avoiding reliance on personal uploads.  

#### 4.2.3 Create a Fully Processed Training and Testing Dataset from Figshare Tables  
**Action:** Collaborate to design and document a repeatable ETL (Extract–Transform–Load) pipeline that converts the raw Figshare CSVs into a cleaned, labeled, and georeferenced dataset. This pipeline should generate a full `FeatureCollection` with land cover classes, suitable for training and testing machine learning models (e.g., using stratified random sampling or k-fold splitting techniques).

#### 4.2.4 Clarify Construction of REF_INDO_2019  
**Action:** Request access to the original code or metadata steps used to create the private asset `REF_INDO_2019`, or reverse-engineer it from the Figshare files.




