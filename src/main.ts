import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeApp } from 'firebase/app';

// Configuración de Firebase - Reemplazar con datos reales
const firebaseConfig = {
  apiKey: "AIzaSyAybgZ-cnCEi-mHWnCx6WUy2nzBeOyCqJY",
  authDomain: "glp-quito-db.firebaseapp.com",
  databaseURL: "https://glp-quito-db-default-rtdb.firebaseio.com",
  projectId: "glp-quito-db",
  storageBucket: "glp-quito-db.firebasestorage.app",
  messagingSenderId: "255883990357",
  appId: "1:255883990357:web:ba2cc0a07642ad9e754bdc"
};

initializeApp(firebaseConfig);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));