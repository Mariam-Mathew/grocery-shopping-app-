import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, STORES } from '../types/shopping';

interface CartFilterOptions {
  searchQuery: string;
  selectedStore: string;
  selectedCategory: string;
  showCheckedOnly: boolean;
  sortBy: 'name' | 'price' | 'list';
  sortOrder: 'asc' | 'desc';
}

interface CartFiltersProps {
  visible: boolean;
  onClose: () => void;
  filters: CartFilterOptions;
  onFiltersChange: (filters: CartFilterOptions) => void;
  onReset: () => void;
}

export default function CartFilters({
  visible,
  onClose,
  filters,
  onFiltersChange,
  onReset,
}: CartFiltersProps) {
  const [tempFilters, setTempFilters] = useState<CartFilterOptions>(filters);

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: CartFilterOptions = {
      searchQuery: '',
      selectedStore: 'all',
      selectedCategory: 'all',
      showCheckedOnly: false,
      sortBy: 'name',
      sortOrder: 'asc',
    };
    setTempFilters(defaultFilters);
    onReset();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </Pressable>
          <Text style={styles.title}>Cart Filters</Text>
          <Pressable onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search items..."
                value={tempFilters.searchQuery}
                onChangeText={(text) => setTempFilters(prev => ({ ...prev, searchQuery: text }))}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Store Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Store</Text>
            <View style={styles.chipsContainer}>
              <Pressable
                style={[
                  styles.chip,
                  tempFilters.selectedStore === 'all' && styles.chipSelected,
                ]}
                onPress={() => setTempFilters(prev => ({ ...prev, selectedStore: 'all' }))}
              >
                <Text style={[
                  styles.chipText,
                  tempFilters.selectedStore === 'all' && styles.chipTextSelected,
                ]}>
                  All Stores
                </Text>
              </Pressable>
              {STORES.map((store) => (
                <Pressable
                  key={store.id}
                  style={[
                    styles.chip,
                    tempFilters.selectedStore === store.name && styles.chipSelected,
                  ]}
                  onPress={() => setTempFilters(prev => ({ ...prev, selectedStore: store.name }))}
                >
                  <Text style={[
                    styles.chipText,
                    tempFilters.selectedStore === store.name && styles.chipTextSelected,
                  ]}>
                    {store.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipsContainer}>
                <Pressable
                  style={[
                    styles.chip,
                    tempFilters.selectedCategory === 'all' && styles.chipSelected,
                  ]}
                  onPress={() => setTempFilters(prev => ({ ...prev, selectedCategory: 'all' }))}
                >
                  <Text style={[
                    styles.chipText,
                    tempFilters.selectedCategory === 'all' && styles.chipTextSelected,
                  ]}>
                    All
                  </Text>
                </Pressable>
                {CATEGORIES.map((category) => (
                  <Pressable
                    key={category}
                    style={[
                      styles.chip,
                      tempFilters.selectedCategory === category && styles.chipSelected,
                    ]}
                    onPress={() => setTempFilters(prev => ({ ...prev, selectedCategory: category }))}
                  >
                    <Text style={[
                      styles.chipText,
                      tempFilters.selectedCategory === category && styles.chipTextSelected,
                    ]}>
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Status Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusContainer}>
              <Pressable
                style={[
                  styles.statusOption,
                  !tempFilters.showCheckedOnly && styles.statusOptionSelected,
                ]}
                onPress={() => setTempFilters(prev => ({ ...prev, showCheckedOnly: false }))}
              >
                <Ionicons
                  name={tempFilters.showCheckedOnly ? 'square-outline' : 'checkbox'}
                  size={20}
                  color={tempFilters.showCheckedOnly ? '#999' : '#4CAF50'}
                />
                <Text style={styles.statusText}>All Items</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.statusOption,
                  tempFilters.showCheckedOnly && styles.statusOptionSelected,
                ]}
                onPress={() => setTempFilters(prev => ({ ...prev, showCheckedOnly: true }))}
              >
                <Ionicons
                  name={tempFilters.showCheckedOnly ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={tempFilters.showCheckedOnly ? '#4CAF50' : '#999'}
                />
                <Text style={styles.statusText}>Checked Only</Text>
              </Pressable>
            </View>
          </View>

          {/* Sort Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.sortContainer}>
              <View style={styles.sortOptions}>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'price', label: 'Price' },
                  { key: 'list', label: 'List' },
                ].map((option) => (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.sortOption,
                      tempFilters.sortBy === option.key && styles.sortOptionSelected,
                    ]}
                    onPress={() => setTempFilters(prev => ({ ...prev, sortBy: option.key as any }))}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      tempFilters.sortBy === option.key && styles.sortOptionTextSelected,
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              
              <View style={styles.sortOrderContainer}>
                <Pressable
                  style={[
                    styles.sortOrderOption,
                    tempFilters.sortOrder === 'asc' && styles.sortOrderOptionSelected,
                  ]}
                  onPress={() => setTempFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                >
                  <Ionicons
                    name="arrow-up"
                    size={16}
                    color={tempFilters.sortOrder === 'asc' ? '#4CAF50' : '#999'}
                  />
                  <Text style={styles.sortOrderText}>Ascending</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.sortOrderOption,
                    tempFilters.sortOrder === 'desc' && styles.sortOrderOptionSelected,
                  ]}
                  onPress={() => setTempFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                >
                  <Ionicons
                    name="arrow-down"
                    size={16}
                    color={tempFilters.sortOrder === 'desc' ? '#4CAF50' : '#999'}
                  />
                  <Text style={styles.sortOrderText}>Descending</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <Pressable style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
  },
  resetText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  statusContainer: {
    gap: 10,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusOptionSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  statusText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 10,
  },
  sortContainer: {
    gap: 15,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sortOptionSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sortOptionTextSelected: {
    color: '#fff',
  },
  sortOrderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  sortOrderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sortOrderOptionSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  sortOrderText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 5,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
