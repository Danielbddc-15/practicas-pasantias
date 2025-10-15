import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explorar
        </ThemedText>
      </ThemedView>
      <ThemedText>Ejemplos y demostraciones de componentes de React Native.</ThemedText>
      <Collapsible title="Componentes de Entrada">
        <ThemedText>
          Aquí puedes probar diferentes tipos de inputs y formularios.
        </ThemedText>
        <ThemedText>
          • Campos de texto simples{'\n'}
          • Campos con validación{'\n'}
          • Selectores y switches{'\n'}
          • Botones personalizados
        </ThemedText>
      </Collapsible>
      
      <Collapsible title="Gestión de Estado">
        <ThemedText>
          Ejemplos de manejo de estado local y global en la aplicación.
        </ThemedText>
        <ThemedText>
          • useState para estado local{'\n'}
          • useEffect para efectos{'\n'}
          • Context API para estado global{'\n'}
          • Persistencia de datos
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 80, height: 80, alignSelf: 'center', marginTop: 10 }}
        />
      </Collapsible>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
