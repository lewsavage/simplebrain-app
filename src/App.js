import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user:
  {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaces = (data) => {
    let image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      topRow: data.top_row * height,
      rightCol: width - (data.right_col * width),
      bottomRow: height - (data.bottom_row * height),
      leftCol: data.left_col * width
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    event.preventDefault();

  }


  onButtonSubmit = () => {

    this.setState({ imageUrl: this.state.input })

    const imageAPICallUrl = 'https://calm-crag-01924.herokuapp.com/imageAPI/';
    const imageAPICallHeaders = {
      'method': 'post',
      'headers': { 'Content-Type': 'application/json' },
      'body': JSON.stringify({
        'input': this.state.input
      })
    }

    const imageRouteCall = 'https://calm-crag-01924.herokuapp.com/image';
    const imageRouteCallOptions = {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.state.user.id
      })
    };

    fetch(imageAPICallUrl, imageAPICallHeaders)
      .then(response => response.json())
      .then(result => (result.outputs[0].data.regions[0].region_info.bounding_box))
      .then(result => this.displayFaceBox(this.calculateFaces(result)))
      .then(() => {
        fetch(imageRouteCall, imageRouteCallOptions)
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(err => console.log('Error!', err));
      })
      .catch(error => console.log('Error: ', error));
  }


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);

    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg num={110} color="#ffffff" type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} route={this.state.route} />


        {route === 'home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
            />
          </div>
          : (route === 'signin' || route === 'signout'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : (route === 'register'
              ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <div></div>))
        }
      </div>
    );
  }
}
export default App;
