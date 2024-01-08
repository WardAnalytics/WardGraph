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
- Improvements to the UIUX
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

The `.env` file should look like this:

```shell
VITE_WARD_API_BASE_URL=https://wardanalyticsapi.com
VITE_WARD_API_KEY=[Your Ward Analytics API Key] # If you are interested in contributing, simply shoot us a message and we will promptly provide you with a free API key ;)
```

For a template, simply go to `.env.example` and copy it to `.env`.

¡
TODO - Make sure to be complete and thorough

## How to contribute

TODO - Make sure to mention users can request an API key if they want to contribute or try it out and we'll invite them to the private beta for free.

## Additional Channels

- Discord:
- Website:
- Email:
- LinkedIn:
- Twitter:
