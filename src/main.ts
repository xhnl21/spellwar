import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import {
    IonPage, IonActionSheet, IonAlert, IonBadge, IonButton, IonRippleEffect, IonCard, IonCardContent,
    IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonChip, IonApp, IonContent, IonDatetime,
    IonPicker, IonFab, IonFabButton, IonFabList, IonGrid, IonCol, IonRow, IonInfiniteScroll,
    IonInfiniteScrollContent, IonIcon, IonInput, IonTextarea, IonItem, IonItemDivider, IonItemGroup,
    IonItemSliding, IonItemOptions, IonItemOption, IonLabel, IonNote, IonList, IonListHeader,
    IonAvatar, IonImg, IonThumbnail, IonMenu, IonMenuButton, IonMenuToggle,
    IonSplitPane, IonModal, IonBackdrop, IonNav, IonNavLink, IonPopover, IonLoading, IonProgressBar,
    IonSkeletonText, IonSpinner, IonRadio, IonRadioGroup, IonRange, IonRefresher, IonRefresherContent,
    IonReorder, IonReorderGroup, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption,
    IonTabs, IonTabBar, IonTabButton, IonToast, IonToggle, IonToolbar, IonHeader,
    IonFooter, IonTitle, IonButtons, IonBackButton, IonText, IonRouterOutlet,
    // IonHeaderBar
} from '@ionic/vue';

const app = createApp(App)
    .use(IonicVue)
    .use(router);

router.isReady().then(() => {
    // app.config.globalProperties.$store = store;
    // app.provide("$store", store);
    // app.config.globalProperties.$options = options;
    // app.provide("$options", options);
    // app.component('ion-header-bar', IonHeaderBar);
    app.component('ion-searchbar', IonSearchbar);
    app.component('ion-page', IonPage);
    app.component('ion-action-sheet', IonActionSheet);
    app.component('ion-alert', IonAlert);
    app.component('ion-badge', IonBadge);
    app.component('ion-button', IonButton);
    app.component('ion-ripple-effect', IonRippleEffect);
    app.component('ion-card', IonCard);
    app.component('ion-card-content', IonCardContent);
    app.component('ion-card-header', IonCardHeader);
    app.component('ion-card-subtitle', IonCardSubtitle);
    app.component('ion-card-title', IonCardTitle);
    app.component('ion-checkbox', IonCheckbox);
    app.component('ion-chip', IonChip);
    app.component('ion-app', IonApp);
    app.component('ion-content', IonContent);
    app.component('ion-datetime', IonDatetime);
    app.component('ion-picker', IonPicker);
    app.component('ion-fab', IonFab);
    app.component('ion-fab-button', IonFabButton);
    app.component('ion-fab-list', IonFabList);
    app.component('ion-grid', IonGrid);
    app.component('ion-col', IonCol);
    app.component('ion-row', IonRow);
    app.component('ion-infinite-scroll', IonInfiniteScroll);
    app.component('ion-infinite-scroll-content', IonInfiniteScrollContent);
    app.component('ion-icon', IonIcon);
    app.component('ion-input', IonInput);
    app.component('ion-textarea', IonTextarea);
    app.component('ion-item', IonItem);
    app.component('ion-item-divider', IonItemDivider);
    app.component('ion-item-group', IonItemGroup);
    app.component('ion-item-sliding', IonItemSliding);
    app.component('ion-item-options', IonItemOptions);
    app.component('ion-item-option', IonItemOption);
    app.component('ion-label', IonLabel);
    app.component('ion-note', IonNote);
    app.component('ion-list', IonList);
    app.component('ion-list-header', IonListHeader);
    app.component('ion-avatar', IonAvatar);
    app.component('ion-img', IonImg);
    app.component('ion-thumbnail', IonThumbnail);
    app.component('ion-menu', IonMenu);
    app.component('ion-menu-button', IonMenuButton);
    app.component('ion-menu-toggle', IonMenuToggle);
    app.component('ion-split-pane', IonSplitPane);
    app.component('ion-modal', IonModal);
    app.component('ion-backdrop', IonBackdrop);
    app.component('ion-nav', IonNav);
    app.component('ion-nav-link', IonNavLink);
    app.component('ion-popover', IonPopover);
    app.component('ion-loading', IonLoading);
    app.component('ion-progress-bar', IonProgressBar);
    app.component('ion-skeleton-text', IonSkeletonText);
    app.component('ion-spinner', IonSpinner);
    app.component('ion-radio', IonRadio);
    app.component('ion-radio-group', IonRadioGroup);
    app.component('ion-range', IonRange);
    app.component('ion-refresher', IonRefresher);
    app.component('ion-refresher-content', IonRefresherContent);
    app.component('ion-reorder', IonReorder);
    app.component('ion-reorder-group', IonReorderGroup);
    app.component('ion-search-bar', IonSearchbar);
    app.component('ion-segment', IonSegment);
    app.component('ion-segment-button', IonSegmentButton);
    app.component('ion-select', IonSelect);
    app.component('ion-select-option', IonSelectOption);
    app.component('ion-tabs', IonTabs);
    app.component('ion-tab-bar', IonTabBar);
    app.component('ion-tab-button', IonTabButton);
    app.component('ion-toast', IonToast);
    app.component('ion-toggle', IonToggle);
    app.component('ion-toolbar', IonToolbar);
    app.component('ion-header', IonHeader);
    app.component('ion-footer', IonFooter);
    app.component('ion-title', IonTitle);
    app.component('ion-buttons', IonButtons);
    app.component('ion-back-button', IonBackButton);
    app.component('ion-text', IonText);
    app.component('ion-router-outlet', IonRouterOutlet);
    app.mount('#app');
});