<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Team-Code-Monkeys/secret-cocktail-web-app">
    <img src="https://thesecretcocktail.com/wp-content/uploads/2021/01/Logo.png" alt="Logo" width="120" height="120" >
  </a>

<h1 align="center">The Secret Cocktail Webapp</h1>

  <p align="center">
    Custom built automated phone survey to find CNA facilities
    <br />
    <br />
    <a href="https://secret-cocktail.web.app/"><strong>Check out the deployed site »</strong></a>
    <br />
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#introduction">Introduction</a>
    </li>
    <li>
      <a href="#v040-release-notes">v0.4.0 Release Notes</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#bug-fixes">Bug Fixes</a></li>
        <li><a href="#known-issues">Known Issues</a></li>
      </ul>
    </li>
    <li>
      <a href="#v030-release-notes">v0.3.0 Release Notes</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#bug-fixes">Bug Fixes</a></li>
        <li><a href="#known-issues">Known Issues</a></li>
      </ul>
    </li>
    <li>
      <a href="#v020-release-notes">v0.2.0 Release Notes</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#bug-fixes">Bug Fixes</a></li>
        <li><a href="#known-issues">Known Issues</a></li>
      </ul>
    </li>
    <li>
      <a href="#v010-release-notes">v0.1.0 Release Notes</a>
      <ul>
        <li><a href="#features-1">Features</a></li>
        <li><a href="#bug-fixes-1">Bug Fixes</a></li>
        <li><a href="#known-issues-1">Known Issues</a></li>
      </ul>
    </li>
    <li><a href="#how-to-run">How To Run</a></li>
    <li><a href="#screenshots">Screenshots</a></li>
  </ol>
</details>

<!-- INTRODUCTION -->

## Introduction

<p align="center">
  <strong align="center">Why use us?</strong>
  <br>
  <img width="500" height="320" src="https://github.com/Team-Code-Monkeys/secret-cocktail-web-app/raw/main/screenshot/mockup.jpg">
</p>

The Secret Cocktail Webapp is an automated phone survey system to help nursing trainees find facilities near them to complete
their required training hours. Our software features a phone survey system that sends questionnaires to facilities and
based on their responses, they can be added to our database of facilities hosting nursing training. We also have a web
application that allows nursing trainees to easily find nearby facilities where they can complete their required
training hours.


<!-- Release Notes -->

# Release Notes

## v0.4.0 Release Notes

### Features

- Added ability to change user email
- Added ability for facilities to delete account

### Bug Fixes

- Fixed styling error on facility home page where button would appear on bottom right of screen instead of the center

### Known Issues

No known issues as of now, please report using GitHub issues.

## v0.3.0 Release Notes

### Features

- Style landing page to have explicit login buttons for admin, facilities, and nursing trainees
- Page to allow users to reset their password
- Automatic creation of a facility account when a facility is added to our database
- Automatic sending of an email with facility account credentials when a facility account is created
- Page for nursing trainees to submit support tickets that admins can view
- Page for admins to view support tickets created by nursing trainees

### Bug Fixes

- Fixed size of report correction button for facilities page

### Known Issues

No known issues as of now, please report using GitHub issues.

## v0.2.0 Release Notes

### Features

- Added ability to create phone survey
  - Ability to change questions
  - Ability to record data
  - Ability to record phone call
- Integrated Twiliio API to make calls
- Ability to add a facility based off transcribed phone responses provided by Twilio

### Bug Fixes

- Fixed wave background showing wrong color

### Known Issues

- Button styling is inconsistent in modals

Please report future issues using GitHub issues.


## v0.1.0 Release Notes

### Features

- Added ability to download data as .csv
- Added admin dashboard of facilities
  - Ability to see location
  - Ability to see services
- Added ability to upload facility contact list as .csv

### Bug Fixes

- Fixed triple scrollbar showing on home page

### Known Issues

No known issues as of now, please report using GitHub issues.

<!-- How To Run -->

## How To Run

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

**Optional Environment Variables**

```shell
API_URL="..."
REACT_APP_GOOGLE_MAPS_API_KEY="..."
REACT_APP_GOOGLE_GEOCODING_API_KEY="..."
```

## Screenshots

![screenshot](screenshot/0.png)

![screenshot](screenshot/1.png)

![screenshot](screenshot/2.png)

![screenshot](screenshot/3.png)

![screenshot](screenshot/4.png)

![screenshot](screenshot/5.png)

![screenshot](screenshot/6.png)

![screenshot](screenshot/7.png)
