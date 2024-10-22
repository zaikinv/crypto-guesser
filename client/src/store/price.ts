import {
  signal,
  computed,
  ReadonlySignal,
  Signal,
} from '@preact/signals-react';

type PriceState = {
  price: Signal<number>;
};

const priceState: Readonly<PriceState> = {
  price: signal(0),
};

export const price: ReadonlySignal<Readonly<PriceState>> = computed(
  () => priceState,
);

export const setPrice = (currentPrice: number) => {
  priceState.price.value = currentPrice;
};
