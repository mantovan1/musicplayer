import { Dimensions, StyleSheet } from "react-native"
import Constants from 'expo-constants';


export default StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
		alignItems: 'center',
		backgroundColor: 'black'
	},
	playlist: {
		width:  Dimensions.get('screen').width,
	},
	song: {
		flexDirection: 'row',
		width: '100%',
		height: 60,
		borderBottomWidth: 0.5,
		borderColor: 'darkgray',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	bottom: {
		width: '100%',
		height: Dimensions.get('screen').height * 0.15,
		backgroundColor: '#2e2e2e'
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
		fontWeight: 'bold',
		color: 'white'
	}
})