/**
 * Centralized Lucide Icons Registry & Renderer for Trash2Cash
 * Ensures consistent SVG icon rendering across all views and components.
 */

import {
  createIcons,
  Trash2,
  Banknote,
  Recycle,
  Sparkles,
  Zap,
  Flame,
  Wallet,
  Lightbulb,
  Camera,
  RefreshCw,
  Scale,
  BarChart3,
  Trophy,
  AlertTriangle,
  Shield,
  Package,
  Medal,
  Gift,
  Landmark,
  Smartphone,
  User,
  Building2,
  Truck,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Coins,
  Leaf,
  Sliders,
  Activity,
  Check,
  RotateCcw,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  KeyRound,
  Award,
  QrCode,
  X,
  ArrowDownToDot,
  Eye,
  EyeOff,
  Phone,
  FileCheck
} from 'lucide';

export const APP_ICONS = {
  Trash2,
  Banknote,
  Recycle,
  Sparkles,
  Zap,
  Flame,
  Wallet,
  Lightbulb,
  Camera,
  RefreshCw,
  Scale,
  BarChart3,
  Trophy,
  AlertTriangle,
  Shield,
  Package,
  Medal,
  Gift,
  Landmark,
  Smartphone,
  User,
  Building2,
  Truck,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Coins,
  Leaf,
  Sliders,
  Activity,
  Check,
  RotateCcw,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  KeyRound,
  Award,
  QrCode,
  X,
  ArrowDownToDot,
  Eye,
  EyeOff,
  Phone,
  FileCheck
};

/**
 * Re-scans the DOM for any `<i data-lucide="..."></i>` and replaces them with clean SVG icons.
 * @param {HTMLElement|Document} root 
 */
export function refreshIcons(root = document) {
  try {
    createIcons({
      icons: APP_ICONS,
      nameAttr: 'data-lucide',
      attrs: {
        'stroke-width': 1.8
      }
    });
  } catch (err) {
    console.warn('[Lucide] Error creating icons:', err);
  }
}
