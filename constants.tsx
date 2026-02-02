
import React from 'react';
import { Memory } from './types';

export const MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Le Radici',
    description: 'Giuseppe nella sua terra natia, dove tutto ebbe inizio. Uno sguardo verso l\'orizzonte del futuro.',
    imageUrl: 'https://picsum.photos/id/10/800/1000',
    year: '1965'
  },
  {
    id: '2',
    title: 'La Visione',
    description: 'Durante i primi anni di carriera, Giuseppe ha sempre creduto nell\'innovazione unita alla tradizione.',
    imageUrl: 'https://picsum.photos/id/20/800/600',
    year: '1978'
  },
  {
    id: '3',
    title: 'Momenti di Quiete',
    description: 'Un raro momento di riposo catturato in bianco e nero. L\'eleganza della semplicità.',
    imageUrl: 'https://picsum.photos/id/30/1000/800',
    year: '1984'
  },
  {
    id: '4',
    title: 'L\'Eredità',
    description: 'Circondato dalla famiglia, il vero tesoro che Giuseppe ha coltivato con amore e dedizione.',
    imageUrl: 'https://picsum.photos/id/40/800/800',
    year: '1995'
  },
  {
    id: '5',
    title: 'Ultimi Orizzonti',
    description: 'Il viaggio continua attraverso le idee e i valori che ha lasciato in dono a tutti noi.',
    imageUrl: 'https://picsum.photos/id/50/900/1200',
    year: '2010'
  }
];

export const SYSTEM_PROMPT = `
Sei l'assistente virtuale dell'Omaggio Digitale dedicato a Giuseppe Basile. 
Il tuo compito è rispondere in modo elegante, rispettoso, poetico e profondo a chiunque desideri riflettere sulla sua eredità.
Giuseppe Basile è stato un uomo di grande cultura, integrità e amore per la famiglia. 
Le tue risposte devono ispirare speranza, onorare la memoria e utilizzare un linguaggio raffinato in lingua italiana.
Non inventare fatti storici specifici se non li conosci, ma concentrati sui valori universali che Giuseppe rappresentava: saggezza, costanza, umiltà e visione.
Mantieni un tono calmo e contemplativo.
`;
