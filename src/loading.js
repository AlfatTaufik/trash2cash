/**
 * =====================================================
 * T2C UNIFIED LOADING CONTROLLER
 * Menghubungkan transisi intro ke homepage menggunakan
 * satu komponen TrashRingLoader seragam di seluruh aplikasi.
 * =====================================================
 */

import { sound } from './sound.js';
import { showLoader, hideLoader, DEFAULT_TRASH_ASSETS } from './loader.js';

export class LoadingController {
  constructor(options = {}) {
    this.onComplete = options.onComplete || (() => {});
    this.loaderInstance = null;
  }

  start(droppedItem = null, isSkipped = false) {
    const minDuration = isSkipped ? 1400 : 1800;

    // Jadikan item yang baru dimasukkan ke tong sebagai "kepala" cincin
    this.loaderInstance = showLoader({
      mode: 'fullscreen',
      activeItem: droppedItem,
      minDuration: minDuration,
      text: isSkipped ? 'Menyiapkan Pengenalan Alur' : 'Memproses Pemilahan',
      subtext: isSkipped 
        ? ['Memuat 3 langkah mudah Trash2Cash...', 'Sistem siap digunakan!']
        : ['Menganalisis densitas material...', 'Sinkronisasi standar daur ulang...', 'Menyiapkan panggung edukasi...']
    });

    if (!isSkipped && sound.playGrab) {
      sound.playGrab();
    }

    // Tunggu sampai durasi minimum tercapai
    setTimeout(() => {
      this.finish(isSkipped);
    }, minDuration);
  }

  finish(isSkipped = false) {
    if (!isSkipped && sound.playComplete) {
      sound.playComplete();
    }

    // Mount screen tujuan lebih dulu agar sudah ter-render di balik layar hitam
    this.onComplete();

    if (this.loaderInstance) {
      this.loaderInstance.hide().then(() => {
        this.loaderInstance = null;
      });
    }
  }
}
