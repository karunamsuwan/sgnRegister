import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Alert, SafeAreaView, useColorScheme, TouchableOpacity, Linking } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FileData {
    fileUrl: string;
    firstName: string;
    lastName: string;
    userId: number;
    fileName: string;
}

const Files = () => {
    const colorScheme = useColorScheme();
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://192.168.1.101:3000';

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/register/files`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: FileData[] = await response.json();

            console.log(data);


            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
            Alert.alert('Error', 'Failed to fetch files');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const renderFile = ({ item }: { item: FileData }) => (
        <TouchableOpacity style={[styles.fileItem, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}
            onPress={() => Linking.openURL(item.fileUrl)}
        >
            <Image
                source={{ uri: item.fileUrl }}
                style={styles.fileImage}
                onError={() => console.log('Image load error:', item.fileUrl)}
            />
            <View style={styles.fileInfo}>
                <ThemedText style={styles.fileName}>{item.fileName}</ThemedText>
                <ThemedText style={styles.userId}>User :  {item.firstName} {item.lastName}</ThemedText>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ThemedText>Loading files...</ThemedText>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ThemedText style={styles.title}>SGN FilesDrive</ThemedText>
            <FlatList
                data={files}
                renderItem={renderFile}
                keyExtractor={(item, index) => index.toString()}
                refreshing={loading}
                onRefresh={fetchFiles}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    fileItem: {
        flexDirection: 'row',
        padding: 12,
        marginBottom: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    fileImage: {
        width: 80,
        height: 80,
        borderRadius: 4,
        marginRight: 12,
    },
    fileInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    fileName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    fileId: {
        fontSize: 12,
        color: '#acacac',
    },
    userId: {
        fontSize: 12,
        color: '#acacac',
    },
});

export default Files;
