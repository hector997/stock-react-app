import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { React } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import AppBar from '@material-ui/core/AppBar';
import { Button, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	modal: {
		marginLeft: '30%',
		marginTop: '20%',
		position: 'relative',
		width: 600,
		backgroundColor: '#FAFAFA',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	paper: {
		marginTop: '20%',
		marginBottom: theme.spacing(3),
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		padding: theme.spacing(4),
		width: 500,
		background: '#F4F4F4',
	},
	AppBar: {
		borderRadius: 5,
		marginBottom: 40,
		padding: 15,
		textTransform: 'uppercase',
		fontWeight: 600,
	},
	inputContainer: {
		textAlign: 'center',
	},
	buttonWrapper: {
		display: 'flex',
		flexDirection: 'column',
		width: '40%',
		margin: 'auto',
	},
	button: {
		marginTop: theme.spacing(2),
	},
}));

const usersData = [
	{
		id: 22238,
		name: 'admin',
		pw: 'admin',
		favs: ['TSLA', 'AAPL'],
	},
	{
		id: 11238,
		name: 'User1',
		pw: '123321',
		favs: ['TSLA', 'NTFX'],
	},
	{
		id: 12238,
		name: 'User2',
		pw: '123321',
		favs: ['TSLA', 'AACG', 'AAPL'],
	},
];

export default function Auth() {
	const classes = useStyles();
	const history = useHistory();

	const [loginUser, setLoginUser] = useState('');
	const [loginPw, setLoginPw] = useState('');
	const [loginFav, setLoginFav] = useState([]);
	const logIn = () => {
		let currentUser = null;
		let currentFavs = [];
		for (const user of usersData) {
			if (user.name === loginUser && user.pw === loginPw) {
				currentUser = loginUser;
				for (const item of user.favs) {
					currentFavs.push(item);
				}
				break;
			}
		}
		if (currentUser) {
			history.push('/dashboard', {
				user: currentUser,
				favs: currentFavs,
			});
		} else {
			document.querySelector('.error-display').style = 'display: block;';
		}
	};

	return (
		<Box>
			<Box style={{ display: 'inline-flex' }}>
				<Paper elevation={3} className={classes.paper}>
					<AppBar
						position="static"
						className={classes.AppBar}
						elevation={0}
					>
						iniciar sesion
					</AppBar>
					<Box className={classes.inputContainer}>
						<Box>Ingresá tus datos</Box>
						<Box
							className="error-display"
							color="text.secondary"
							style={{
								display: 'none',
							}}
						>
							Revisa tus credenciales
						</Box>
						<Box p={1}>
							<FormControl>
								<InputLabel htmlFor="filled-adornment-amount">
									Usuario
								</InputLabel>
								<Input
									key="user_name_key"
									type="User name"
									value={loginUser}
									onChange={(e) => {
										setLoginUser(e.target.value);
									}}
								/>
							</FormControl>
						</Box>
						<Box p={1}>
							<FormControl>
								<InputLabel htmlFor="filled-adornment-amount">
									Contraseña
								</InputLabel>
								<Input
									key="user_pw_key"
									type="password"
									value={loginPw}
									onChange={(e) => {
										setLoginPw(e.target.value);
									}}
								/>
							</FormControl>
						</Box>
						<Box className={classes.buttonWrapper}>
							<Button
								style={{
									display: 'flex',
									background: '#FAFAFA',
								}}
								className={classes.button}
								variant="contained"
								onClick={() => logIn(loginUser, loginPw)}
							>
								<Typography style={{ color: '#000000' }}>
									Ingresar
								</Typography>
							</Button>
						</Box>
					</Box>
				</Paper>
			</Box>
		</Box>
	);
}
