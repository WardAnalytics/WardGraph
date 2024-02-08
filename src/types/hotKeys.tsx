import { KeyboardEvent } from "react";

export interface HotKeysType {
  [key: string]: {
    key: string;
    handler?: (event: KeyboardEvent<HTMLElement>) => void;
    asyncHandler?: (event: KeyboardEvent<HTMLElement>) => Promise<void>;
  };
}
