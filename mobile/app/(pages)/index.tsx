import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, View, useColorScheme } from 'react-native';
import ThemedInput from '@/components/ThemedInput';
import * as DocumentPicker from 'expo-document-picker';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';

interface UserProp {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
    address: string
}

interface FileItem {
    uri: string;
    type: string;
    name: string;
    isImage: boolean;
    size?: number;
}

const Index = () => {
    const [user, setUser] = useState<UserProp>({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
        address: ''
    });

    const [files, setFiles] = useState<FileItem[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const colorScheme = useColorScheme();

    /**
     * เลือกไฟล์ที่ต้องการอัพโหลด
     */
    const pickFile = async () => {
        try {
            const result: any = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                multiple: true,
                copyToCacheDirectory: true,
            });

            console.log(result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newFiles: FileItem[] = result.assets.map((asset: any) => {
                    const isImage = asset.mimeType?.startsWith('image/') ?? false;

                    return {
                        uri: asset.uri,
                        type: asset.mimeType ?? 'application/octet-stream',
                        name: asset.name,
                        isImage,
                        size: asset.size,
                    };
                });

                console.log('New files:', newFiles);

                setFiles(prev => [...prev, ...newFiles]);
            }
        } catch (err) {
            console.error('Pick file error:', err);
        }
    };

    // const handleSave = async () => {
    //     try {
    //         const formData = new FormData();

    //         formData.append('userData', JSON.stringify(user));

    //         files.forEach((file, index) => {
    //             const cleanFileName = file.name
    //                 .replace(/[^\w.\-ก-๙\s]/gi, '')
    //                 .replace(/\s+/g, '_');
    //             formData.append('files', {
    //                 uri: file.uri,
    //                 type: file.type,
    //                 name: cleanFileName,
    //             } as any);
    //         });

    //         console.log('Sending data:', { user, filesCount: files.length });

    //         const response = await fetch('http://192.168.1.101:3000/register', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //             body: formData,
    //         });

    //         if (response.ok) {
    //             const result = await response.json();
    //             console.log('Success:', result);
    //         } else {
    //             console.error('Error:', response.status, response.statusText);
    //         }

    //     } catch (error) {
    //         console.error('Save error:', error);
    //     }
    // };


    /**
     * กดบันทึก Regiister
     */
    const handleSave = async () => {

        if (user.firstName === '' || user.lastName === '' || user.username === '' || user.password === '') {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        const formData = new FormData();
        formData.append('userData', JSON.stringify(user));

        files.forEach(file => {
            const cleanFileName = file.name.replace(/[^\w.\-ก-๙\s]/gi, '').replace(/\s+/g, '_');
            formData.append('files', {
                uri: file.uri,
                type: file.type,
                name: cleanFileName,
            } as any);
        });

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://192.168.1.101:3000/register');

        /**
         * ติดตาม percent ของการอัพโหลด
         */
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log('Upload success:', xhr.responseText);
                alert('Upload success');
                setUploadProgress(0);
            } else {
                console.error('Upload failed', xhr.responseText);
            }
        };

        xhr.onerror = () => {
            console.error('Upload error');
        };

        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(formData);
    };

    return (
        <SafeAreaView style={styles.constainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <Image
                    source={{
                        uri: 'https://sgn.co.th/wp-content/uploads/2020/09/LOGO_Synergy-2048x759.png',
                        height: 80,
                        width: 150
                    }}
                    style={{
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        backgroundColor: colorScheme === 'dark' ? '' : '#251bbd',
                    }}
                />

                <ThemedInput label='ชื่อ *' onChangeText={text => setUser(prev => ({ ...prev, firstName: text }))} />
                <ThemedInput label='นามสกุล *' onChangeText={text => setUser(prev => ({ ...prev, lastName: text }))} />
                <ThemedInput label='username *' onChangeText={text => setUser(prev => ({ ...prev, username: text }))} />
                <ThemedInput label='password *' onChangeText={text => setUser(prev => ({ ...prev, password: text }))} />
                <ThemedInput label='email' onChangeText={text => setUser(prev => ({ ...prev, email: text }))} />
                <ThemedInput label='ที่อยู่' onChangeText={text => setUser(prev => ({ ...prev, address: text }))} />

                <TouchableOpacity
                    style={{
                        height: 30,
                        borderWidth: 1,
                        justifyContent: 'center',
                        marginVertical: 10,
                        backgroundColor: '#251bbd',
                        borderRadius: 5
                    }}
                    onPress={pickFile}
                >
                    <ThemedText lightColor='white' style={{ textAlign: 'center' }}>เลือกไฟล์</ThemedText>
                </TouchableOpacity>


                <View style={{ alignItems: 'center' }}>
                    <ScrollView
                        horizontal
                        style={{ height: 120, width: 200, marginTop: 10, borderWidth: 1 }}
                        contentContainerStyle={{ alignItems: 'center' }}
                    >
                        {files.length === 0 ? (
                            <ThemedText style={{ color: '#888', width: '100%', padding: 40 }}>
                                ไม่มีไฟล์ที่เลือก
                            </ThemedText>
                        ) : (
                            files.map((file, index) => (
                                <View
                                    key={index}
                                    style={{ marginRight: 10, alignItems: 'center' }}
                                >
                                    {file.isImage ? (
                                        <Image
                                            source={{ uri: file.uri }}
                                            style={{ width: 100, height: 100, borderRadius: 8 }}
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: 8,
                                                backgroundColor: '#eee',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ThemedText style={{ fontSize: 40 }}>📄</ThemedText>
                                        </View>
                                    )}
                                    <ThemedText style={{ fontSize: 10, width: 100 }} numberOfLines={1}>
                                        {file.name}
                                    </ThemedText>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>

                <TouchableOpacity
                    style={{
                        height: 30,
                        borderWidth: 1,
                        justifyContent: 'center',
                        marginVertical: 10,
                        borderRadius: 5
                    }}
                    onPress={() => {
                        setFiles([]);
                    }}
                >
                    <ThemedText style={{ textAlign: 'center' }}>ล้างไฟล์</ThemedText>
                </TouchableOpacity>

                {uploadProgress > 0 && (
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBarFill, { width: `${uploadProgress}%` }]} />
                        <ThemedText style={styles.progressText}>{uploadProgress}%</ThemedText>
                    </View>
                )}

                <TouchableOpacity style={{
                    height: 30,
                    borderWidth: 1,
                    justifyContent: 'center',
                    marginVertical: 10,
                    backgroundColor: '#251bbd',
                    borderRadius: 5
                }}
                    onPress={handleSave}>

                    <ThemedText lightColor='white' style={{ textAlign: 'center' }}>บันทึก</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    height: 30,
                    borderWidth: 1,
                    justifyContent: 'center',
                    marginVertical: 10,
                    backgroundColor: '#251bbd',
                    borderRadius: 5
                }}
                    onPress={() => {
                        router.push({ pathname: '/files' });
                    }}>

                    <ThemedText lightColor='white' style={{ textAlign: 'center' }}>ดูไฟล์ที่อัพโหลด</ThemedText>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        alignItems: 'center',
    },
    progressBarContainer: {
        height: 20,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 10,
        backgroundColor: '#eee',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#251bbd',
    },
    progressText: {
        position: 'absolute',
        alignSelf: 'center',
        color: '#fff',
        fontSize: 12,
    },
});

export default Index;
