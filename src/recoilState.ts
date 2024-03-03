import { atom } from 'recoil';

export const searchHistoryState = atom<string[]>({
  key: 'searchHistoryState',
  default: [],
});
