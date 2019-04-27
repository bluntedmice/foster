import React, {
	Component
} from 'react';

import z from 'zipcodes'
import NodeGeocoder from 'node-geocoder';
import Marker from './Marker.js'
import adapter from '../adapters/adapter.js';
import NewPlace from './modals/NewPlace';
import net from 'net';
import ReactMapGL, {
	NavigationControl
} from 'react-map-gl';

export default class Main extends Component {
	static defaultProps = {
		currentUser: {
			user: {}
		}
	}


	state = {
		places: [],
		modal: false,
		viewport: {
			width: '100wh',
			height: `100vh`,
			latitude: 37.2372,
			longitude: 115.8018,
			zoom: 15
		}
	};

	componentDidMount() {
		this._locateUser()

		adapter.getPlaces()
			.then(places => {
				this.setState({
					places
				})
			})

	}

	changeHandler = e => {

		this.setState({
			[e.target.name]: e.target.value
		});
	};

	toggle = () => {

		this.setState(prevState => ({
			modal: !prevState.modal
		}), () => console.log(this.state.modal));
	}

	_locateUser = () => {
		navigator.geolocation.getCurrentPosition(position => {

			this.setState({
				viewport: {
					width: '100wh',
					height: `100vh`,
					longitude: position.coords.longitude,
					latitude: position.coords.latitude,
					zoom: 15
				}
			});

		});
	}



	render() {





		const MARKERS = this.state.places.map(place => {
			const addressParams = place.address.split(" ").join('+')



			// not working??
			console.log(adapter.getCoords(addressParams))


			// <Marker key={place.id} latitude={} longitude={}  place={place}/>

		}).reverse()




		return (
			<div>
				<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<h2 class="t-1 nav-logo fg-dark-navy font-weight-600 mx-4 text-uppercase text-spaced">Foster</h2>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item active">
					<button class="nav-btn" onClick={this.toggle}> New Place! </button>
				</li>
			</ul>


			<form class="form-inline my-2 my-lg-0">
				<input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
				<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
			</form>
		</div>
	</nav>
			<ReactMapGL
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
      >


      <div style={{position: 'absolute', right: 0}}>
          <NavigationControl container={document.querySelector('body')}/>


        </div>

			 <Marker  latitude={40.819572} longitude={-73.848829}  />
{MARKERS}
         <NewPlace modal={this.state.modal} toggle={this.toggle} />




    </ReactMapGL>
	</div>)

	}
}