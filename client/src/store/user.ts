import {
  signal,
  computed,
  ReadonlySignal,
  Signal,
} from '@preact/signals-react';

type UserState = {
  userId: Signal<string | null>;
  userName: Signal<string | null>;
};

const userState: Readonly<UserState> = {
  userId: signal(''),
  userName: signal(''),
};

export const user: ReadonlySignal<Readonly<UserState>> = computed(
  () => userState,
);

export const setUser = (id: string | null, name: string | null) => {
  userState.userId.value = id;
  userState.userName.value = name;
};
