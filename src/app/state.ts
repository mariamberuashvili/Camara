import { signal } from '@angular/core';

export const appState = {
  nia: signal(''),
  nie: signal(''),
  birthDate: signal(''),
  photoData: signal(''),
  accepted: signal(false),
  savedUserId: signal<number | null>(null),
};
