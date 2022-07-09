import React, { useEffect, useState } from 'react'

//Components

import { FlatList, Text, TouchableOpacity, View } from 'react-native'

//Módulos de aúdio

import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

//Icons e Styles

import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import styles from './style';

//

export default function App({navigation}) {

	console.disableYellowBox = true;

	const [musica, setMusica] = useState(null);
	const [listaMusicas, setListaMusicas] = useState(null);

	const [nomeMusica, setNomeMusica] = useState(null);

	const [estaTocando, setEstaTocando] = useState(false);

	/////////////////////////////////////////

	Audio.setAudioModeAsync({
		allowsRecordingIOS: false,
		staysActiveInBackground: true,
		interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
		playsInSilentModeIOS: true,
		shouldDuckAndroid: true,
		interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
		playThroughEarpieceAndroid: false
	 });

	const tocarMusica = async (musicaSelecionada) => {

		setNomeMusica(musicaSelecionada.filename);

		const { sound } = await Audio.Sound.createAsync(musicaSelecionada);

		setMusica(sound);

		//console.debug(sound);

		setEstaTocando(true);
		
		await sound.playAsync();

	}

	const pausarOuTocarMusica = async () => {

		setEstaTocando(!estaTocando);
		
		if(estaTocando) {
			await musica.pauseAsync();
		} else {
			await musica.playAsync();
		}
			
	}

	useEffect(() => {
		return musica? () => {

			musica.unloadAsync();
			handleEstaTocandoChange();
		}
		: undefined;
		
	}, [musica]);

	const handleEstaTocandoChange = async () => {
		estaTocando(false)
	}

	/////////////////////////////////////////
	
	useEffect(() => {
		getPermission();
	}, []);

	const getPermission = async () => {
		const permission = await MediaLibrary.getPermissionsAsync();

		if (!permission.granted && permission.canAskAgain) {

			const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
			
			if (status === 'denied' && canAskAgain) {
				// display some allert or request again to read media files.
			  	getPermission();
			}
	  
			if (status === 'granted') {
			  	// we want to get all the audio files
			  	getAudioFiles();
			}
	  
			if (status === 'denied' && !canAskAgain) {
			  	// we want to display some error to the user
			}
		}

		if (permission.granted) {
			getAudioFiles();
		}

		if (!permission.canAskAgain && !permission.granted) {
			console.log("user denied and we can't ask again");
		}

	};

	function ordenarLista ( a, b ) {
		if ( a.filename < b.filename ){
		  return -1;
		}
		if ( a.filename > b.filename ){
		  return 1;
		}
		return 0;
	}

	const getAudioFiles = async () => {
		let midia = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });

		midia = await MediaLibrary.getAssetsAsync({
			mediaType: 'audio',
			first: midia.totalCount,
		});

		const midiaMP4 = [];

		for (var i = 0; i < midia.totalCount; i++) {

				const filename = midia.assets[i].filename;

				if(filename.slice(-3) == 'm4a') {
					
					midiaMP4.push(midia.assets[i]);

				}
		}

		midiaMP4.sort(ordenarLista);

		await setListaMusicas(midiaMP4);

	};
	 
	/////////////////////////////////////////

	function ListaMusicasRender({musica}) {
		return (
			<TouchableOpacity style={styles.musica} onPress={() => tocarMusica(musica)}>
				<MaterialCommunityIcons name="music-box" size={24} color="#b491c8" style={{marginHorizontal: 10}} />
				<Text  style={{color: 'white', width: 250, flexWrap: 'wrap'}}>
					{musica.filename.slice(0, -4)}
				</Text>
			</TouchableOpacity>
		)
	}
	
	return (
		<View style={styles.container}>

			<FlatList
			data={listaMusicas}
			style={styles.listaMusicas}
			renderItem = {( { item } ) => (
				<ListaMusicasRender musica={item} />
			)} />

			<View style={styles.inferior}>

				<MaterialCommunityIcons name="music-circle" size={50} color="darkgray" />

				<Text numberOfLines={2} style={styles.titulo}>
					{nomeMusica}
				</Text>

				<View style={{width: 50}}>
				{musica &&	
				<TouchableOpacity onPress={() => pausarOuTocarMusica()}>
					<MaterialCommunityIcons name={estaTocando?"pause-circle-outline":"play-circle-outline"} size={45} color="darkgray" />
				</TouchableOpacity>
				}
				</View>
			</View>
		</View>
	)
}
