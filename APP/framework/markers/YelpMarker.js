/**
 * Created by krbalmryde on 11/20/14.
 */
//coffee
function YelpMarker(data, context) {

    this.display_phone = data.display_phone; //  "+1-312-733-7595"
    this.id = data.id; //  "lotus-cafe-and-bánh-mì-sandwiches-chicago"
    this.image_url = data.image_url; //  "http://s3-media1.fl.yelpcdn.com/bphoto/bFWtqYWPrkemeQDgSQ0OhQ/ms.jpg"
    this.is_claimed = data.is_claimed; //  true
    this.is_closed = data.is_closed; //  false
    this.latitude = data.location.coordinate.latitude; //  Object
    this.longitude = data.location.coordinate.longitude; //
    this.mobile_url = data.mobile_url; //  "http://m.yelp.com/biz/lotus-cafe-and-b%C3%A1nh-m%C3%AC-sandwiches-chicago"
    this.name = data.name; //  "Lotus Cafe & Bánh Mì Sandwiches"
    this.phone = data.phone; //  "3127337595"
    this.rating = data.rating; //  4.5
    this.rating_img_url = data.rating_img_url; //  "http://s3-media2.fl.yelpcdn.com/assets/2/www/img/99493c12711e/ico/stars/v1/stars_4_half.png"
    this.rating_img_url_large = data.rating_img_url_large; //  "http://s3-media4.fl.yelpcdn.com/assets/2/www/img/9f83790ff7f6/ico/stars/v1/stars_large_4_half.png"
    this.rating_img_url_small = data.rating_img_url_small; //  "http://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png"
    this.review_count = data.review_count; //  194
    this.snippet_image_url = data.snippet_image_url; //  "http://s3-media1.fl.yelpcdn.com/photo/A62v2zCzNKPYdkYZdTMCUg/ms.jpg"
    this.snippet_text = data.snippet_text; //  "It is a long, long way from River North to University Street on a Divvy. Despite this, I find that I can't wait to make the 20-minute journey south..."
    this.url = data.url; //  "http://www.yelp.com/biz/lotus-cafe-and-b%C3%A1nh-m%C3%AC-sandwiches-chicago"

    this.controller =  context;
    var self = this;
    var yelpClick = function(e){
        context.getTwitters('food');
    };


    var popupstr = "<p><b>" + this.name + " </b>" +
        "</br><b>Phone #:</b> "+ this.phone +
        "</br><img src='"+ this.rating_img_url_large + "'/>" +
        "</br><b># of Reviews:</b> " + this.review_count +
        "</br><b>Snippet:</b> " + this.snippet_text  +
        "</br><img src='"+ this.snippet_image_url + "'/>" +"</p>";

        //"</br><img src='http://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png'/></p>"


    var latlng = L.latLng(this.latitude, this.longitude);

    var iconOld = L.AwesomeMarkers.icon({
        icon: "yelp",
        spin:false,
        markerColor: "darkred",
        iconColor: "white"
    });

    var iconNew = L.AwesomeMarkers.icon({
        icon: "yelp",
        spin:false,
        markerColor: "darkred",
        iconColor: "white"
    });

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();

    this.marker.on("click", yelpClick);
}


