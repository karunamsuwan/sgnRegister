import { Stack } from 'expo-router';

const PagesLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="files" options={{ headerShown: false }} />
        </Stack>
    );
};

export default PagesLayout;