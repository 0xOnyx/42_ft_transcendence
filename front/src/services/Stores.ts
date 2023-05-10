import { writable } from 'svelte/store';

export const leftHanded = writable<boolean>(JSON.parse(localStorage.leftHanded ?? 'false'))

leftHanded.subscribe((value) => localStorage.leftHanded = String(value))