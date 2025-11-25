return (
    <SafeAreaView style={profileScreenStyles.safeArea}>
        <View style={profileScreenStyles.container}>
            <ScrollView contentContainerStyle={profileScreenStyles.scrollContent}>
                <View style={profileScreenStyles.header}>
                    <View style={profileScreenStyles.avatarWrapper}>
                        <Image source={avatarSource} style={profileScreenStyles.avatar} />
                        {editing && (
                            <TouchableOpacity style={editableAvatarStyle} onPress={promptImageSelection}>
                                <Ionicons name="camera-outline" size={30} color="#fff" />
                                <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>
                                    Cambiar
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {editing ? (
                        <>
                            <TextInput
                                style={profileScreenStyles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Nombre"
                                placeholderTextColor={palette.textMuted}
                            />
                            <TextInput
                                style={[
                                    profileScreenStyles.input,
                                    { backgroundColor: palette.disabled, color: palette.textMuted },
                                ]}
                                value={email}
                                editable={false}
                                placeholder="Email (no editable)"
                                placeholderTextColor={palette.textMuted}
                            />

                            <TouchableOpacity
                                style={[profileScreenStyles.saveButton, saving && { opacity: 0.7 }]}
                                onPress={handleSaveProfile}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#1a1a1a" />
                                ) : (
                                    <Text style={profileScreenStyles.saveButtonText}>Guardar Cambios</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={profileScreenStyles.cancelButton}
                                onPress={() => {
                                    setEditing(false);
                                    setNewAvatarUri(profile?.avatar_url ?? null);
                                    setName(profile?.name || user?.user_metadata?.full_name || 'Usuario');
                                    setEmail(user?.email || '');
                                    setFetchError(null);
                                }}
                            >
                                <Text style={profileScreenStyles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={profileScreenStyles.name}>{name}</Text>

                            {/* Rating */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const rating = Number(profile?.rating ?? 0);
                                    const fill = Math.min(Math.max(rating - (star - 1), 0), 1);

                                    return (
                                        <View key={star} style={{ marginRight: 2 }}>
                                            <Ionicons name="star-outline" size={25} color="#ccc" />
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    width: 30 * fill,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Ionicons name="star" size={25} color={palette.accent} />
                                            </View>
                                        </View>
                                    );
                                })}
                                <Text
                                    style={{
                                        marginLeft: 6,
                                        fontSize: 25,
                                        fontWeight: 'bold',
                                        color: palette.accent,
                                    }}
                                >
                                    {Number(profile?.rating ?? 0).toFixed(1)}
                                </Text>
                            </View>

                            {/* Email */}
                            <View style={profileScreenStyles.row}>
                                <Feather name="mail" size={15} color={palette.accent} />
                                <Text style={profileScreenStyles.email}>{email}</Text>
                            </View>

                            {/* Joining */}
                            <View style={profileScreenStyles.row}>
                                <Feather name="user" size={15} color={palette.accent} />
                                <Text style={profileScreenStyles.joiningDate}>
                                    Miembro desde {joiningDate}
                                </Text>
                            </View>

                            {/* ======= SALDO INTEGRADO ======= */}
                            <View style={[profileScreenStyles.card, { marginTop: 16 }]}>
                                <Text style={profileScreenStyles.cardLabel}>Saldo disponible</Text>
                                <View style={{ marginTop: 6 }}>
                                    <Text style={profileScreenStyles.balanceValue}>
                                        {formatPrice(profile?.balance ?? 0)}
                                    </Text>
                                    <Text style={profileScreenStyles.balanceHint}>
                                        Usa este saldo para pagar vehículos en Turboo.
                                    </Text>
                                </View>
                            </View>
                            {/* ================================= */}

                            <TouchableOpacity
                                style={profileScreenStyles.button}
                                onPress={() => setEditing(true)}
                            >
                                <Feather name="edit" size={20} color="white" />
                                <Text style={profileScreenStyles.buttonText}> Editar perfil</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <View style={profileScreenStyles.separator} />

                    <View style={profileScreenStyles.statsRow}>
                        <View style={profileScreenStyles.statColumn}>
                            <View style={profileScreenStyles.iconRow}>
                                <Feather name="truck" size={20} color={palette.accent} />
                                <Text style={profileScreenStyles.statNumber}>
                                    {publishedCars.length}
                                </Text>
                            </View>
                            <Text style={profileScreenStyles.statLabel}>Publicaciones</Text>
                        </View>

                        <View style={profileScreenStyles.statColumn}>
                            <View style={profileScreenStyles.iconRow}>
                                <Feather name="heart" size={20} color={palette.accent} />
                                <Text style={profileScreenStyles.statNumber}>
                                    {likedCars.length}
                                </Text>
                            </View>
                            <Text style={profileScreenStyles.statLabel}>Favoritos</Text>
                        </View>
                    </View>

                    <View style={profileScreenStyles.sectionDivider} />
                </View>

                {/* Activity header */}
                <View style={profileScreenStyles.activitySection}>
                    <Text style={profileScreenStyles.activityTitle}>Mi Actividad</Text>
                    <Text style={profileScreenStyles.activitySubtitle}>
                        Revisa tus publicaciones y coches favoritos
                    </Text>
                </View>

                {/* Tabs */}
                <View style={profileScreenStyles.tabBar}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('published')}
                        style={[
                            profileScreenStyles.tab,
                            activeTab === 'published' && profileScreenStyles.activeTab,
                        ]}
                    >
                        <View style={profileScreenStyles.tabContent}>
                            <Feather
                                name="truck"
                                size={18}
                                color={activeTab === 'published' ? 'black' : palette.accent}
                            />
                            <Text
                                style={[
                                    profileScreenStyles.tabText,
                                    activeTab === 'published' &&
                                        profileScreenStyles.tabTabTextActive,
                                ]}
                            >
                                {' '}
                                Mis Coches
                            </Text>
                            <Text
                                style={[
                                    profileScreenStyles.tabNumber,
                                    activeTab === 'published' &&
                                        profileScreenStyles.tabNumberActive,
                                ]}
                            >
                                {publishedCars.length}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('favorites')}
                        style={[
                            profileScreenStyles.tab,
                            activeTab === 'favorites' && profileScreenStyles.activeTab,
                        ]}
                    >
                        <View style={profileScreenStyles.tabContent}>
                            <Feather
                                name="heart"
                                size={18}
                                color={activeTab === 'favorites' ? 'black' : palette.accent}
                            />
                            <Text
                                style={[
                                    profileScreenStyles.tabText,
                                    activeTab === 'favorites' &&
                                        profileScreenStyles.tabTabTextActive,
                                ]}
                            >
                                {' '}
                                Favoritos
                            </Text>
                            <Text
                                style={[
                                    profileScreenStyles.tabNumber,
                                    activeTab === 'favorites' &&
                                        profileScreenStyles.tabNumberActive,
                                ]}
                            >
                                {likedCars.length}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={profileScreenStyles.listWrapper}>
                    <TabContent />

                    <TouchableOpacity
                        style={profileScreenStyles.signOutButton}
                        onPress={signOut}
                    >
                        <Text style={profileScreenStyles.signOutButtonText}>
                            Cerrar sesión
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
);
