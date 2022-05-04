import React, { Component, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import { Button, Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';
import StockView from './stockView';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 200,
		},
	},
	mainBar: {
		display: 'inline-flex',
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightLight,
		position: 'relative',
	},
	layout: {
		width: 'auto',
	},
	paper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		padding: theme.spacing(2),
		background: '#F4F4F4',
	},
	tableWrapper: {
		width: '90%',
		margin: 'auto',
		marginTop: 15,
		marginBottom: 20,
	},

	modal: {
		marginLeft: '20%',
		marginTop: '10%',
		width: 1000,
		backgroundColor: '#FAFAFA',
	},
}));

export default function StockList() {
	const classes = useStyles();
	const location = useLocation();
	const history = useHistory();
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [page, setPage] = useState(0);
	const [currentStock, setCurrentStock] = useState();
	const [stockList, setStockList] = useState([]);
	const [favStocks, setFavStocks] = useState([]);
	const apikey = '513318dc9eee456cae5cf7875cc92851';

	useEffect(async () => {
		//this fills the main table
		await axios
			.get('https://api.twelvedata.com/stocks?exchange=NASDAQ')
			.then((response) => setStockList(response.data.data));
		// if there are any favorite stocks, this fills the favorites table
		if (location.state.favs) {
			let localFavs = [];
			for (let element of location.state.favs) {
				await axios
					.get(
						`https://api.twelvedata.com/stocks?symbol=${element}&exchange=NASDAQ`
					)
					.then((response) => localFavs.push(response.data.data[0]));
			}
			setFavStocks(localFavs);
		}
	}, []);
	const handeRowClick = (symbol) => {
		//this gets the symbol as a parameter and uses it to make the request
		//to do: algunas acciones devuelven "no esta incluida en tu plan", revisar documentacion
		axios
			.get(
				`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&start_date=2021-04-16%2009:48:00&end_date=2021-04-16%2019:48:00&apikey=513318dc9eee456cae5cf7875cc92851`
			)
			.then((response) => {
				setCurrentStock(response.data);
			})
			.then(handleOpen);
	};
	const handleFavDelete = (symbol) => {
		//this handles the deletion of favorites. At the moment it only works temporaly for display pruposes.
		let newFavs = [];
		for (let item of favStocks) {
			newFavs.push(item);
		}
		for (let i = newFavs.length - 1; i >= 0; i--) {
			if (newFavs[i].symbol === symbol) {
				newFavs.splice(i, 1);
			}
		}
		setFavStocks(newFavs);
	};
	//pagination
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	//modal handling
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	function ModalDisplay() {
		//this modal displays the stock data
		return (
			<React.Fragment>
				<Paper style={{ padding: 10 }}>
					<Box
						style={{
							padding: 30,
							display: 'flex',
							justifyContent: 'space-around',
						}}
					>
						{' '}
						<Typography variant="h6">
							Time Zone: {currentStock.meta.exchange_timezone}
						</Typography>
						<Typography variant="h6">
							Simbolo: {currentStock.meta.symbol}
						</Typography>
						<Typography variant="h6">
							Cotiza en: {currentStock.meta.exchange}
						</Typography>
					</Box>
					<StockView stockData={currentStock.values} />
				</Paper>
			</React.Fragment>
		);
	}
	return (
		<React.Fragment>
			<AppBar className={classes.mainBar} edge="start" color="primary">
				<Toolbar style={{ justifyContent: 'space-between' }}>
					<Typography variant="h6">Acciones</Typography>
					<Typography style={{ marginRight: 10 }}>
						Usuario: {location.state.user}
					</Typography>
				</Toolbar>
			</AppBar>
			<Paper>
				<Box p={2}>
					<Typography variant="h5">Mis Acciones</Typography>
					<TableContainer
						className={classes.tableWrapper}
						component={Paper}
					>
						<Table
							className={classes.table}
							aria-label="simple table"
						>
							<TableHead>
								<TableRow>
									<TableCell align="center">
										simbolo
									</TableCell>
									<TableCell align="center">nombre</TableCell>
									<TableCell align="center">moneda</TableCell>
									<TableCell align="center">
										exchange
									</TableCell>
									<TableCell align="right">
										opciones
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{favStocks.map((row) => (
									<TableRow key={row.symbol}>
										<TableCell
											component="th"
											align="center"
											scope="row"
											onClick={() =>
												handeRowClick(row.symbol)
											}
										>
											<Button>{row.symbol}</Button>
										</TableCell>
										<TableCell align="center">
											{row.name}
										</TableCell>
										<TableCell align="center">
											{row.currency}
										</TableCell>
										<TableCell align="center">
											{row.exchange}
										</TableCell>
										<TableCell align="right">
											<Button
												size="small"
												onClick={() =>
													handleFavDelete(row.symbol)
												}
											>
												quitar de favoritos
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
				<Box style={{ margin: 10 }}>
					<Typography variant="h5">Todas las Acciones</Typography>
					<TableContainer component={Paper}>
						<Table
							className={classes.tableWrapper}
							aria-label="simple table"
						>
							<TableHead>
								<TableRow>
									<TableCell>simbolo</TableCell>
									<TableCell align="right">nombre</TableCell>
									<TableCell align="right">moneda</TableCell>
									<TableCell align="right">
										exchange
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{stockList.map((row) => (
									<TableRow key={row.symbol}>
										<TableCell
											component="th"
											scope="row"
											onClick={() =>
												handeRowClick(row.symbol)
											}
										>
											<Button>{row.symbol}</Button>
										</TableCell>
										<TableCell align="right">
											{row.name}
										</TableCell>
										<TableCell align="right">
											{row.currency}
										</TableCell>
										<TableCell align="right">
											{row.exchange}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={stockList.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Box>
			</Paper>
			<Modal className={classes.modal} open={open} onClose={handleClose}>
				<ModalDisplay />
			</Modal>
		</React.Fragment>
	);
}
