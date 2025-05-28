/**
 * Notifications State Slice
 * Manages in-app notifications, alerts, and messaging
 */

import { StateCreator } from 'zustand';
import { AppStore } from './index';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'case' | 'client' | 'document' | 'billing' | 'deadline' | 'system' | 'security' | 'general';
  
  // Status
  isRead: boolean;
  isArchived: boolean;
  isPinned: boolean;
  
  // Actions
  actions?: {
    label: string;
    action: string;
    variant: 'primary' | 'secondary' | 'destructive';
  }[];
  
  // Metadata
  metadata: {
    source: string;
    relatedEntityType?: 'case' | 'client' | 'document' | 'user';
    relatedEntityId?: string;
    userId: string;
    deviceInfo?: {
      platform: string;
      browser: string;
      ip: string;
    };
  };
  
  // Scheduling
  scheduling?: {
    scheduledFor?: Date;
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
      interval: number;
      endDate?: Date;
    };
  };
  
  // Delivery
  delivery: {
    channels: ('in-app' | 'email' | 'sms' | 'push')[];
    deliveredAt?: Date;
    readAt?: Date;
    clickedAt?: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface NotificationsState {
  items: Notification[];
  isLoading: boolean;
  error: string | null;
  
  // Counters
  unreadCount: number;
  totalCount: number;
  
  // Filters
  filters: {
    type: string[];
    category: string[];
    priority: string[];
    isRead?: boolean;
    isArchived?: boolean;
    isPinned?: boolean;
    dateRange: {
      start?: Date;
      end?: Date;
    };
  };
  
  // Sorting
  sortBy: 'createdAt' | 'updatedAt' | 'priority' | 'type';
  sortOrder: 'asc' | 'desc';
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  
  // Selected items
  selectedIds: string[];
  
  // Settings
  settings: {
    enableInApp: boolean;
    enableEmail: boolean;
    enableSms: boolean;
    enablePush: boolean;
    quietHours: {
      enabled: boolean;
      start: string; // HH:mm format
      end: string; // HH:mm format
    };
    categories: {
      [key in Notification['category']]: {
        enabled: boolean;
        channels: Notification['delivery']['channels'];
        priority: Notification['priority'];
      };
    };
  };
}

export interface NotificationsActions {
  // CRUD operations
  addNotification: (notificationData: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  deleteNotification: (id: string) => void;
  
  // Bulk operations
  bulkMarkAsRead: (ids: string[]) => void;
  bulkMarkAsUnread: (ids: string[]) => void;
  bulkArchive: (ids: string[]) => void;
  bulkDelete: (ids: string[]) => void;
  
  // Status operations
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  unarchiveNotification: (id: string) => void;
  pinNotification: (id: string) => void;
  unpinNotification: (id: string) => void;
  
  // Data management
  setNotifications: (notifications: Notification[]) => void;
  setNotificationsLoading: (loading: boolean) => void;
  setNotificationsError: (error: string | null) => void;
  
  // Filtering and search
  setFilters: (filters: Partial<NotificationsState['filters']>) => void;
  clearFilters: () => void;
  
  // Sorting
  setSorting: (sortBy: NotificationsState['sortBy'], sortOrder: NotificationsState['sortOrder']) => void;
  
  // Pagination
  setPagination: (pagination: Partial<NotificationsState['pagination']>) => void;
  
  // Selection
  selectNotification: (id: string) => void;
  deselectNotification: (id: string) => void;
  selectAllNotifications: () => void;
  clearSelection: () => void;
  
  // Settings
  updateSettings: (settings: Partial<NotificationsState['settings']>) => void;
  updateCategorySettings: (category: Notification['category'], settings: Partial<NotificationsState['settings']['categories'][Notification['category']]>) => void;
  
  // Actions
  executeNotificationAction: (id: string, action: string) => void;
  
  // Utility
  dismissExpiredNotifications: () => void;
  getNotificationsByCategory: (category: Notification['category']) => Notification[];
  getUnreadNotifications: () => Notification[];
  getPinnedNotifications: () => Notification[];
}

export type NotificationsSlice = { notifications: NotificationsState } & NotificationsActions;

const defaultFilters: NotificationsState['filters'] = {
  type: [],
  category: [],
  priority: [],
  dateRange: {},
};

const defaultPagination: NotificationsState['pagination'] = {
  page: 1,
  limit: 20,
  total: 0,
};

const defaultSettings: NotificationsState['settings'] = {
  enableInApp: true,
  enableEmail: true,
  enableSms: false,
  enablePush: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  categories: {
    case: {
      enabled: true,
      channels: ['in-app', 'email'],
      priority: 'medium',
    },
    client: {
      enabled: true,
      channels: ['in-app', 'email'],
      priority: 'medium',
    },
    document: {
      enabled: true,
      channels: ['in-app'],
      priority: 'low',
    },
    billing: {
      enabled: true,
      channels: ['in-app', 'email'],
      priority: 'high',
    },
    deadline: {
      enabled: true,
      channels: ['in-app', 'email', 'push'],
      priority: 'urgent',
    },
    system: {
      enabled: true,
      channels: ['in-app'],
      priority: 'medium',
    },
    security: {
      enabled: true,
      channels: ['in-app', 'email', 'sms'],
      priority: 'urgent',
    },
    general: {
      enabled: true,
      channels: ['in-app'],
      priority: 'low',
    },
  },
};

export const createNotificationsSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  NotificationsSlice
> = (set, get) => ({
  // Initial state
  notifications: {
    items: [],
    isLoading: false,
    error: null,
    unreadCount: 0,
    totalCount: 0,
    filters: defaultFilters,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    pagination: defaultPagination,
    selectedIds: [],
    settings: defaultSettings,
  },
  
  // CRUD operations
  addNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => {
      state.notifications.items.unshift(newNotification);
      state.notifications.totalCount += 1;
      if (!newNotification.isRead) {
        state.notifications.unreadCount += 1;
      }
    });
  },
  
  updateNotification: (id, updates) => {
    set((state) => {
      const index = state.notifications.items.findIndex(n => n.id === id);
      if (index !== -1) {
        const wasUnread = !state.notifications.items[index].isRead;
        state.notifications.items[index] = {
          ...state.notifications.items[index],
          ...updates,
          updatedAt: new Date(),
        };
        
        // Update unread count if read status changed
        if (updates.isRead !== undefined) {
          if (wasUnread && updates.isRead) {
            state.notifications.unreadCount -= 1;
          } else if (!wasUnread && !updates.isRead) {
            state.notifications.unreadCount += 1;
          }
        }
      }
    });
  },
  
  deleteNotification: (id) => {
    set((state) => {
      const index = state.notifications.items.findIndex(n => n.id === id);
      if (index !== -1) {
        const notification = state.notifications.items[index];
        if (!notification.isRead) {
          state.notifications.unreadCount -= 1;
        }
        state.notifications.items.splice(index, 1);
        state.notifications.totalCount -= 1;
        state.notifications.selectedIds = state.notifications.selectedIds.filter(selectedId => selectedId !== id);
      }
    });
  },
  
  // Bulk operations
  bulkMarkAsRead: (ids) => {
    set((state) => {
      let unreadDecrement = 0;
      ids.forEach(id => {
        const index = state.notifications.items.findIndex(n => n.id === id);
        if (index !== -1 && !state.notifications.items[index].isRead) {
          state.notifications.items[index].isRead = true;
          state.notifications.items[index].delivery.readAt = new Date();
          state.notifications.items[index].updatedAt = new Date();
          unreadDecrement += 1;
        }
      });
      state.notifications.unreadCount -= unreadDecrement;
    });
  },
  
  bulkMarkAsUnread: (ids) => {
    set((state) => {
      let unreadIncrement = 0;
      ids.forEach(id => {
        const index = state.notifications.items.findIndex(n => n.id === id);
        if (index !== -1 && state.notifications.items[index].isRead) {
          state.notifications.items[index].isRead = false;
          state.notifications.items[index].delivery.readAt = undefined;
          state.notifications.items[index].updatedAt = new Date();
          unreadIncrement += 1;
        }
      });
      state.notifications.unreadCount += unreadIncrement;
    });
  },
  
  bulkArchive: (ids) => {
    set((state) => {
      ids.forEach(id => {
        const index = state.notifications.items.findIndex(n => n.id === id);
        if (index !== -1) {
          state.notifications.items[index].isArchived = true;
          state.notifications.items[index].updatedAt = new Date();
        }
      });
    });
  },
  
  bulkDelete: (ids) => {
    set((state) => {
      let unreadDecrement = 0;
      state.notifications.items = state.notifications.items.filter(n => {
        if (ids.includes(n.id)) {
          if (!n.isRead) unreadDecrement += 1;
          return false;
        }
        return true;
      });
      state.notifications.unreadCount -= unreadDecrement;
      state.notifications.totalCount -= ids.length;
      state.notifications.selectedIds = state.notifications.selectedIds.filter(selectedId => !ids.includes(selectedId));
    });
  },
  
  // Status operations
  markAsRead: (id) => {
    set((state) => {
      const index = state.notifications.items.findIndex(n => n.id === id);
      if (index !== -1 && !state.notifications.items[index].isRead) {
        state.notifications.items[index].isRead = true;
        state.notifications.items[index].delivery.readAt = new Date();
        state.notifications.items[index].updatedAt = new Date();
        state.notifications.unreadCount -= 1;
      }
    });
  },
  
  markAsUnread: (id) => {
    set((state) => {
      const index = state.notifications.items.findIndex(n => n.id === id);
      if (index !== -1 && state.notifications.items[index].isRead) {
        state.notifications.items[index].isRead = false;
        state.notifications.items[index].delivery.readAt = undefined;
        state.notifications.items[index].updatedAt = new Date();
        state.notifications.unreadCount += 1;
      }
    });
  },
  
  markAllAsRead: () => {
    set((state) => {
      const now = new Date();
      state.notifications.items.forEach(notification => {
        if (!notification.isRead) {
          notification.isRead = true;
          notification.delivery.readAt = now;
          notification.updatedAt = now;
        }
      });
      state.notifications.unreadCount = 0;
    });
  },
  
  archiveNotification: (id) => {
    set((state) => {
      const index = state.notifications.items.findIndex(n => n.id === id);
      if (index !== -1) {
        state.notifications.items[index].isArchived = true;
        state.notifications.items[index].updatedAt = new Date();
      }
    });
  },
  
  unarchiveNotification: (id) => {
    set((state) => {
      const index = state.notifications.items.findIndex(n => n.id === id);
      if (index !== -1) {
        state.notifications.items[index].isArchived = false;
        state.notifications.items[index].updatedAt = new Date();
      }
    });
  },
  
  pinNotification: (id) => {
    set((state) => {
      const index = state.notifications.items.findIndex(n => n.id === id);
      if (index !== -1) {
        state.notifications.items[index].isPinned = true;
        state.notifications.items[index].updatedAt = new Date();
      }
    });
  },
  
  unpinNotification: (id) => {
    set((state) => {
      const index = state.notifications.items.findIndex(n => n.id === id);
      if (index !== -1) {
        state.notifications.items[index].isPinned = false;
        state.notifications.items[index].updatedAt = new Date();
      }
    });
  },
  
  // Data management
  setNotifications: (notifications) => {
    set((state) => {
      state.notifications.items = notifications;
      state.notifications.totalCount = notifications.length;
      state.notifications.unreadCount = notifications.filter(n => !n.isRead).length;
    });
  },
  
  setNotificationsLoading: (loading) => {
    set((state) => {
      state.notifications.isLoading = loading;
    });
  },
  
  setNotificationsError: (error) => {
    set((state) => {
      state.notifications.error = error;
    });
  },
  
  // Filtering and search
  setFilters: (newFilters) => {
    set((state) => {
      state.notifications.filters = { ...state.notifications.filters, ...newFilters };
      state.notifications.pagination.page = 1;
    });
  },
  
  clearFilters: () => {
    set((state) => {
      state.notifications.filters = defaultFilters;
      state.notifications.pagination.page = 1;
    });
  },
  
  // Sorting
  setSorting: (sortBy, sortOrder) => {
    set((state) => {
      state.notifications.sortBy = sortBy;
      state.notifications.sortOrder = sortOrder;
      
      // Sort the items
      state.notifications.items.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Handle date sorting
        if (aValue instanceof Date && bValue instanceof Date) {
          aValue = aValue.getTime();
          bValue = bValue.getTime();
        }
        
        // Handle string sorting
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    });
  },
  
  // Pagination
  setPagination: (pagination) => {
    set((state) => {
      state.notifications.pagination = { ...state.notifications.pagination, ...pagination };
    });
  },
  
  // Selection
  selectNotification: (id) => {
    set((state) => {
      if (!state.notifications.selectedIds.includes(id)) {
        state.notifications.selectedIds.push(id);
      }
    });
  },
  
  deselectNotification: (id) => {
    set((state) => {
      state.notifications.selectedIds = state.notifications.selectedIds.filter(selectedId => selectedId !== id);
    });
  },
  
  selectAllNotifications: () => {
    set((state) => {
      state.notifications.selectedIds = state.notifications.items.map(n => n.id);
    });
  },
  
  clearSelection: () => {
    set((state) => {
      state.notifications.selectedIds = [];
    });
  },
  
  // Settings
  updateSettings: (newSettings) => {
    set((state) => {
      state.notifications.settings = { ...state.notifications.settings, ...newSettings };
    });
  },
  
  updateCategorySettings: (category, categorySettings) => {
    set((state) => {
      state.notifications.settings.categories[category] = {
        ...state.notifications.settings.categories[category],
        ...categorySettings,
      };
    });
  },
  
  // Actions
  executeNotificationAction: (id, action) => {
    const { notifications } = get();
    const notification = notifications.items.find(n => n.id === id);
    
    if (notification) {
      // Mark as clicked
      set((state) => {
        const index = state.notifications.items.findIndex(n => n.id === id);
        if (index !== -1) {
          state.notifications.items[index].delivery.clickedAt = new Date();
          state.notifications.items[index].updatedAt = new Date();
        }
      });
      
      // Execute the action (would be implemented based on action type)
      console.log(`Executing action: ${action} for notification: ${id}`);
    }
  },
  
  // Utility
  dismissExpiredNotifications: () => {
    const now = new Date();
    set((state) => {
      const expiredIds: string[] = [];
      state.notifications.items = state.notifications.items.filter(n => {
        if (n.expiresAt && n.expiresAt < now) {
          expiredIds.push(n.id);
          if (!n.isRead) {
            state.notifications.unreadCount -= 1;
          }
          return false;
        }
        return true;
      });
      state.notifications.totalCount -= expiredIds.length;
      state.notifications.selectedIds = state.notifications.selectedIds.filter(id => !expiredIds.includes(id));
    });
  },
  
  getNotificationsByCategory: (category) => {
    const { notifications } = get();
    return notifications.items.filter(n => n.category === category);
  },
  
  getUnreadNotifications: () => {
    const { notifications } = get();
    return notifications.items.filter(n => !n.isRead);
  },
  
  getPinnedNotifications: () => {
    const { notifications } = get();
    return notifications.items.filter(n => n.isPinned);
  },
});