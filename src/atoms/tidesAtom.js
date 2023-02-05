import { atom } from "recoil";

export const showHeyshamHourlyState = atom({
    key: "showHeyshamHourlyState",
    default: false,
});
export const showWarrenpointHourlyState = atom({
    key: "showWarrenpointHourlyState",
    default: false,
});

export const showHeyshamTideState = atom({
    key: "showHeyshamTideState",
    default: true,
});
export const heyshamTideDataState = atom({
    key: "heyshamTideDataState",
    default: {},
});
export const heyshamTideDataHourlyState = atom({
    key: "heyshamTideDataHourlyState",
    default: [],
});

export const showWarrenpointTideState = atom({
    key: "showWarrenpointTideState",
    default: true,
});
export const warrenpointTideDataState = atom({
    key: "warrenpointTideDataState",
    default: {},
});
export const warrenpointTideDataHourlyState = atom({
    key: "warrenpointTideDataHourlyState",
    default: [],
});

export const displayDataHeyshamState = atom({
    key: "displayDataHeyshamState",
    default: {},
});
export const displayDataWarrenpointState = atom({
    key: "displayDataWarrenpointState",
    default: {},
});
export const currentHeyshamState = atom({
    key: "currentHeyshamState",
    default: {},
});
export const tidalCurrentHeyshamNowState = atom({
    key: "tidalCurrentHeyshamNowState",
    default: {},
});
export const currentWarrenpointState = atom({
    key: "currentWarrenpointState",
    default: {},
});
