# Ward Graph

An open-source graph tool for exploring blockchain transactions with a focus on compliance and risk analysis.

## About this project

The graph tool is based on an API provided by Ward Analytics. This API calculates the risk score and activity with other entities, allowing for the instant calculation of stats like direct and indirect exposure to entities like Binance or address categories like Mixers or Phishing/Hacking-related addresses.

**You can try it out here:** https://www.wardanalytics.app

## Features

- Graph visualization of blockchain interactions between addresses
- Current Blockchains: Ethereum
- Thorough mapping of addresses to entities (exchanges, mixers, scams, etc.)

## Implementation

The project uses the following technologies:

- Typescript
- React
- ReactFlow
- TailwindCSS
- Vite

## Roadmap

- New blockchains: Bitcoin, Tron, Polygon, XRP.
- Improvements to the UI/UX
- Improvements to the expansion algorithm heuristic

## Dataset

- We will make most of our dataset used in the Graph completely public on Hugging Face & Kaggle in the near future, while updating it regularly. Links will be available here.

## General Information

- Source Code: https://github.com/WardAnalytics/WardGraph
- Issue Tracker: https://github.com/WardAnalytics/WardGraph/issues
- Discord:

## Project Structure

TODO

## How to run this project

### 1. Yarn

Yarn is recommended to run this project. If you don't have it installed, you can install it with `npm install -g yarn`.

### 2. Environment Variables

The `.env` file should look like this:

```shell
VITE_WARD_API_BASE_URL=https://wardanalyticsapi.com
VITE_WARD_API_KEY=[Your Ward Analytics API Key] # If you are interested in contributing, simply shoot us a message and we will promptly provide you with a free API key ;)
```

For a template, simply go to `.env.example` and copy it to `.env`.

### 3. Install Dependencies

Run `yarn install` to install all dependencies.

### 4. Run the project

Run `yarn dev` to start the development server.

---

### (Optional) Config Firebase Emulators

Run `yarn start-emulators` to start the firebase emulators. 

_For more information on firebase emulators visit:_ https://firebase.google.com/docs/emulator-suite

This project has the following emultors configured

```json
"emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "hosting": {
      "port": 5000
    }
  }
```

_Note: The emulators need a [java](https://www.oracle.com/java/technologies/downloads/) version installed on local machine._

## How to contribute

TODO - Make sure to mention users can request an API key if they want to contribute or try it out and we'll invite them to the private beta for free.

## Additional Channels

- Discord:
- Website:
- Email:
- LinkedIn:
- Twitter:
