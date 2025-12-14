import React, { useCallback, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Keyboard, RefreshControl, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'

import { searchStyles as styles } from './SearchStyles'
import { palette } from '../../theme/palette'
import { useSearch } from './useSearch'
import SearchSuggestions from '../../components/SearchSuggestions'
import SearchFilters from '../../components/SearchFilters'
import ImageAnalysisButton from '../../components/ImageAnalisisButton'
import ActiveFiltersChips from '../../components/ActiveFiltersChips'
import ListingCard from '../../components/ListingCard'

const CATEGORIES = [
    { id: 'classics', title: 'Classics', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop', filter: { yearMax: 1990 } },
    { id: 'high-end', title: 'High-end', image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=2070&auto=format&fit=crop', filter: { priceMin: 50000 } },
    { id: 'sports', title: 'Sports', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop', filter: { bodyType: 'Coupe' } },
    { id: 'near-me', title: 'Near me', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop', action: 'location' },
    { id: 'convertibles', title: 'Convertibles', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2074&auto=format&fit=crop', filter: { bodyType: 'Convertible' } },
    { id: 'suv', title: 'SUV & Off-road', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2071&auto=format&fit=crop', filter: { bodyType: 'SUV' } },
]

export default function SearchScreen() {
    const navigation = useNavigation()
    const {
        filteredListings,
        initialLoading,
        refreshing,
        loadingMore,
        error,
        handleRefresh,
        handleLoadMore,
        search,
    } = useSearch()

    const [image, setImage] = useState(null)
    const [aiMessageVisible, setAiMessageVisible] = useState(false)
    const [aiMessage, setAiMessage] = useState('')

    // Visual Search Logic
    const pickImageFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') return

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            const uri = result.assets ? result.assets[0].uri : result.uri
            setImage(uri)
        }
    }

    const handleAnalysisComplete = (data) => {
        if (!data) return

        const newFilters = { ...search.filters }

        if (data.make) {
            newFilters.make = [data.make]
            search.setSearchText(`${data.make}`)
            search.setShowSuggestions(false)
        }

        if (data.color) {
            newFilters.color = [data.color]
        }

        if (data.price) {
            const parsedPrice = Number(String(data.price).replace(/[^0-9.]/g, ''))
            if (!isNaN(parsedPrice) && parsedPrice > 0) {
                const min = Math.max(search.priceRange.min, Math.round(parsedPrice * 0.8))
                const max = Math.min(search.priceRange.max, Math.round(parsedPrice * 1.2))
                newFilters.priceMin = min
                newFilters.priceMax = max
            }
        }

        search.setFilters(newFilters)

        const parts = []
        if (newFilters.make && newFilters.make.length) parts.push(`Brand: ${newFilters.make.join(', ')}`)
        if (newFilters.color && newFilters.color.length) parts.push(`Color: ${newFilters.color.join(', ')}`)

        const banner = parts.length > 0
            ? `AI-proposed filters applied based on image analysis.`
            : 'AI analyzed the image.'

        setAiMessage(banner)
        setAiMessageVisible(true)
        setTimeout(() => setAiMessageVisible(false), 5000)
        setTimeout(() => setImage(null), 500)
    }

    const handleCategoryPress = (category) => {
        search.setSearchText('')
        search.setShowSuggestions(false)

        if (category.filter) {
            const newFilters = { ...search.filters }
            if (category.filter.bodyType) {
                newFilters.bodyType = [category.filter.bodyType]
            }
            if (category.filter.priceMin !== undefined) newFilters.priceMin = category.filter.priceMin
            if (category.filter.priceMax !== undefined) newFilters.priceMax = category.filter.priceMax
            if (category.filter.yearMin !== undefined) newFilters.yearMin = category.filter.yearMin
            if (category.filter.yearMax !== undefined) newFilters.yearMax = category.filter.yearMax
            search.setFilters(newFilters)
        } else if (category.action === 'filter_year' || category.action === 'filter_condition') {
            search.setShowFilters(true)
        } else if (category.action === 'location') {
            console.log('Location feature coming soon')
        }
    }

    const renderListing = useCallback(
        ({ item }) => (
            <ListingCard
                item={item}
                style={styles.listCardWrapper}
                onPress={() =>
                    navigation.navigate('ListingDetail', {
                        listingId: item.id,
                        listing: item,
                    })
                }
            />
        ),
        [navigation]
    )

    const renderGridItem = useCallback(
        ({ item }) => (
            <ListingCard
                item={item}
                style={styles.gridCardWrapper}
                onPress={() =>
                    navigation.navigate('ListingDetail', {
                        listingId: item.id,
                        listing: item,
                    })
                }
            />
        ),
        [navigation]
    )

    const listFooter = useCallback(() => {
        if (!loadingMore) return null
        return (
            <View style={{ padding: 20 }}>
                <ActivityIndicator size="small" color={palette.accent} />
            </View>
        )
    }, [loadingMore])

    const isSearchActive = search.searchText.length > 0 || search.showFilters || (search.filters && (search.filters.make?.length > 0 || search.filters.priceMin > 0))

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>

                {/* Header & Search Bar */}
                <View style={styles.header}>
                    {/* Background Gradient for Header */}
                    <LinearGradient
                        colors={['rgba(198, 133, 21, 0.1)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 200,
                            zIndex: -1,
                        }}
                    />

                    <View style={styles.searchBarContainer}>
                        <View style={styles.searchInputWrapper}>
                            <TouchableOpacity style={styles.searchIcon}>
                                <Ionicons name="search" size={20} color={palette.textMuted} />
                            </TouchableOpacity>
                            <TextInput
                                value={search.searchText}
                                onChangeText={(text) => {
                                    search.setSearchText(text)
                                    search.updateSuggestions(text)
                                }}
                                onFocus={() => search.setIsFocused(true)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        search.setShowSuggestions(false)
                                        search.setIsFocused(false)
                                    }, 200)
                                }}
                                placeholder="Search cars, members..."
                                placeholderTextColor={palette.textMuted}
                                style={styles.searchInput}
                                returnKeyType="search"
                            />
                            {search.searchText.length > 0 && (
                                <TouchableOpacity onPress={search.clearSearch}>
                                    <Ionicons name="close-circle" size={18} color={palette.textMuted} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Visual Search Button */}
                        <TouchableOpacity style={styles.visualSearchButton} onPress={pickImageFromGallery}>
                            <Ionicons name="image-outline" size={24} color={palette.accent} />
                        </TouchableOpacity>
                    </View>

                    {/* Search Suggestions */}
                    <SearchSuggestions
                        suggestions={search.suggestions}
                        onSuggestionPress={search.handleSuggestionPress}
                        visible={search.showSuggestions && search.isFocused}
                    />

                    {/* AI Analysis & Message */}
                    {image && (
                        <View style={styles.aiSearchContainer}>
                            <View style={styles.aiPreviewRow}>
                                <Image source={{ uri: image }} style={styles.aiPreviewImage} />
                                <ImageAnalysisButton
                                    imageUri={image}
                                    onAnalysisComplete={handleAnalysisComplete}
                                    style={{ flex: 1 }}
                                />
                                <TouchableOpacity style={styles.removeImageButtonSmall} onPress={() => setImage(null)}>
                                    <Text style={styles.removeImageX}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {aiMessageVisible && (
                        <View style={{ backgroundColor: palette.surface, padding: 10, borderRadius: 8, marginBottom: 10 }}>
                            <Text style={{ color: palette.textPrimary }}>{aiMessage}</Text>
                        </View>
                    )}

                    {/* Controls (Sort, Filter, View) - Only show when searching or browsing results */}
                    <View style={styles.controlsRow}>
                        <TouchableOpacity onPress={search.cycleSort} style={styles.controlButton}>
                            <Ionicons name="swap-vertical" size={16} color={palette.accent} />
                            <Text style={styles.controlButtonText}>
                                {search.sortBy === 'date' ? 'Date' : 'Price'} {search.sortDir === 'desc' ? '↓' : '↑'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => search.setShowFilters(true)}
                            style={[styles.controlButton, search.showFilters && styles.controlButtonActive]}
                        >
                            <Ionicons name="options" size={16} color={search.showFilters ? palette.background : palette.accent} />
                            <Text style={[styles.controlButtonText, search.showFilters && styles.controlButtonTextActive]}>Filters</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => search.setViewMode(search.viewMode === 'list' ? 'grid' : 'list')}
                            style={styles.controlButton}
                        >
                            <Ionicons name={search.viewMode === 'list' ? 'grid' : 'list'} size={16} color={palette.accent} />
                        </TouchableOpacity>
                    </View>

                    {/* Active Filters Chips */}
                    <ActiveFiltersChips
                        filters={search.filters}
                        priceRange={search.priceRange}
                        yearRange={search.yearRange}
                        onRemoveFilter={search.removeFilter}
                        onClearAll={search.clearFilters}
                    />
                </View>

                {/* Filters Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={search.showFilters}
                    onRequestClose={() => search.setShowFilters(false)}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', paddingTop: 40 }}>
                        <SearchFilters
                            visible={true}
                            filters={search.filters}
                            setFilters={search.setFilters}
                            priceRange={search.priceRange}
                            yearRange={search.yearRange}
                            makeOptions={search.makeOptions}
                            colorOptions={search.colorOptions}
                            fuelTypeOptions={search.fuelTypeOptions}
                            transmissionOptions={search.transmissionOptions}
                            bodyTypeOptions={search.bodyTypeOptions}
                            conditionOptions={search.conditionOptions}
                            doorsOptions={search.doorsOptions}
                            onApply={() => {
                                search.setShowFilters(false)
                                Keyboard.dismiss()
                            }}
                            onClear={search.clearFilters}
                            onClose={() => search.setShowFilters(false)}
                        />
                    </View>
                </Modal>

                {/* Main Content */}
                <FlatList
                    data={filteredListings}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={search.viewMode === 'grid' ? renderGridItem : renderListing}
                    numColumns={search.viewMode === 'grid' ? 2 : 1}
                    columnWrapperStyle={search.viewMode === 'grid' ? styles.columnWrapper : undefined}
                    key={search.viewMode === 'grid' ? 'grid' : 'list'}
                    contentContainerStyle={
                        search.viewMode === 'grid' ? styles.gridContainer : styles.listContent
                    }
                    ListHeaderComponent={
                        <>
                            {!search.showFilters && (
                                <View style={styles.aiInfoSection}>
                                    <Text style={styles.aiInfoText}>
                                        You can search by typing exactly what you need. Powered by AI.
                                    </Text>
                                </View>
                            )}
                            <View style={styles.categoriesSection}>
                                <Text style={styles.sectionTitle}>Or explore by category</Text>
                                <View style={styles.categoriesGrid}>
                                    <FlatList
                                        data={CATEGORIES}
                                        numColumns={2}
                                        keyExtractor={(item) => item.id}
                                        scrollEnabled={false}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.categoryCard}
                                                onPress={() => handleCategoryPress(item)}
                                                activeOpacity={0.8}
                                            >
                                                <Image source={{ uri: item.image }} style={styles.categoryImage} />
                                                <View style={styles.categoryOverlay}>
                                                    <Text style={styles.categoryTitle}>{item.title}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                            {filteredListings.length > 0 && (
                                <Text style={styles.sectionTitle}>
                                    {isSearchActive ? 'Search Results' : 'All Listings'}
                                </Text>
                            )}
                        </>
                    }
                    ListEmptyComponent={
                        !initialLoading && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>
                                    {search.searchText || isSearchActive
                                        ? 'No matches found.'
                                        : 'No listings available.'}
                                </Text>
                            </View>
                        )
                    }
                    ListFooterComponent={listFooter}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={palette.accent}
                        />
                    }
                />

                {initialLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={palette.accent} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}
