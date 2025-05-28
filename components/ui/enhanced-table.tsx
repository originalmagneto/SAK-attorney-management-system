/**
 * Enhanced Table Component
 * Modern, feature-rich table with sorting, filtering, pagination, and animations
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { EnhancedInput } from './enhanced-input';
import { EnhancedButton } from './enhanced-button';
import { EnhancedBadge } from './enhanced-badge';

// Enhanced table variants
const enhancedTableVariants = cva(
  'w-full border-collapse overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-900',
        striped: 'bg-white dark:bg-gray-900',
        bordered: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
        minimal: 'bg-transparent',
        modern: 'bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Table header variants
const tableHeaderVariants = cva(
  [
    'px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100',
    'border-b border-gray-200 dark:border-gray-700',
    'bg-gray-50 dark:bg-gray-800',
  ],
  {
    variants: {
      sortable: {
        true: 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
        false: '',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        default: 'px-4 py-3 text-sm',
        lg: 'px-6 py-4 text-base',
      },
    },
    defaultVariants: {
      sortable: false,
      size: 'default',
    },
  }
);

// Table cell variants
const tableCellVariants = cva(
  'px-4 py-3 border-b border-gray-200 dark:border-gray-700',
  {
    variants: {
      variant: {
        default: 'text-gray-900 dark:text-gray-100',
        muted: 'text-gray-600 dark:text-gray-400',
        accent: 'text-blue-600 dark:text-blue-400',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        default: 'px-4 py-3 text-sm',
        lg: 'px-6 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Table row variants
const tableRowVariants = cva(
  'transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'hover:bg-gray-50 dark:hover:bg-gray-800',
        striped: 'even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
        bordered: 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
        minimal: 'hover:bg-gray-50 dark:hover:bg-gray-800',
        modern: 'hover:bg-gray-50 dark:hover:bg-gray-800',
      },
      selectable: {
        true: 'cursor-pointer',
        false: '',
      },
      selected: {
        true: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectable: false,
      selected: false,
    },
  }
);

// Sort direction type
type SortDirection = 'asc' | 'desc' | null;

// Column definition interface
export interface ColumnDef<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortFn?: (a: T, b: T) => number;
  filterFn?: (value: any, filterValue: string) => boolean;
  className?: string;
  headerClassName?: string;
}

// Table action interface
export interface TableAction<T = any> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T, index: number) => void;
  disabled?: (row: T, index: number) => boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

// Enhanced table props
export interface EnhancedTableProps<T = any>
  extends VariantProps<typeof enhancedTableVariants> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  actions?: TableAction<T>[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  cellClassName?: string | ((value: any, row: T, column: ColumnDef<T>, index: number) => string);
  animate?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string | number;
}

// Sort icon component
const SortIcon = ({ direction }: { direction: SortDirection }) => {
  if (direction === 'asc') {
    return <ChevronUp className="h-4 w-4" />;
  }
  if (direction === 'desc') {
    return <ChevronDown className="h-4 w-4" />;
  }
  return <ChevronsUpDown className="h-4 w-4 opacity-50" />;
};

// Loading skeleton component
const LoadingSkeleton = ({ columns, rows = 5 }: { columns: ColumnDef[]; rows?: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <motion.tr
          key={rowIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: rowIndex * 0.05 }}
        >
          {columns.map((column, colIndex) => (
            <td key={colIndex} className={tableCellVariants()}>
              <div
                className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            </td>
          ))}
        </motion.tr>
      ))}
    </>
  );
};

// Empty state component
const EmptyState = ({ message, onRefresh }: { message: string; onRefresh?: () => void }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <td colSpan={100} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="text-gray-400 dark:text-gray-600">
            <Search className="h-12 w-12" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
          {onRefresh && (
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={onRefresh}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </EnhancedButton>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

// Error state component
const ErrorState = ({ error, onRefresh }: { error: string; onRefresh?: () => void }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <td colSpan={100} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="text-red-400">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          {onRefresh && (
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={onRefresh}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Try Again
            </EnhancedButton>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

const EnhancedTable = <T extends Record<string, any>>(
  props: EnhancedTableProps<T>
) => {
  const {
    data,
    columns,
    loading = false,
    error,
    emptyMessage = 'No data available',
    searchable = false,
    searchPlaceholder = 'Search...',
    filterable = false,
    sortable = true,
    selectable = false,
    multiSelect = false,
    selectedRows = [],
    onSelectionChange,
    actions = [],
    pagination,
    onRefresh,
    onExport,
    variant,
    size,
    className,
    containerClassName,
    headerClassName,
    bodyClassName,
    rowClassName,
    cellClassName,
    animate = true,
    stickyHeader = false,
    maxHeight,
  } = props;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Handle sorting
  const handleSort = useCallback((columnKey: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  }, [sortable, columns, sortColumn]);

  // Handle selection
  const handleRowSelection = useCallback((row: T, selected: boolean) => {
    if (!selectable || !onSelectionChange) return;

    if (multiSelect) {
      const newSelection = selected
        ? [...selectedRows, row]
        : selectedRows.filter(r => r !== row);
      onSelectionChange(newSelection);
    } else {
      onSelectionChange(selected ? [row] : []);
    }
  }, [selectable, multiSelect, selectedRows, onSelectionChange]);

  // Handle select all
  const handleSelectAll = useCallback((selected: boolean) => {
    if (!selectable || !multiSelect || !onSelectionChange) return;
    onSelectionChange(selected ? filteredAndSortedData : []);
  }, [selectable, multiSelect, onSelectionChange]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchable && searchQuery) {
      result = result.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply column filters
    if (filterable) {
      Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
        if (filterValue) {
          const column = columns.find(col => col.key === columnKey);
          if (column?.filterFn) {
            result = result.filter(row => column.filterFn!(row[columnKey], filterValue));
          } else {
            result = result.filter(row =>
              String(row[columnKey]).toLowerCase().includes(filterValue.toLowerCase())
            );
          }
        }
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      const column = columns.find(col => col.key === sortColumn);
      if (column?.sortFn) {
        result.sort((a, b) => {
          const sortResult = column.sortFn!(a, b);
          return sortDirection === 'desc' ? -sortResult : sortResult;
        });
      } else {
        result.sort((a, b) => {
          const aValue = a[sortColumn];
          const bValue = b[sortColumn];
          
          if (aValue < bValue) return sortDirection === 'desc' ? 1 : -1;
          if (aValue > bValue) return sortDirection === 'desc' ? -1 : 1;
          return 0;
        });
      }
    }

    return result;
  }, [data, columns, searchable, searchQuery, filterable, columnFilters, sortColumn, sortDirection]);

  // Check if all rows are selected
  const allSelected = selectable && multiSelect && filteredAndSortedData.length > 0 &&
    filteredAndSortedData.every(row => selectedRows.includes(row));
  const someSelected = selectable && selectedRows.length > 0 && !allSelected;

  return (
    <div className={cn('w-full', containerClassName)}>
      {/* Table Controls */}
      {(searchable || filterable || onRefresh || onExport) && (
        <motion.div
          className="flex items-center justify-between gap-4 mb-4"
          initial={animate ? { opacity: 0, y: -10 } : false}
          animate={animate ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchable && (
              <EnhancedInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                clearable
                onClear={() => setSearchQuery('')}
                className="w-64"
              />
            )}
            
            {/* Filter Toggle */}
            {filterable && (
              <EnhancedButton
                variant="outline"
                size="sm"
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filters
              </EnhancedButton>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Refresh */}
            {onRefresh && (
              <EnhancedButton
                variant="outline"
                size="sm"
                onClick={onRefresh}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Refresh
              </EnhancedButton>
            )}
            
            {/* Export */}
            {onExport && (
              <EnhancedButton
                variant="outline"
                size="sm"
                onClick={onExport}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export
              </EnhancedButton>
            )}
          </div>
        </motion.div>
      )}

      {/* Table Container */}
      <motion.div
        className={cn(
          'relative overflow-auto rounded-lg border border-gray-200 dark:border-gray-700',
          maxHeight && 'max-h-[var(--max-height)]'
        )}
        style={{ '--max-height': typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } as any}
        initial={animate ? { opacity: 0, scale: 0.95 } : false}
        animate={animate ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <table className={cn(enhancedTableVariants({ variant, size }), className)}>
          {/* Table Header */}
          <thead className={cn(stickyHeader && 'sticky top-0 z-10', headerClassName)}>
            <tr>
              {/* Selection Header */}
              {selectable && multiSelect && (
                <th className={tableHeaderVariants({ size })}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              
              {/* Column Headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    tableHeaderVariants({ sortable: column.sortable, size }),
                    column.headerClassName
                  )}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    textAlign: column.align,
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <SortIcon
                        direction={sortColumn === column.key ? sortDirection : null}
                      />
                    )}
                  </div>
                </th>
              ))}
              
              {/* Actions Header */}
              {actions.length > 0 && (
                <th className={tableHeaderVariants({ size })}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={bodyClassName}>
            <AnimatePresence>
              {loading ? (
                <LoadingSkeleton columns={columns} />
              ) : error ? (
                <ErrorState error={error} onRefresh={onRefresh} />
              ) : filteredAndSortedData.length === 0 ? (
                <EmptyState message={emptyMessage} onRefresh={onRefresh} />
              ) : (
                filteredAndSortedData.map((row, rowIndex) => {
                  const isSelected = selectedRows.includes(row);
                  const rowClassNameValue = typeof rowClassName === 'function'
                    ? rowClassName(row, rowIndex)
                    : rowClassName;

                  return (
                    <motion.tr
                      key={rowIndex}
                      className={cn(
                        tableRowVariants({
                          variant,
                          selectable,
                          selected: isSelected,
                        }),
                        rowClassNameValue
                      )}
                      initial={animate ? { opacity: 0, y: 10 } : false}
                      animate={animate ? { opacity: 1, y: 0 } : false}
                      exit={animate ? { opacity: 0, y: -10 } : false}
                      transition={{
                        duration: 0.2,
                        delay: animate ? rowIndex * 0.02 : 0,
                      }}
                      layout={animate}
                    >
                      {/* Selection Cell */}
                      {selectable && (
                        <td className={tableCellVariants({ size })}>
                          <input
                            type={multiSelect ? 'checkbox' : 'radio'}
                            checked={isSelected}
                            onChange={(e) => handleRowSelection(row, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                      )}
                      
                      {/* Data Cells */}
                      {columns.map((column) => {
                        const value = row[column.key];
                        const cellClassNameValue = typeof cellClassName === 'function'
                          ? cellClassName(value, row, column, rowIndex)
                          : cellClassName;

                        return (
                          <td
                            key={column.key}
                            className={cn(
                              tableCellVariants({ size }),
                              column.className,
                              cellClassNameValue
                            )}
                            style={{ textAlign: column.align }}
                          >
                            {column.render ? column.render(value, row, rowIndex) : value}
                          </td>
                        );
                      })}
                      
                      {/* Actions Cell */}
                      {actions.length > 0 && (
                        <td className={tableCellVariants({ size })}>
                          <div className="flex items-center gap-1">
                            {actions.map((action) => {
                              const isDisabled = action.disabled?.(row, rowIndex);
                              
                              return (
                                <EnhancedButton
                                  key={action.key}
                                  variant={action.variant || 'ghost'}
                                  size="sm"
                                  onClick={() => action.onClick(row, rowIndex)}
                                  disabled={isDisabled}
                                  className={cn('h-8 w-8 p-0', action.className)}
                                  title={action.label}
                                >
                                  {action.icon}
                                </EnhancedButton>
                              );
                            })}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      {pagination && (
        <motion.div
          className="flex items-center justify-between mt-4"
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={animate ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          
          <div className="flex items-center gap-2">
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </EnhancedButton>
            
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
            >
              Next
            </EnhancedButton>
          </div>
        </motion.div>
      )}
    </div>
  );
};

EnhancedTable.displayName = 'EnhancedTable';

export { EnhancedTable, enhancedTableVariants };
export type { EnhancedTableProps, ColumnDef, TableAction };