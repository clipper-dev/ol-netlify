import { atom } from "recoil";

export const loadedState = atom({
    key: "loadedState",
    default: false,
});
export const skeletonState = atom({
    key: "skeletonState",
    default: false,
});
export const lastFetchState = atom({
    key: "lastFetchState",
    default: "Scooby doo",
});

export const timezoneValueState = atom({
  key: "timezoneValueState",
  default: "UTC",
});
export const autoFetchState = atom({
  key: "autoFetchState",
  default: false,
});