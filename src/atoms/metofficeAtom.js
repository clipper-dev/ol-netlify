import { atom } from "recoil";

export const showMetofficeState = atom({
    key: "showMetofficeState",
    default: false,
});
export const metofficeDataState = atom({
    key: "metofficeDataState",
    default: {},
});
