# Tutorial Usage

This directory contains a tutorial component that guides users through a series of steps. Below, you'll find information on the directory structure and how to add, edit, or remove steps from the tutorial.

## 📂 Directory Structure

```bash
├── tutorial
│   ├── components                  # Contains atomic components (title, paragraph, image, etc.)
│       ├── index.ts                # Where the export declarations should be
│       ├── TutorialCardImage.tsx
│       └── ...
│   ├── steps                       # React components representing each step of the tutorial
│       ├── index.ts                # Where the export declarations should be
│       ├── TutorialSteps.tsx
│       └── ...
│   ├── TutorialDialog.tsx          # Dialog element displaying all the tutorial steps
│   └── ShowTutorialPopup.tsx       # Tutorial popup triggering the display of TutorialDialog on user click
```

## + Adding a New Tutorial Step

To add a new step to the tutorial, follow these steps:

#### 1. Create a New Step Component

- Navigate to the `tutorial/steps` directory.
- Create a new React component file for the step, e.g., `NewTutorialStep.tsx`.

#### 2. Define the Step Content

- Open the newly created file (`NewTutorialStep.tsx`) and define the content of the tutorial step.
- Utilize components from the `tutorial/components` directory for atomic elements (title, paragraph, image, etc.).

#### 3. Export the Step Component

- Open the `tutorial/steps/index.ts` file.
- Add an export statement for the new step component, e.g.:

```javascript
export { default as NewTutorialStep } from "./NewTutorialStep";
```

#### 4. Add the Step to the stepsArray

Inside the `TutorialSteps.tsx` file, find the `tutorialSteps` array and add the new step component, ensuring the order aligns with the desired sequence, e.g.:

```javascript
const tutorialSteps = [
  // ... other steps
  NewTutorialStep,
];
```

## Adjusting the Number of Visible Circles

The number of visible circles in the tutorial progress bar is controlled by the `maxVisibleCircles` variable in **TutorialDialog.tsx**. Adjust this variable if you want to change the number of circles displayed at a time.

## Customizing Hotkeys

The tutorial supports hotkeys for navigating between steps using the left and right arrow keys. You can customize these hotkeys by updating the `HotKeyMap` enum in **TutorialDialog.tsx**.
