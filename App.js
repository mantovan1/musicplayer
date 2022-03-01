import React, { useEffect, useState } from 'react'

import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Constants from 'expo-constants';

import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

export default function App() {

	/////////////////////////////////////////

	const [sound, setSound] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const [selected, setSelected] = useState(null);

	async function playSound(song) {
		console.log('Loading Sound');

		setSelected(song.filename);

		const { sound } = await Audio.Sound.createAsync(
			song
		);
		setSound(sound);
	
		console.log('Playing Sound');
		await sound.playAsync();
		setIsPlaying(true);
	}
	
	useEffect(() => {
		return sound
		  ? () => {
			  console.log('Unloading Sound');
			  sound.unloadAsync();
			  setIsPlaying(false);
			}
		  : undefined;
	}, [sound]);

	async function stopSound() {
		setIsPlaying(!isPlaying);
		
		if(isPlaying) {
			sound.pauseAsync();
		} else {
			await sound.playAsync();
		}
			
	}

	/////////////////////////////////////////
	

	const [songs, setSongs] = useState(null);
	
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
			// we want to get all the audio files
			getAudioFiles();
		 }
		 if (!permission.canAskAgain && !permission.granted) {
			console.log("user denied and we can't ask again");
		 }
	};

	const getAudioFiles = async () => {
		let media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
		await setSongs(media.assets);
		console.debug(songs);
	 };
	
	return (
		<View style={styles.container}>
			<Text>Music App</Text>

			<FlatList
			data={songs}
			style={styles.playlist}
			renderItem={( { item } ) => (
				<TouchableOpacity style={styles.song} onPress={() => {playSound(item)}}>
					<MaterialCommunityIcons name="music-box" size={24} color="black" style={{marginHorizontal: 10}} />
					<Text>
						{item.filename}
					</Text>
				</TouchableOpacity>
			)} />

			<View style={styles.bottom}>
				<View style={styles.sub_bottom}>
					<MaterialCommunityIcons name="music-circle" size={50} color="black" />
					<Text numberOfLines={2} style={styles.title}>
						{selected}
					</Text>
					<TouchableOpacity onPress={() => stopSound()}>
						<MaterialCommunityIcons name={isPlaying?"pause-circle-outline":"play-circle-outline"} size={40} color="black" />
					</TouchableOpacity>
				</View>

				<View style={{width: '100%', height: 1.5, backgroundColor: 'black'}} />

				<View style={styles.sub_bottom}>
					<View style={{width: '50%', alignItems: 'center'}}>
						<MaterialCommunityIcons name="headset" size={35} color="black" />
					</View>

					<View style={{width: '50%', alignItems: 'center'}}>
						<MaterialCommunityIcons name="headset" size={35} color="black" />
					</View>
				</View>
				
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
		alignItems: 'center',
		backgroundColor: "#fff"
	},
	playlist: {
		width:  Dimensions.get('screen').width,
	},
	song: {
		flexDirection: 'row',
		width: '100%',
		height: 60,
		borderBottomWidth: 1,
		borderColor: 'black',
		alignItems: 'center'
	},
	bottom: {
		width: '100%',
		height: Dimensions.get('screen').height * 0.15,
		backgroundColor: 'darkgray'
	}, 
	sub_bottom: {
		flexDirection: 'row',
		width: '100%',
		height: '50%',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	title: {
		width: 120,
		fontSize: 15,
		fontWeight: 'bold'
	}
})