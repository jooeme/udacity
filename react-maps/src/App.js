import React from "react";
import "./index.css";
import PlacesList from "./PlacesList.js";
import Header from "./Header.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      mapLoaded: false,
      places: [
        {
          name: "北京故宫",
          coords: { lat: 39.9163447, lng: 116.3971546 }
        },
        {
          name: "上海博物馆",
          coords: { lat: 31.22928, lng: 121.47203 }
        },
        {
          name: "天津大学",
          coords: { lat: 39.10924, lng: 117.17491 }
        },
        {
          name: "深圳会展中心",
          coords: { lat: 22.53079, lng: 114.059884 }
        },
        {
          name: "杭州",
          coords: { lat: 30.2221, lng: 120.12833 }
        },
        {
          name: "乔家大院",
          coords: { lat: 37.407076, lng: 112.433645 }
        }
      ],
      chosenMarker: null //标志和打开的信息
    };

    this.showInfoWin = this.showInfoWin.bind(this);
  }

  componentDidMount() {
    window.initMap = this.mapSetup;
    // google maps api 密匙
    loadJS(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC2RAAhBeyBk0M9-QFCHrCMzT3xG-cWnFY&libraries=places&callback=initMap"
    );
  }

  //点击后显示
  showInfoWin(marker) {
    this.state.chosenMarker && this.state.chosenMarker.setAnimation(null);
    var place = this.state.places.filter(place => {
      return place.marker === marker;
    })[0];
    this.setState({ chosenMarker: marker });
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.populateInfoWindow(place);
    this.state.infoWin.open(this.state.map, marker);
  }

  //隐藏
  hideInfoWin = () => {
    this.state.infoWin.close();
    this.state.chosenMarker && this.state.chosenMarker.setAnimation(null);
    this.setState({ chosenMarker: null });
  };

  //当前标记显示的内容
  populateInfoWindow(place) {
    var content =
      "<div id='loc-name'><strong>名称: </strong>" + place.name + "</div>";
    var errorMsg = "<div id='foursquare-error'>加载数据失败...</div>";

    //从 Foursquare 获取信息
    var self = this;
    var clientId = "HCFKSRBOE34ZWFFURMZYDY1F4HT2D3OHGOXFMU12H5Y3LTVU";
    var clientSecret = "G4MBBX2XNBGQJYQ3QJJY1N2ZPVTB1R05CHPT5N5LM3X4P5IL";
    var url =
      "https://api.foursquare.com/v2/venues/search?client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret +
      "&v=20180803&ll=" +
      place.marker.getPosition().lat() +
      "," +
      place.marker.getPosition().lng() +
      "&limit=1";

    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          content += errorMsg;
          console.log(content);
          self.state.infoWin.setContent(content);
          return;
        }

        //获取地址信息
        response.json().then(function(data) {
          var placeData = data.response.venues[0];
          var placeAddress =
            "<div><strong>地址: </strong>" +
            (placeData.location.address == undefined
              ? "从 foursquare 获取地址失败"
              : placeData.location.address) +
            "</div>";
          content += placeAddress;
          var fourSquareLink =
            '<a href="https://foursquare.com/v/' +
            placeData.id +
            '" target="_blank" style="color:red;">点击打开 Foursquare 获取更多信息</a>';
          content += fourSquareLink;
          self.state.infoWin.setContent(content);
        });
      })
      .catch(function(err) {
        console.log(err);
        content += errorMsg;
        self.state.infoWin.setContent(content);
      });
  }

  //初始化 google maps
  mapSetup = () => {
    var self = this;
    //
    let map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 39.9163447, lng: 116.3971546 },
      zoom: 18,
      mapTypeId: "roadmap",
      disableDefaultUI: true
    });
    this.setState({ map });
    //adding markers to map
    this.addMarkers(map, self);

    //检查地图是不是正确加载
    window.google.maps.event.addListener(map, "tilesloaded", function() {
      self.setState({ mapLoaded: true });
      //清除监听
      window.google.maps.event.clearListeners(map, "tilesloaded");
    });
  };

  addMarkers(map, obj) {
    //信息窗口
    var infoWin = new window.google.maps.InfoWindow();
    obj.setState({ infoWin });

    //关闭infowin事件
    window.google.maps.event.addListener(infoWin, "closeclick", () =>
      obj.hideInfoWin()
    );

    //显示所有标记
    var mapBounds = new window.google.maps.LatLngBounds();

    var currPlaces = obj.state.places;
    for (var i = 0; i < obj.state.places.length; i++) {
      var marker = new window.google.maps.Marker({
        position: obj.state.places[i].coords,
        name: obj.state.places[i].name
      });
      marker.setMap(map);
      mapBounds.extend(marker.position);

      currPlaces[i].marker = marker;

      window.google.maps.event.addListener(
        marker,
        "click",
        (function(marker) {
          return function() {
            obj.hideInfoWin();
            obj.showInfoWin(marker);
          };
        })(marker)
      );
    }
    map.fitBounds(mapBounds);
    obj.setState({ places: currPlaces });
  }

  render() {
    return (
      <div id="app">
        <Header />
        {this.state.mapLoaded && (
          <PlacesList
            id="locations-list"
            places={this.state.places}
            showInfoWin={this.showInfoWin}
            hideInfoWin={this.hideInfoWin}
          />
        )}
        {!this.state.mapLoaded && (
          <div>
            <h2>Loading Goolge Maps...</h2>
          </div>
        )}
        <div className="maps">
          <div
            id="map"
            role="application"
            aria-label="google map"
            tabIndex="-1"
          />
        </div>
      </div>
    );
  }
}

export default App;

//google maps 加载
function loadJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
}
