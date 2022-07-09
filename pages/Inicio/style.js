import { Dimensions, StyleSheet } from "react-native"
import Constants from 'expo-constants';


export default StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
		alignItems: 'center',
		backgroundColor: 'black'
	},
	listaMusicas: {
		width:  Dimensions.get('screen').width,
	},
	musica: {
		flexDirection: 'row',
		width: '100%',
		height: 60,
		borderBottomWidth: 0.5,
		borderColor: 'black',
		alignItems: 'center',
		backgroundColor: '#2e2e2e'
	},
	inferior: {
		flexDirection: 'row',

		width: '100%',
		height: Dimensions.get('screen').height * 0.1,
		backgroundColor: '#252525',
	
		alignSelf: 'flex-end',
		alignItems: 'center',
		justifyContent: 'space-around'

	},
	titulo: {
		width: 120,
		fontSize: 15,
		fontWeight: 'bold',
		color: 'white'
	}
})